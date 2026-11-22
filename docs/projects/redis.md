# Socket Programming

Built with C/C++ — [Build Your Own Redis](https://build-your-own.org/redis/)

- **TCP**: Produces a continuous stream of bytes with no internal message boundaries.
    - Interpreting the byte stream is the job of an application protocol.
- **Data serialization** is the process of converting data developers work with (objects, strings, structs, etc.) into binary. The reverse process is called **deserialization**.
- **Concurrent programming** is used in socket programming because software needs to handle multiple connections simultaneously.
    - Modern scalable applications commonly use event-based concurrency with event loops, as seen in software like NGINX and Redis.
## Protocol Layers
- In reality: Ethernet contains IP, IP contains UDP or TCP, and UDP/TCP contain application protocols.
- Alternatively, we can divide the layers by function:
    - **Small, discrete messages (IP)**: Data is transmitted in packets because hardware and networks handle smaller units. Higher layers, such as TCP, assemble these into a continuous application-level byte stream.
    - **Multiplexing (port number)**: UDP/TCP adds a 16-bit port number to distinguish different applications. Each application uses a local port to send or receive data.
        - The computer uses a 4-tuple to identify a network flow: `src_ip, src_port, dst_ip, dst_port`.
        - **Demultiplexing** allows the computer to determine which application should receive incoming packets when multiple applications share a network interface.
- **TCP/IP model** (higher to lower):
    - TCP: Reliable, ordered byte stream.
    - UDP/TCP: Port numbers for multiplexing applications.
    - IP: Routing and delivery of packets.
    - Ethernet: Local network communication using MAC addresses.
### What's relevant?
- **IP, ports, TCP/UDP**
- Typical applications don't interact directly with the IP layer because multiplexing is a universal need.
    - We generally care about source and destination addresses and ports.
- Ethernet is below IP and uses **MAC addresses**.
    - MAC addresses are used for communication on local networks, such as by network switches.
    - We generally don't need to interact with this layer directly.
- Everything we're building here operates on top of TCP/IP.

---
## Socket Primitives
### What's a socket?
- A socket is a handle used to refer to a networking endpoint.
    - A handle is an opaque value used to reference resources across an API boundary.
    - The OS tracks the resource without the application needing to know how it is represented internally.
- The API for networking is called the **socket API**.
- `socket()` allocates and returns a socket file descriptor (`fd`).
    - UNIX treats sockets as file descriptors, hence `fd`.
    - The descriptor can be used with networking system calls.
- A handle must be **closed** when you're finished to release its associated OS resources.
### Listening socket & connection socket
- Listening is telling the OS that an application is ready to accept TCP connections on a given IP address and port.
- `bind()` associates the socket with a local address.
- `listen()` marks the socket as a passive listening socket and establishes a queue for incoming connection requests.
- `accept()` retrieves an incoming connection and returns a new socket handle for communicating with that client.

This gives us two types of socket roles:
- **Listening socket**: Accepts incoming connections.
- **Connection socket**: Communicates with an individual client.

Creating a listening socket:
1. Create a socket handle: `socket()`.
2. Set the listening IP:port: `bind()`.
3. Mark the socket as listening: `listen()`.
4. Accept incoming TCP connections: `accept()`.

```c
fd = socket();
bind(fd, address);
listen(fd);

while (true) {
    conn_fd = accept(fd);
    do_something_with(conn_fd);
    close(conn_fd);
}
```

Connecting from a client:
1. Obtain a socket handle: `socket()`.
2. Establish the connection: `connect()`.

```c
fd = socket();
connect(fd, address);
do_something_with(fd);
close(fd);
```

To summarise:
- `socket()` creates a socket with a specified address family, type and protocol.
- `bind()` associates a local address with the socket.
- `listen()` makes a bound TCP socket a listening socket.
- `accept()` creates a new connection socket for an incoming client.
- `connect()` establishes an outgoing connection.
- `setsockopt()` can configure additional socket options.

### Read and Write
TCP and UDP provide different services but share the socket API. Let's take `send()` and `recv()` for example:
- **UDP (message-based)**: Each `send()`/`recv()` corresponds to a datagram (message).
- **TCP (byte-stream based)**: Each `send()` appends data to the byte stream, and each `recv()` consumes available data from it.
    - TCP does not preserve message boundaries. One `send()` does not necessarily correspond to one `recv()`.
    - TCP and UDP are semantically different, so code for one should not automatically be assumed to work for the other.
### Summary: Socket primitives
- Create a socket handle: `socket()`.
- Listening TCP socket:
    - `bind()`
    - `listen()`
    - `accept()`
    - `close()`
- Using a TCP socket:
    - `read()`
    - `write()`
    - `close()`
- Create a TCP connection: `connect()`.

---

## Concurrent I/O
### Why do we need concurrent I/O?
A connection-oriented request-response protocol can be used for any number of request-response pairs. A client can also keep its connection open for as long as it wants.

This means a server needs to handle multiple connections simultaneously.

For example:
- Client A sends a request.
- Client B hasn't sent anything.
- Client C sends a request.

If the server blocks while waiting for Client B, it cannot process Client C using a simple sequential approach.

There are different ways to solve this.
### Thread-based concurrency
One traditional solution is to create a new thread for every connection.

```python
fd = socket()
bind(fd, address)
listen(fd)

while True:
    conn_fd = accept(fd)
    new_thread(do_something_with, conn_fd)

def do_something_with(conn_fd):
    while not_quitting(conn_fd):
        req = read_request(conn_fd)  # Blocks thread
        res = process(req)
        write_response(conn_fd, res)  # Blocks thread

    close(conn_fd)
```

Each connection gets its own thread, meaning one client waiting for data doesn't prevent other clients from being processed.

**Why aren't threads always enough?**
- **Memory usage**: Every thread has its own stack for local variables and function calls. Many threads can consume significant memory.
- **Overhead**: Creating and managing large numbers of threads introduces CPU and memory overhead.
- **Latency**: Creating threads for large numbers of short-lived connections can add overhead.

Processes can also be created per connection using `fork()`, but this generally involves even more resource overhead.

Threads and processes are still useful when connection counts are manageable. They also have an advantage: they are generally easier to understand and implement than event-driven concurrency.

### Event-based concurrency
Modern scalable servers often use **event loops** to handle concurrent I/O without creating a separate thread for every connection.

To understand this, we need to understand what happens when we call `read()` and `write()`.

**How** **`read()`** **works:**
- The Linux TCP stack receives incoming network packets.
- Incoming data is placed into a kernel-side buffer associated with the socket.
- `read()` copies data from this kernel buffer into the application's buffer.
- If the kernel buffer is empty, a blocking `read()` suspends the calling thread until data becomes available.

**How** **`write()`** **works:**
- `write()` copies application data into a kernel-side socket buffer.
- The TCP stack handles transmitting that data over the network.
- If the kernel buffer is full, a blocking `write()` suspends the calling thread until space becomes available.

The problem is that a server may have hundreds or thousands of sockets, and we don't want to block while waiting for any individual socket.

**The solution:** If we can wait for multiple sockets to become ready simultaneously, we can process whichever sockets are ready without blocking on individual connections.

### How an event loop works
Conceptually:
```python
while running:
    want_read = [...]   # Socket fds to monitor for reading
    want_write = [...]  # Socket fds to monitor for writing

    can_read, can_write = wait_for_readiness(
        want_read,
        want_write
    )

    for fd in can_read:
        data = read_nb(fd)
        handle_data(fd, data)

    for fd in can_write:
        data = pending_data(fd)
        n = write_nb(fd, data)
        data_written(fd, n)
```

An event loop involves three main mechanisms:
1. **Readiness notification**: Wait for multiple sockets and return when one or more are ready for reading or writing.
2. **Non-blocking read**: Consume available data without waiting for more data.
3. **Non-blocking write**: Write available data without waiting for additional buffer space.

Each loop iteration waits for readiness events and then processes the sockets that are ready.

This allows one thread to manage many connections without blocking on individual sockets.

---

## TCP Server and Client
### 1. Obtain a socket handle
- `socket()` takes three arguments:
    - Address family.
    - Socket type.
    - Protocol.
- The `0` tells the OS to select the default protocol for the requested address family and socket type.

```c
int fd = socket(AF_INET, SOCK_STREAM, 0);

if (fd < 0) {
    // Handle error
}
```

The combinations of the three arguments determine the socket configuration:

| Protocol       | Arguments                          |
| -------------- | ---------------------------------- |
| **IPv4 + TCP** | `socket(AF_INET, SOCK_STREAM, 0)`  |
| **IPv6 + TCP** | `socket(AF_INET6, SOCK_STREAM, 0)` |
| **IPv4 + UDP** | `socket(AF_INET, SOCK_DGRAM, 0)`   |
| **IPv6 + UDP** | `socket(AF_INET6, SOCK_DGRAM, 0)`  |

### 2. Read & Write
When reading and writing, it's important to handle partial transfers and certain error conditions.
#### EAGAIN / EWOULDBLOCK
- Indicates that the requested operation would block.
- Commonly encountered when using non-blocking sockets.
- `read()`: No data is currently available.
- `write()`: The socket cannot currently accept more data.
- The syscall returns `-1`, with `errno` set to `EAGAIN` or `EWOULDBLOCK`.
- Rather than repeatedly retrying (busy looping), we use an event loop to monitor socket readiness and return to the operation when it can make progress.
- On Linux, `EAGAIN` and `EWOULDBLOCK` have the same value. Portable code should check both.
#### EINTR
- Indicates that a syscall was interrupted by a signal before completing.
- The syscall returns `-1`, with `errno` set to `EINTR`.
- Usually, we retry the syscall using a loop.
- If some bytes were transferred before interruption, the syscall normally returns the number of bytes transferred instead of `-1`.
- We must track partial reads and writes so we don't overwrite or resend data.
#### EOF (End of File)
- When `read()` returns `0`, the peer has closed its sending side of the connection.
- This is different from `EINTR` and `EAGAIN`.
- When reading a fixed amount of data, EOF before receiving everything means the read was incomplete.

It's also important to ensure we read or write the entire intended amount of data. Sometimes a single syscall is not sufficient.

The following functions handle partial transfers and `EINTR` for blocking sockets:

```c
int32_t read_full(int fd, char *buf, size_t n) {
    while (n > 0) {
        ssize_t rv = read(fd, buf, n);

        if (rv < 0) {
            if (errno == EINTR) continue;
            return -1;
        }

        if (rv == 0) return -1;

        assert((size_t)rv <= n);
        n -= (size_t)rv;
        buf += rv;
    }

    return 0;
}

int32_t write_all(int fd, const char *buf, size_t n) {
    while (n > 0) {
        ssize_t rv = write(fd, buf, n);

        if (rv < 0) {
            if (errno == EINTR) continue;
            return -1;
        }

        if (rv == 0) return -1;

        assert((size_t)rv <= n);
        n -= (size_t)rv;
        buf += rv;
    }

    return 0;
}
```

**Important:** These helpers are intended for blocking sockets. On non-blocking sockets, they also need to handle `EAGAIN` / `EWOULDBLOCK` without busy looping.

### 3. Non-blocking I/O
Non-blocking reads and writes use the same syscalls as blocking reads and writes.

The `O_NONBLOCK` flag changes how the socket behaves.
#### Non-blocking read behaviour
- If the read buffer contains data, `read()` returns available data immediately.
- If the read buffer is empty, `read()` returns `-1` with `errno` set to `EAGAIN` or `EWOULDBLOCK`.
- Reads can be repeated to drain the available data from the kernel buffer.
#### Non-blocking write behaviour
- If the write buffer has available space, `write()` accepts data immediately.
- If the buffer cannot accept any data, `write()` returns `-1` with `errno` set to `EAGAIN` or `EWOULDBLOCK`.
- If the requested data exceeds the available buffer space, `write()` may perform a partial write.
- Writes can be repeated as buffer space becomes available.

The important distinction is that non-blocking I/O never waits inside the syscall for the operation to become possible.
#### Enable non-blocking mode
The `fcntl()` syscall gets and sets file status flags.

`O_NONBLOCK` puts a socket into non-blocking mode.

```c
static void fd_set_nonblock(int fd) {
    int flags = fcntl(fd, F_GETFL, 0);  // Get the flags

    if (flags < 0) {
        die("fcntl F_GETFL");
    }

    flags |= O_NONBLOCK;                // Modify the flags

    if (fcntl(fd, F_SETFL, flags) < 0) {
        die("fcntl F_SETFL");
    }
}
```

- `F_GETFL`: Retrieves the current file status flags.
- `O_NONBLOCK`: Enables non-blocking mode.
- `F_SETFL`: Applies the modified flags.

We use bitwise OR (`|=`) to enable `O_NONBLOCK` without overwriting the existing flags.
#### Non-blocking accept()
`accept()` is similar to `read()` because it consumes an item from a queue.
- A listening socket maintains a queue of incoming connections.
- A blocking `accept()` waits until a connection is available.
- A non-blocking `accept()` returns `EAGAIN` / `EWOULDBLOCK` if there are no pending connections.

The event loop can monitor the listening socket for readability.

When it becomes readable, we call `accept()` to retrieve an incoming connection.

```python
for fd in can_read:
    if fd is a listening socket:
        conn_fd = accept_nb(fd)
        handle_new_conn(conn_fd)
    else:
        data = read_nb(fd)
        handle_data(fd, data)
```

The newly accepted connection socket should also be configured for non-blocking I/O.

---
## Readiness APIs
Waiting for I/O readiness is platform-specific. There are several APIs available.
Conceptually:

```c
can_read, can_write = wait_for_readiness(
    want_read,
    want_write
)
```

### poll()
The simplest readiness API to understand on Linux is `poll()`.
```c
int poll(struct pollfd *fds, nfds_t nfds, int timeout);

struct pollfd {
    int   fd;
    short events;   // Requested events
    short revents;  // Returned events
};
```

`poll()` takes an array of file descriptors, each with an input flag and an output flag.
- `events`: Indicates what we want to monitor.
    - `POLLIN`: Ready for reading.
    - `POLLOUT`: Ready for writing.
    - `POLLIN | POLLOUT`: Monitor both.
- `revents`: Indicates which events are ready when `poll()` returns.
- `timeout`: Controls how long `poll()` waits. This can also be used to implement timers.
### Other readiness APIs
- **select()**
    - Available on Unix and Windows.
    - Similar to `poll()`.
    - Common implementations have a descriptor limit (often `FD_SETSIZE`, typically 1024 on Linux).
    - Less suitable for large numbers of connections.
- **epoll_wait()**
    - Linux-specific.
    - Unlike `poll()`, the file descriptor list is maintained in the kernel
    - `epoll_ctl()` adds, modifies or removes descriptors from the monitored set.
    - More scalable than `poll()` for large numbers of connections because the entire descriptor list doesn't need to be passed and scanned on every wait.
- **kqueue()**
    - BSD-specific.
    - Provides similar event notification functionality to `epoll`.

We will use `poll()` because it is the simplest to understand and implement.

However, `epoll` is generally the preferred choice for scalable Linux applications.

The readiness APIs differ in their interfaces, but the underlying concept is the same.

### Readiness APIs cannot be used for regular disk file I/O
Readiness APIs work with sockets, pipes and certain special file descriptors.

They are generally not useful for regular disk files.

Why?
- For a socket, readiness means data is available in the kernel buffer or space is available in the write buffer.
- For a regular disk file, the OS generally reports it as ready even though accessing the file may still require disk I/O.

This means readiness notification doesn't guarantee that disk I/O will be non-blocking.

Therefore, traditional disk file I/O should generally be handled outside the event loop, often using a thread pool.

On Linux, `io_uring` provides a different approach that supports asynchronous file and network I/O, but it is a separate API and outside the scope of our current implementation.

## Summary: Concurrent I/O techniques

| Type            | Method                 | API                 | Scalability               |
| --------------- | ---------------------- | ------------------- | ------------------------- |
| Socket          | Thread per connection  | `pthread`           | Lower                     |
| Socket          | Process per connection | `fork()`            | Lower                     |
| Socket          | Event loop             | `poll()`, `epoll()` | High                      |
| File            | Thread pool            | `pthread`           | Depends on implementation |
| File and socket | Asynchronous I/O       | `io_uring`          | High                      |

### Key takeaways
- Blocking I/O makes the calling thread wait when an operation cannot make progress.
- Non-blocking I/O returns immediately when an operation cannot make progress.
- Readiness APIs allow us to monitor multiple sockets simultaneously.
- Event loops combine readiness notification with non-blocking I/O.
- This allows a single thread to manage many connections without needing a separate thread for each one.

## The Event Loop
```python
# PSEUDOCODE
while running:
    want_read = [...]           # socket fds
    want_write = [...]          # socket fds
    can_read, can_write = wait_for_readiness(want_read, want_write) # blocks!
    for fd in can_read:
        data = read_nb(fd)      # non-blocking, only consume from the buffer
        handle_data(fd, data)   # application logic without IO
    for fd in can_write:
        data = pending_data(fd) # produced by the application
        n = write_nb(fd, data)  # non-blocking, only append to the buffer
        data_written(fd, n)     # n <= len(data), limited by the available space

```
- Some libraries abstract the event loop away and the loop then interacts with application code via callbacks, and the application code interacts with the event loop via an API.
	- The point of bringing this up is there is an implicit boundary between the event loop code and application code.
### Per-connection state
- An application task can span multiple event loop iterations, so the state must be explicitly stored somewhere.
- ```c
	// per-connection state struct
	struct Conn {
	    int fd = -1;
	    // application's intention, for the event loop
	    bool want_read = false;
	    bool want_write = false;
	    bool want_close = false;
	    // buffered input and output
	    std::vector<uint8_t> incoming;  // data to be parsed by the application
	    std::vector<uint8_t> outgoing;  // responses generated by the application
	};
  ```

**The need for input buffers**: Since reads are non-blocking, we can't just read everything in one clean linear go. Instead, at each iteration, if the socket is ready to read, we will do:
1. Do a non-blocking read.
2. Add new data to `Conn::incoming` buffer.
3. Try to parse the accumulated buffer.
	- If there is not enough data, do nothing in that iteration.
4. Process the parsed message.
5. Remove the message from `Conn::incoming`.

**Why buffer output data?** 
We can't write to sockets at will, seeing as the writes are non-blocking. Data is only written when ready to write. Due to this nature, the response data must be stored in a buffer (`Conn::outgoing`).

### Event loop code
#### Map from fd to connection state
- `poll()` returns a fd list, and we need to map each fd to the `Conn` object.
```c
// a map of all client connections, keyed by fd
std::vector<Conn *> fd2conn;
```
- On Unix, an fd is allocated as the smallest avaiable non-negative integer, so the mapping form fd to `Conn` can be a flat array indexed by fd, and the array will be densely packed.
#### The poll() syscall
The readiness API takes a list of fds that the program wants to do IO on, then returns a list of fds ready for IO. There are 2 types of readiness: read and write.
```c
int poll(struct pollfd *fds, nfds_t nfds, int timeout);

struct pollfd {
    int   fd;
    short events;   // request: want to read, write, or both?
    short revents;  // returned: can read? can write?
};
```
- The `nfds` arg is the size of the `fds` array.
- The `timeout` arg is set to -1, which means no timeout.
- `pollfd::events` is a combination of `POLLIN`, `POLLOUT`, `POLLERR`:
	- `POLLIN` & `POLLOUT`correspond to the `want_read` & `want_write` fd list.
	- `POLLERR` indicates a socket error that we always want to be notified about.
- `pollfd::revents` is returned by `poll()`. It uses the same set of flags to indicate whether the fd is in the `can_read` or `can_write` list.

#### Step 1: Construct the fd list for `poll()`
The app code decides the type of readiness notifications. It communicates with the event loop via `want_read` and `want_write` flags in `Conn`, the `fds` arg is then constructed from these flags.
```c
    // a map of all client connections, keyed by fd
    std::vector<Conn *> fd2conn;
    // the event loop
    std::vector<struct pollfd> poll_args;
    while (true) {
        // prepare the arguments of the poll()
        poll_args.clear();
        // put the listening sockets in the first position
        struct pollfd pfd = {fd, POLLIN, 0};
        poll_args.push_back(pfd);
        // the rest are connection sockets
        for (Conn *conn : fd2conn) {
            if (!conn) {
                continue;
            }
            struct pollfd pfd = {conn->fd, POLLERR, 0};
            // poll() flags from the application's intent
            if (conn->want_read) {
                pfd.events |= POLLIN;
            }
            if (conn->want_write) {
                pfd.events |= POLLOUT;
            }
            poll_args.push_back(pfd);
        }

        // more ...
    }
```
#### Step 2: Call poll()
```c
// the event loop
while (true) {
	// prepare the arguments of the poll()
	// ...

	// wait for readiness
	int rv = poll(poll_args.data(), (nfds_t)poll_args.size(), -1);
	if (rv < 0 && errno == EINTR) {
		continue;   // not an error
	}
	if (rv < 0) {
		die("poll");
	}

	// ...
}
```
- `poll()` is the only blocking *syscall* in the program.
- If a process receives a Unix signal during a blocking syscall, the syscall is immediately returned with `EINTR` to give the process a chance to handle the signal.
	- `EINTR` is not expected for non-blocking syscalls.
- `EINTR` should always be handled properly as you can get unexpected sources of signals and they're not necessarily an error.

#### Step 3: Accept new connections
```c
// the event loop
    while (true) {
        // prepare the arguments of the poll()
        poll_args.clear();
        // put the listening sockets in the first position
        struct pollfd pfd = {fd, POLLIN, 0};
        poll_args.push_back(pfd);
        // ...

        // wait for readiness
        int rv = poll(poll_args.data(), (nfds_t)poll_args.size(), -1);
        // ...

        // handle the listening socket
        if (poll_args[0].revents) {
            if (Conn *conn = handle_accept(fd)) {
                // put it into the map
                if (fd2conn.size() <= (size_t)conn->fd) {
                    fd2conn.resize(conn->fd + 1);
                }
                fd2conn[conn->fd] = conn;
            }
        }
        // ...
    }   // the event loop
```
- `accept()` is treated as `read()` in readiness notifications, so it uses `POLLIN`.
- After `poll()` returns, check the 1st fd to see if we can `accept()`.
- `handle_accept()` creates the `Conn` object for the new connection.

#### Step 4: Invoke application callbacks
The rest of the fd list is for connection sockets. Call the app code if they are ready for IO:
```c
    while (true) {
        // ...
        // wait for readiness
        int rv = poll(poll_args.data(), (nfds_t)poll_args.size(), -1);
        // ...

        // handle connection sockets
        for (size_t i = 1; i < poll_args.size(); ++i) { // note: skip the 1st
            uint32_t ready = poll_args[i].revents;
            Conn *conn = fd2conn[poll_args[i].fd];
            if (ready & POLLIN) {
                handle_read(conn);  // application logic
            }
            if (ready & POLLOUT) {
                handle_write(conn); // application logic
            }
        }
    }
```
#### Step 5: Terminate connections
- We always `poll()` for `POLLERR` on connection sockets.
- We can destroy the connection on error.
- App code can also set `Conn::want_close` to request the event loop to destroy the connection.
- You can add a callback `handle_err()` to let the app code handle the error, but there is nothing to do in our application, so we just close the socket here.
```c
        // handle connection sockets
        for (size_t i = 1; i < poll_args.size(); ++i) {
            uint32_t ready = poll_args[i].revents;
            Conn *conn = fd2conn[poll_args[i].fd];
            // read & write ...

            // close the socket from socket error or application logic
            if ((ready & POLLERR) || conn->want_close) {
                (void)close(conn->fd);
                fd2conn[conn->fd] = NULL;
                delete conn;
            }
        }
```

### Application code with non-blocking IO
#### Non-blocking accept()
Before entering the event loop, make the listening socket non-blocking with `fcntl`.
```c
static void fd_set_nb(int fd) {
    fcntl(fd, F_SETFL, fcntl(fd, F_GETFL, 0) | O_NONBLOCK);
}
```

Then the event loop calls back the application code to do `accept()`.
```c
static Conn *handle_accept(int fd) {
    // accept
    struct sockaddr_in client_addr = {};
    socklen_t addrlen = sizeof(client_addr);
    int connfd = accept(fd, (struct sockaddr *)&client_addr, &addrlen);
    if (connfd < 0) {
        return NULL;
    }
    // set the new connection fd to nonblocking mode
    fd_set_nb(connfd);
    // create a `struct Conn`
    Conn *conn = new Conn();
    conn->fd = connfd;
    conn->want_read = true; // read the 1st request
    return conn;
}
```

The connection socket is also made non-blocking, waiting for its 1st read.

#### Protocol parser with non-blocking read
```c
static void handle_read(Conn *conn) {
    // 1. Do a non-blocking read.
    uint8_t buf[64 * 1024];
    ssize_t rv = read(conn->fd, buf, sizeof(buf));
    if (rv <= 0) {  // handle IO error (rv < 0) or EOF (rv == 0)
        conn->want_close = true;
        return;
    }
    // 2. Add new data to the `Conn::incoming` buffer.
    buf_append(conn->incoming, buf, (size_t)rv);
    // 3. Try to parse the accumulated buffer.
    // 4. Process the parsed message.
    // 5. Remove the message from `Conn::incoming`.
    try_one_request(conn)
    // ...
}
```

```c
// process 1 request if there is enough data
static bool try_one_request(Conn *conn) {
    // 3. Try to parse the accumulated buffer.
    // Protocol: message header
    if (conn->incoming.size() < 4) {
        return false;   // want read
    }
    uint32_t len = 0;
    memcpy(&len, conn->incoming.data(), 4);
    if (len > k_max_msg) {  // protocol error
        conn->want_close = true;
        return false;   // want close
    }
    // Protocol: message body
    if (4 + len > conn->incoming.size()) {
        return false;   // want read
    }
    const uint8_t *request = &conn->incoming[4];
    // 4. Process the parsed message.
    // ...
    // generate the response (echo)
    buf_append(conn->outgoing, (const uint8_t *)&len, 4);
    buf_append(conn->outgoing, request, len);
    // 5. Remove the message from `Conn::incoming`.
    buf_consume(conn->incoming, 4 + len);
    return true;        // success
}
```

```c
// append to the back
// std::vector<uint8_t is just a dynamic array
static void buf_append(std::vector<uint8_t> &buf, const uint8_t *data, size_t len) {
    buf.insert(buf.end(), data, data + len);
}
// remove from the front
static void buf_consume(std::vector<uint8_t> &buf, size_t n) {
    buf.erase(buf.begin(), buf.begin() + n);
}
```

#### Non-blocking write
- No application logic, just write some data and remove it from the buffer.
- `write()` can return less bytes and that's OK because the event loop will call it again.
```c
static void handle_write(Conn *conn) {
    assert(conn->outgoing.size() > 0);
    ssize_t rv = write(conn->fd, conn->outgoing.data(), conn->outgoing.size());
    if (rv < 0) {
        conn->want_close = true;    // error handling
        return;
    }
    // remove written data from `outgoing`
    buf_consume(conn->outgoing, (size_t)rv);
    // ...
}
```

#### State transitions between request and response
- In a request-response protocol, the program is either reading a request or writing a response.
- At the end of `handle_read()` and `handle_write()`, we need to switch between the 2 states.
- This is not universally true.
	- For example, some proxies and messaging protocols are not request-response and can read and write simultaneously.
```c
static void handle_read(Conn *conn) {
    // ...
    // update the readiness intention
    if (conn->outgoing.size() > 0) {    // has a response
        conn->want_read = false;
        conn->want_write = true;
    }   // else: want read
}
```

```c
static void handle_write(Conn *conn) {
    // ...
    if (conn->outgoing.size() == 0) {   // all data written
        conn->want_read = true;
        conn->want_write = false;
    } // else: want write
}
```

### Pipelined requests
#### Batching requests without changing the protocol
- Batching multiple requests per read increases the amount of work each IO can perform.
- Normally a client sends a request then waits for that response. A pipelined client sends n requests, then waits for n responses (the server handles each request in order still).
	- Key point is that it can get multiple requests in 1 read, reducing the number of IOs.
- Requests pipelining reduces latency on client side because it can get multiple responses in 1 RTT (round trip time).
#### Problem: blocked pipeline from 1 request MAX assumption
- Assuming that there is max 1 request on each handle (read/write), causes issues as once it reads the 1 request and writes it, `handle_write` asks the event loop to wait for more data, even though there is still unhandled data in the input buffer... causing the pipeline to be stuck.
```c
// Example using this assumption
static void handle_read(Conn *conn) {
    // ...
    try_one_request(conn)               // ASSUMPTION: at most 1 request
    if (conn->outgoing.size() > 0) {    // 1. Processed 1 request.
        conn->want_read = false;
        conn->want_write = true;
    }
}

static void handle_write(Conn *conn) {
    // ...
    if (conn->outgoing.size() == 0) {   // 2. Written 1 response.
        conn->want_read = true;         // 3. Wait for more data.
        conn->want_write = false;
    }
}
```

- To fix this issue, you need to drop the extra assumption about the input buffer, which is that you need to keep consuming from it until there is nothing left to do.
```c
static void handle_read(Conn *conn) {
    // ...
    // try_one_request(conn);               // WRONG
    while (try_one_request(conn)) {}        // CORRECT
    // ...
}
```

- Then after a request is processed (within `try_one_request`), we can't just empty the input buffer because there may be more messages.
```c
static bool try_one_request(Conn *conn) {
    // ...
    // conn->incoming.clear()               // WRONG
    buf_consume(conn->incoming, 4 + len);   // CORRECT
    return true;
}
```

- KEY is when reading a byte stream, you can wait for n bytes to come, but do not assume that at most n bytes have come, because the byte stream is only about order, not time.

### Debug & test
- `strace` is a useful command that shows all syscalls.
- For example: `$ strace ./server >/dev/null` 

#### Optimistic non-blocking writes
- The server can assume that the socket is ready to write when it receives a request because the client has consumed the previous writes.
	- Meaning the server can blindly write without waiting for the next loop iterations to save 1 syscall.
```c
static void handle_read(Conn *conn) {
    // ...
    if (conn->outgoing.size() > 0) {    // has a response
        conn->want_read = false;
        conn->want_write = true;
        // The socket is likely ready to write in a request-response protocol,
        // try to write it without waiting for the next iteration.
        return handle_write(conn);      // optimization
    }
}
```

- This assumption is false with a pipelined client. The client may not have started reading while the server is writing. So the write buffer can be full on the server-side.
	- For this to work, `handle_write()` must check for `EAGAIN` in case the socket is not ready.
```c
static void handle_write(Conn *conn) {
    assert(conn->outgoing.size() > 0);
    ssize_t rv = write(conn->fd, &conn->outgoing[0], conn->outgoing.size());
    if (rv < 0 && errno == EAGAIN) {
        return; // actually not ready
    }
    if (rv < 0) {
        conn->want_close = true;
        return; // error
    }
    // ...
}
```

#### Better buffer handling
- We originally used `std::vector` as a FIFO approach (first-in-first-out), appending to the back and removing from the front.
- Appending tot he back is efficient for dynamic arrays because it doesn't reallocate each time, capacity just grows exponentially to amortise the reallocation cost
- Removing the front is not efficient because it has to move the rest of the data each time.
- If the buffer contains many pipelined requests, removing from the front is O(N^2).
- What we want is a buffer type that can operate at both ends!:
		|---- unused ----|---- data -----|----- unused ------|
	buffer begin        data begin         data end                  buffer end
```c
struct Buffer {
    uint8_t *buffer_begin;
    uint8_t *buffer_end;
    uint8_t *data_begin;
    uint8_t *data_end;
};

// removing from the front is just advancing a pointer, no need to move data
static void buf_consume(struct Buffer *buf, size_t n) {
    buf->data_begin += n;
}
```

- Appending to the back has 2 options: 
	- Reallocate like a dynamic array.
	- Move data to the front to make room.