# Git

**A distributed version control system**

## Key Facts

- Git is an **acyclic graph**
- Each commit is a node in the graph, each pointer is a child-parent relationship.
- Deleting _untracked files_ are lost forever.
- `man git-<op>` for a friendly manual.

## git config

- You have a `globalConfig` and a `localConfig`.
- `<section>.<key>` is the shape for a git config key.
- `--global` flag ensures you set this key value for all future uses of git and repos.
- `user.name` and `user.email` are the key's used in creating a commit tied to you.
- Add a key value: `git config --add --global <key> "<value>"`.
- Get any value of git config: `git config --get <key>`.

## Basics

- `git init`: Initialise a repo with git (creates the `.git` directory).
- `git add <file-path | pattern>` will add zero or more files to the index (staging area).
- `git commit -m '<message>'` commits changes present in the index.
- `git status` describes the state of your git repo which will include tracked, staged, and untracked changes.
- `git log` shows the repo history, if creating a log file or something `--graph` and `--decorate` are handy. `--oneline` is also handy for a condensed one line version.
- `git cat-file -p <SHA>` will display the commit at that SHA, you can trace the produced SHA's down to see the contents of committed files.
  - A long way of seeing what's in a commit. Combined with grep, can be very useful to see contents of a file at a specific commit.
