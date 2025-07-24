# Part 1 - Welcome

- We are implementing a language by the name of **Lox**.
- Successful languages usually come about due to a combination of many small niche languages, **domain specific languages**.
- Some example of little languages include:
  - yarn 
  - Make
  - YAML 
  - SQL 
  - AWK 

## General Knowledge

- A compiler takes one language as input and outputs another language.
- Inputting and outputting the same language is called **self-hosting**.
- You can compile your compiler with another compiler and then used the compiled version of your compiler to compile future versions of your compiler, this is known as **bootstrapping**

## Book Structure

- Part II & Part III each walk you through building a Lox interpreter.
- Each chapter is structured the same: 
  - Takes a single language feature.
  - Teaches the concepts.
  - Walks you through an implementation.
- **NOTE: The challenges at the end of chapters are exploratory and there for enhanced understanding. If tackling these, make a copy of the project and explore there. The chapters that continue to build assume you have not done any of the challenges.**

## The Build

- The first interpreter will be built in **java** with a focus on concepts.
- The second interpreter will be built in C with a focus on speed.
 
## Challenges

1. The 6 domain-specific languages used in the book are make, css, scss, html, markdown, mustache, and yaml.
2. Java Implementation:

```java 
public class HelloWorld {
  public static void main (String[] args){
    System.out.println("Hello World!");
  }
}
```
  - Run the java with `javac filename`.
3. C Implementation:
```c 
#include <stdio.h>

int main() {
    printf("Hello World!\n");
    return 0;
}
```
  - Run the c with `gcc filename -o outputName`.
