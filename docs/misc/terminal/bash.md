# Bash

- Always start a bash script with `#!/bin/bash`
- To run your script, you need to give it the executable permission `chmod u+x <script file>`
- Bash is a lax interpreter, meaning it's not as strict and will allow ambiguous commands.
  - All this means is that, good practices, and quality of the script is up to us as the developer.
- The gross part of all bugs in bash shell scripts are the direct result of their authors not properly understanding command args.

## .bashrc

- Add stuff to this file that you want to run every time you start a new shell session.

## Accepting Parameters

- To accept CLI parameters to your script you just use `${1..}` meaning the first parameter refers to `$1` and so on for however many parameters you want.

```
# script.sh
#!/bin/bash

echo $1 $3 $2
```

`./script.sh "parameters" "cool" "are"` => `parameters are cool`

- `$*` will accept all parameters at that location.

## User Input

- Use the `read` command
- the `-n` flag to get rid of a new line, can be handy for clean interfaces in some cases.

```shell
read LINE
#use it with
echo $LINE

echo -n 'what is your name?'
read NAME
```

## Control Operators 

- `;` Controls sequence, essentially the same as starting a new line.
- `||` OR: Tells bash to run the command before it, but after finishing that command only run the next command if the one before _failed_.

## Compound Commands

- Are commands that contain multiple sub-commands.
- `rm hello.txt || { echo "Couldn't delete hello.txt." >&2; exit 1; }`: Is a good example, if the `rm` command fails the whole `{...}` will fail, if we emitted the braces, the echo wouldn't run but the rest would.

## Co-processes 

- Allows you to run a process in the background.
- Commonly used with the `tail` command to track a log file or something of that nature in the background while you work.
- They are not commonly used.

## Functions

- Essentially creating a command that runs other commands that you can call later on.
- Note that the parentheses should always be empty in bash, this is not a spot for parameters.

```bash 
functionName() {

}
```

## Loops

### While

```bash
# In a script you'd usually do

while [command]
do
    command1
    command2
done

# In the CLI you'd usually do

while [command]; do command1; command2; done

# e.g. Print the date every minute
while true; do date; sleep 60; done

# e.g. Have a server automatically restart if it crashes
while true; do node server.js; done
```

### For

```bash
for x in {0..10}; do echo $x; done
```

## Job Control

- `ctrl-z` can put a running program in the background, so that you can continue doing other stuff.
  - You can put the program back in the foreground with `fg`.
- You can do this with multiple programs and view all the programs (jobs) that are running in the background with the `jobs` command.
  - This will display a list of jobs, you can jump back into a specific one with `fg %[index of job]`.
  - Similarly you can kill jobs with `kill %[index of job]`.
- This all works in the background with signals that talk to the kernel. (SIGTERM, SIGCONT, SIGSTOP SIGKILL)
- You can find processes with `pgrep` and kill them with with `pkill`.

## File Descriptors

3 Default File Descriptors:  

- 0: Standard Input 
- 1: Standard Output
- 2: Standard Error

Connecting a files standard output to another files standard input, creates a **Stream**.  
File descriptors are process specific.

## Pipe 

- You can pipe with `|`.
- If you want to include **stderror** use `|&`.

## Lists 

- Is a sequence of other commands.
- A script is a command list.
- Commands in lists are separated with a control operator, indicating to bash what to do when executing the command before it.

## PATH 

- Essentially contains a set of directories that should be searched for programs.
- Can use `type` to see where bash found your program. 
  - Adding `-a` will show all possible locations for that program (if there are multiple).
- If you want to run a program that isn't in the PATH, just specify the full/relative path in order to run the file.
- PATH is an **environment var** meaning you can update it like: `PATH=~/bin:/usr/local/bin:/bin:/usr/bin`

## Making Characters Literal 

2 Ways:  
- Quoting; Wrapping your text in `''` or `""`.
  - Use double quotes for any argument that contains expansions (`variable or $(command)`).
  - Single quotes for any other argument.
  - Double quotes essentially still allow some bash syntax, whereas single quotes make everything literal.
- Escaping; Using `\` before the character you want to be treated literally (say whitespace for example).

## Redirection

- By default when bash runs a process it passes its file descriptors to that process so that they match.
  - eg. If you run `ls`, bash FD0 is the keyboard and its FD1 and FD2 are the display, by default, `ls` will inherit these and that's how we see the results of `ls` in our terminal screen.
- Redirection is changing that, for example bash still has FD0 and FD1 set to the display but we might want the results of `ls` to be written to a file.
  - `ls -l a > myfiles.ls`
- Another common use is emitting error, which can be done by specifying the file descriptor before the re-direct `>`.
  - `ls -l a b > myfiles.ls 2> /dev/null`
  - `/dev/null` is a special **device file** that disregards info and you can't read from it either. 
- You have to be CAREFUL if trying to direct FD1 and FD0 to the same location as naturally they run on separate streams and due to the nature of streams this can cause unreliable content in the destination (garbled junk).
- To solve, you need to **duplicate file descriptors**.
  - This is achieved `>&`, where you prefix it with the file descriptor we want to change and suffix it with the file descriptor whose stream we are copying to.
  - `ls -l a b >myfiles.ls 2>&1`
- A key point here is that `>&` connects to a stream! Not a destination.
  - We will refer to: `ls -l a b 2>&1 >myfiles.ls`
  - Here we connect FD2 to the stream FD1 is connected to which at the time of doing this is the terminal because FD1 hasn't been redirected to the file yet.
  - Think of it as setting your target, you need the FD you're copying to be pointing at the target you want before copying it.
- A complicated example using `exec`: `exec 3>&1 >mylog; echo moo; exec 1>&3 3>&-`
  - FD3 is created to duplicate FD1 (the terminal).
  - FD1 is then redirected to mylog, so "moo" is written to the file.
  - Afterward, FD1 is restored to the terminal using FD3.
  - Finally, FD3 is closed.
- For conciseness just use `{command}&>{file}` it essentially does the same as what we did before, writes FD1 and FD2 to the same spot.
- Close a file descriptor with `>&-`.

## Here

### Documents

- Feed large blocks of text into a command.

```bash 
cat <<.
Hello World.
****** *** 
.
```

The `.` here is delimiter, determines start and end.

### Strings 

- Generally preferred over Here Documents.

```bash
cat <<< "Hello world.
random text..."
```
```
```



