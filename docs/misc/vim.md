# Vim

[Cheatsheet](https://www.fprintf.net/vimCheatSheet.html)

## Modes

- Default mode is command mode or NORMAL. This is where you can run all your vim commands.
- **Insert** mode is accessed by pressing `i`, this lets you edit the file. You can get out of insert mode with either `ESC` or `CTRL + C`.
- `o` puts you on a new line below and in insert mode.
- `O` put you on a new line above and in insert mode.
- `a` puts you in insert mode in front of the selected char.

## Exiting

- `:q` quits the program (won't let you if you haven't saved).
- `:w` writes to the file (saves).
- `:wq` writes and quits.
- `q!` quits without saving unsaved changes.

## Movement

- Either use the arrow keys (self explanatory).
- Or `HJKL`.

  - `H` left
  - `J` down
  - `K` up
  - `L` right

- `0` Jump to start of the line.
- `^` Jump to start of the line (not whitespace).
- `$` Jump to the end of the line.
  - If you press this and then move up and down, the cursor will stay at the end of each line.
- `gg` Jump to top of the file.
- `G` Jump to end of the file.

## Deleting

- `x` deletes a character
- `d` delete from:
  - `dd` current line
  - `d$` the cursor to the end of the line.
  - `d0` or `d^` the cursor to the start of the line.
  - `dG` the current position to the end of the file.
  - `dgg` the current position to the start of the file.
  - `dj` the current line and the line below.
  - `dk` the current line and the line above.
- `2dd`, `3dd` deletes the next N lines.
- `d/PATTERN` deletes everything from the current position to the first match (not including the match).
- `dn` deletes everything until the next occurrence of the pattern used in previous command.

## Searching

- `/PATTERN` search forward for PATTERN
- `?PATTERN` search backward for PATTERN
- `n` jump to the next match
- `N` jump to previous match

## Jumping

- `f + CHAR` search forward on the current line to CHAR.
- `t + CHAR` search forward on the current line to the character before CHAR.
- `F + CHAR` search backward on the current line to CHAR.
- `T + CHAR` search backward on the current line to the character after CHAR.

## Search & Replace

- `:s/PATTERN/REPLACEMENT/FLAGS` for a line (just a [regex](./regex.md))
- `:%s/PATTERN/REPLACEMENT/FLAGS` for a file
- Will only do the replacement for the first match unless you supply the `g` flag.

## Visual Select

- `y` yanks the selected text into the paste buffer.
- `p` pastes what is in the paste buffer.
- `x` or `d` deletes selected text and puts it in the paste buffer.
- `>>` indent the text right by shift width.
- `<<` indent the text left by shift width.
- `V` puts you in visual line mode, great for selecting lines.
- `J` move the next line to the end of the current line.
- `(backtick) + .` go to the last edit.

## Inserting

- `:r FILEPATH` inserts the file into the current file.
- `:r! COMMAND` inserts the output of the command into the current file.

## Terminal

- Run `set -o vi`.
- You can put your command line into vim mode by hitting `ESC`.

## Recording

- `q` + `THE KEY YOU WANT TO MAP TO`, then type your stuff in, when done hit `q` to stop recording.
- Press `@` + `THE KEY YOU MAPPED TO`, to use the recording.
- Eg. Converting string to template string:

```JavaScript
const = 'text'

// press q + t (for example)
// recording has started

const = `text` // manually change it now using f in vim

// press q to stop recording
// now you can use @ + t to redo this wherever else you want.

```
