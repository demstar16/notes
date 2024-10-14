# Bash

- Always start a bash script with `#!/bin/bash`
- To run your script, you need to give it the executable permission `chmod u+x <script file>`

## Accepting Parameters

- To accept CLI parameters to your script you just use `${1..}` meaning the first parameter refers to `$1` and so on for however many parameters you want.

```
# script.sh
#!/bin/bash

echo $1 $3 $2
```

`./script.sh "parameters" "cool" "are"` => `parameters are cool`

- `$*` will accept all parameters at that location.
