# Terminal

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
