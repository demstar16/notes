### Operators 
- `<<` will pass the contents on the right hand side to the left hand side, for example; `std::cout << "Text"` passes the string `Text` into the function `std::cout`.

### Debugging
- Sometimes the compiler will point you to the line after the line that is actually failing. Usually if the error is to do with a missing semi-colon.

### Values
- Literals: Can't be modified on their own.
	- Numbers `5` or `-6.7`
	- Characters, must use single quotes `'H'`
	- Text, must use double quotes `"Hello"`

### Memory
- Direct memory access is discouraged.
- Instead we want to access memory indirectly through an object.
#### Random Access Memory (RAM)
When we run a program, the OS loads it into RAM. Think of RAM as a series of numbered boxes that can be used to store data while the program is running.
### Comments
- `//` single line comment
- `/* ... */` multi-line comment (cannot be nested)
- 
### Quizzes
#### Section 1
##### 1.1
1. What is a Statement?
	A statement is an instruction in a program telling the computer to perform an action.
2. What is a function?
	A function is a collection of statements that execute sequentially, designed to complete a specific task.
3. What is the name of the function that all programs must have?
	`main()`
4. What happens when the program is run?
	The statements inside `main()` are executed sequentially.
5. What symbol are statements in C++ often ended with?
	`;`
6. What is a syntax error?
	An issue with your code not conforming to the grammar rules of C++.
7. What is the C++ Standard Library?
	A collection of precompiled code that has been packaged and ships with C++ for reuse in other programs.
##### 1.3
1. What is data?
	Data is information or values that can be stored, moved and processed by a computer.
2. What is a value?
	Is a literal or instance of some other useful concept that can be represented as data.
3. What is an object?
	An object is a region of storage that can store a value.
4. What is a variable?
	A variable is a named object that holds a value.
5. What is an identifier?
	Is the name that a variable is accessed by.
6. What is a data type used for?
	A data type determines what kind of value the object will store.
7. What is an integer?
	An integer is a whole number (no fractional component).
