# Part II: Programming Paradigms

- [Part II: Programming Paradigms](#part-ii-programming-paradigms)
  - [Paradigm Overview](#paradigm-overview)
  - [Structured Programming](#structured-programming)
    - [Dijkstra's Problem](#dijkstras-problem)
    - [Functional Decomposition](#functional-decomposition)
    - [Science??](#science)
    - [Tests](#tests)
    - [Conclusion](#conclusion)
  - [Object Orientated Programming](#object-orientated-programming)
    - [Encapsulation](#encapsulation)
    - [Inheritance](#inheritance)
    - [Polymorphism](#polymorphism)
  - [Functional Programming](#functional-programming)
    - [Example](#example)
    - [Immutability and Architecture](#immutability-and-architecture)
      - [Segregation of Mutability](#segregation-of-mutability)
      - [Event Sourcing](#event-sourcing)
  - [Final Conclusion](#final-conclusion)

## Paradigm Overview

- **Structured Programming**: Replaced `goto` statements with `if/then/else` and `do/while/until` constructs as unrestrained jumps was deemed harmful to program structure.
  - _Structured programming imposes discipline on direct transfer of control._
- **Object-Orientated Programming**: Introduction of polymorphism through the disciplined use of function pointers (classes and instance variables).
  - _Object-orientated programming imposes discipline on indirect transfer of control._
- **Functional Programming**: Based around immutability and lambda calculus. Although you can alter variables, doing so must be done under very strict discipline.
  - _Functional programming imposes discipline upon assignment._

The above paradigms tell us more what not to do, rather than what we should do. It's a game of choosing which way is best for the current task at hand. A mixture of all 3 paradigms is ideal (when talking about the codebase as a whole).

A good sentence from the conclusion summarises what I'm trying to get across:  
 _We use polymorphism (object-orientated programming) as the mechanism to cross architectural boundaries; we use functional programming to impose discipline on the location of and access to data; and we use structured programming as the algorithmic foundation of our modules._

These 3 paradigms align with the 3 big concerns of architecture: function, separation of components, and data management.

## Structured Programming

### Dijkstra's Problem

- Programming was hard, and programmers don't do it well.
- Overlooking one small detail results in programs seeming to work but fail in unsuspecting ways.
- Dijkstra's solution to the complexity of a program was to apply the mathematical discipline of a proof.
- He envisioned the construction of a Euclidean hierarchy of postulates (a correct and proven statement), theorems, corollaries (statement that required little to no proof based off previously proven statement), and lemmas (a minor proven statement that is used as a stepping stone to a bigger one).
- In other words, programmers would use already proven structures, and tie them together with code that they would then prove correct themselves.
- The use of `goto` statements prevented some modules from being decomposed recursively, which made it difficult for Dijkstra to use the divide-and-conquer approach necessary for some proofs.
- Some uses `goto` didn't cause such issues, Dijkstra noticed that the good uses of `goto` corresponded to a simple selection and iteration of control structures.
- Modules that used `if/then/else` and `do/while` could be recursively subdivided into provable units.
- Dijkstra knew these were special due to their discovery by Bohm and Jacopini who proved that all programs can be constructed from 3 structures: sequence, selection,and iteration.
- He proved sequential statements through simple enumeration, the technique mathematically traced the inputs of the sequence to the outputs of the sequence.
- He proved selection through reapplication of enumeration. Each path was enumerated and if both paths produced appropriate mathematical results the proof was solid.
- He proved iteration with induction. Proved the case for 1, then if N was assumed correct, N + 1 was correct. He also proved the starting and ending criteria of the iteration by enumeration.

### Functional Decomposition

- Structured programming allows modules to be recursively decomposed into provable units, which means that modules can be decomposed, decomposition: breaking a large-scale problem statement up into smaller high-level and low-level pieces (abstraction).

### Science??

- Mathematics is the discipline of proving provable statements true.
- Science is the discipline of proving provable statements false.
- None of the scientific laws can ever be proven true in the mathematical sense, because there can always potentially be an experiment that will prove it false.

### Tests

- Show the presence of bugs.
- Program can be proven incorrect by a test, not correct.
- All testing can do it deem a program correct enough for our purposes.
- This shows that software development is not a mathematical endeavour but a scientific endeavour.
- Structured programming forces us to recursively decompose a program into a set of small provable functions, we then test these to try and prove them incorrect.
- If tests fail to prove incorrectness, we deem the functions to be correct enough for our purposes.

### Conclusion

- The ability to create falsifiable units of programming is what makes structured programming valuable.
- It is why functional decomposition is considered one of our best practices.
- At every level software is driven by falsifiability.
- Software architects strive to define modules, components, and services that are easily falsifiable (testable).

## Object Orientated Programming

The nature of OO falls back onto 3 key words: **encapsulation, inheritance, polymorphism**

### Encapsulation

- Containing everything in one single unit (entity).
- Often involves having public and private methods encapsulated within a class.
- Gives us a level of control on what can be accessed within the class.

### Inheritance

- Is the redeclaration of a group of variables and functions within an enclosing scope.
- Something inheriting something else, doesn't imply any form of mechanism binding them, it just means that something has the same properties or interface as what it is inheriting.
- The example in the book references `NamedPoint` inheriting `Point`, in fact it is a superset of it. `NamedPoint` has all the same properties (and more) as `Point`.

### Polymorphism

- The ability of different classes/objects to be treated as the same through an interface.
- It does this through dependency inversion.

## Functional Programming

### Example

- Variables in functional programming don't vary.

```Java
public class Squint {
  public static void main(String args[]) {
    for (int i=0; i<25; i++) {
      System.out.println(i*i)
    }
  }
}
```

- The `i` variable is being mutated on each iteration.

```Clojure
(println
  (take 25
    (map (fn [x] (* x x))
      (range))))
```

- range returns a never ending list.
- map over every number of the never ending list and square every number.
- take the first 25 numbers from the never ending list.
- print the results.
- Only elements that are accessed are evaluated.
- x is initialised but never modified.

No element of a never ending list is evaluated until it is accessed. `

### Immutability and Architecture

- Not having mutable variables solves lots of potential issues.
- Race conditions, deadlock conditions, and concurrent update problems are due to mutable variables.
- We want to make sure (as an architect) that our systems are robust in the presence of multiple threads and processors, hence the interest in concurrency and avoiding issues that come along with it.
- Immutability is practicable if certain compromises are made: Segregation of Mutability and Event Sourcing

#### Segregation of Mutability

- A common compromise is to segregate the mutable components from the immutable components.
- The mutable components perform their tasks in a purely functional way and then they interact with other components that are not purely functional and allow the state of variables to be mutated.
- It is common to use some sort of transactional memory to protect the mutable variables from the problems described above.
- **Transactional Memory** treats variables in memory the same way a database treats records on disk, it protects the variables with a transaction or retry-based scheme.

```Clojure
; Example of this in Clojure using its atom facility

(def counter (atom 0)) ; initialise counter to 0
(swap! counter inc)    ; safely increment counter
```

- `atom` is used to define `counter`'s value under strict conditions that are enforced by the `swap!` function.
- `swap!` takes 2 arguments: the atoms to be mutated and a function that computes the new value to be stored.

- The whole point of this is to segregate the mutable components from the immutable components.
- The separation is supported by the use of appropriate disciplines to protect those mutated variables.
- A good architect will push as much processing as possible into the immutable components and drive as much code as possible out of the mutable components.

#### Event Sourcing

- Is a strategy wherein we store the transactions, but not the state.
- Banking example:
  - Instead of mutating the balance in an account, add up all the transactions over the life span of that account.
  - This way we can create any part of state over a period of time, as we can re-create those actions.
- We use event sourcing in jibility!

- If we have enough storage and process power, we can make our applications entirely functional.

## Final Conclusion

- Structured programming is discipline imposed upon direct transfer of control.
- Object-orientated programming is discipline imposed upon indirect transfer of control.
- Functional programming is discipline imposed upon variable assignment.
- All this just tells us what not to do (restricts us).
- Software fundamentals haven't changed since Turing, only the tools and hardware have changed.
- Software is composed of **sequence, selection, iteration, and indirection (hardest)**. Nothing more, nothing less.

---

[Return](../)
