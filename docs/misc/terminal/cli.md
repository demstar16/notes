# Command Line

## Tail

- `tail -f <file>`: will open the back end of the file and keep it open waiting for changes.
  - Useful for logging and/or actively waiting for changes.

## Quotes

- Using single quotes `'` won't resolve ENVIRONMENT VARIABLES inside them on the command line.
  - `echo 'hello $USER'` => hello $USER
- Using double quotes `"` will resolve ENVIRONMENT VARIABLES inside them on the command line.
  - `echo "hello $USER" ` => hello Dempsey (USER=Dempsey)
- Using back ticks will execute a sub-command in the current command (equivalent of using $()
  - echo \`whoami\` === echo $(whoami)

## $PATH

- This is your path variable where paths to executables live.
- If you have for example `/usr/local/bin` in your $PATH, then you can run executables that live in there from anywhere on your system.
- You can alternatively just run scripts via an alias, but if you have lots of scripts, this way would be better rather than unnecessarily bloating your alias file.

## Permissions

- There are user (u), groups (g) and everybody else (o).

```bash
# -rwxr--r--
# ---  is the user
#    ---  is the group
#       --- is everybody else
# it goes read, write, execute
```

- A few ways you can alter permissions with `chmod`
  - `chmod +w <file>` which will give write access to everyone for that file.
  - `chmod ug+x <file>` which will give execution access to the user and groups.
  - `chmod g-x <file>` will take away execution access to the group.
  - `chmod 721 <file>` which will give user read, write and execute. Groups read and everyone execution.
- **Octal permissions**, the 1 number is for the user, 2 for the group and 3 for everyone.
  - 4 for write.
  - 2 for read.
  - 1 for execute.

## Exit Codes

- Use `$?` to see the exit code of the previous command.
- Handy to use exit codes in loops or scripts to determine how we run things.
- 0 is successful, anything else is a failure.
- Exit codes are what is used with operators such as `&&` and `||`
  - `&&` is true if both commands either side of it return an exit code of 0.
  - `||` won't run the second command if the first command runs (**short-circuiting**).
  - `;` will run all the next command regardless. It essentially a full stop meaning the end of a command the start of a new one.

## Screen

- Create a screen with `screen -S name`.
- Handy for having things running in the background and you can login and out of it as you please.
