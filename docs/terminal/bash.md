# Bash

- Always start a bash script with `#!/bin/bash`
- To run your script, you need to give it the executable permission `chmod u+x <script file>`

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
