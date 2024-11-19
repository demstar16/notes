# Regular Expressions

- Pattern matching language... very powerful.
- A common use is piping the results of a command into `sed`.
  - An example is a command that prints some output and wanting to replace all occurrences of tangerine with lemon.
  - `command | sed 's/tangerine/mango/g'`
- If you don't want to escape stuff in the regex with `grep` or `sed` you need to use `-r` and `-E` respectively (doesn't work with \*, you still need to escape that.)
- Symbol meanings:
  - `\s` whitespace
  - `$` means go to the end

## Quantifiers

- `?` zero or one
  - `echo 'echo 'dog and doge' | sed 's/doge\?/DOGE/g'` -> DOGE and DOGE. It matches with dog or doge since the `e` can occur zero or one time.
- `*` zero or more
  - `echo 'beep bp beeeeeeep' | sed 's/be*p/BEEP/g'` -> BEEP BEEP BEEP
- `+` one or more
  - `echo 'beep bp beeeeeeeep' | sed 's/be\+p/BEEP/g'` -> BEEP bp BEEP
- `{}` specifies your own quantifier, you need the `-r` flag with sed so that its in enhanced mode.
  - `{2,4}` between 2 and 4
  - `{2,}` greater than 2

## Flags

- `i` case insensitive
- `g` match all occurrences (global)
- `m` treat string as multiple lines
- `s` treat string as a single line

## Character Classes

- `[...]` Any characters inside the square brackets will match, example is matching with a vowel char `[aeiou]`.
  - `echo beep and boop' | sed 's/b[aeiou]\+p/BXXP/g` -> BXXP and BXXP
- We can negate what's in a class with `^`.
  - An example could be matching for anything except `abc`: `s/[^abc]+//g` will remove everything except abc.
  - It's most useful for matching what's in a set of brackets: `''cool <beans>'.replace(/<[^>]+>/, 'BOSH')` -> cool BOSH
- Another example is removing numbers in a string.
  - `echo 'hello1234 what9999 50953' | sed -E 's/[0-9]+//g'` -> hello what
- **Sequences**
  - `\w`: word char `[A-Za-z0-9_]`
  - `\W`: non-word char `[^A-Za-z0-9_]`
  - `\s`: whitespace `[ \t\r\n\f]`
  - `\S`: non-whitespace `[^ \t\r\n\f]`
  - `\d`: digit `[0-9]`
  - `\D`: non-digit `[^0-9]`

## Anchors

- `^` anchor at the beginning. DIFFERENT TO CHARACTER CLASS NEGATION.
  - `'cool beans'.replace(/^beans/, Beans)` -> cool beans, doesn't match because the string doesn't begin with beans
  - `'beans cool'.replace(/^beans/, Beans)` -> Beans cool
- `$` anchor at the end.
  - `'cool beans'.replace(/beans$/, Beans)` -> cool Beans
  - `'beans cool'.replace(/beans$/, Beans)` -> beans cool

## Groups

- `()` capture group
  - Everything that is captured is given an index.
- `(?:)` non capture group
- `(a|b)` match a or b

  - `'beep boop'.replace(/b(ee|oo)p/, XXXX)` -> XXXX XXXX

- Altering multiple groups can be useful by referencing them in the replace with a `$`:
  `'cool <beans> zzz'.replace(/<([^>]+)> (\w+)/g, '"$1":$2')` -> cool "beans":zzz

## Password Example

- `\w` represents a word character: [A-Za-z0-9]
- `\d` represents a digit character: [0-9]
- Our policy is that we need at least 1 lowercase, at least 1 uppercase, at least 1 number, and at least 1 symbol from [!@$%^&*-+]

```js
const pw = "Abc1234!";
let regex = "/^w{8,}$/";

regex.test(pw); // false - doesn't account for symbols

regex = "/^[w!@$%^&*-+]{8,}$/";
regex.test(pw); // true

// Now this passes but doesn't meet our policy we need to check if it has at least one of each thing. We can string together multiple regex tests into one big AND boolean check.

/^[w!@$%^&*-+]{8,}$/.test(pw) &&
  /[a-z]/.test(pw) &&
  /[A-Z]/.test(pw) &&
  /\d/.test(pw) &&
  /[w!@$%^&*-+]/.test(pw);
```
