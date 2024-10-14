# Part III: Design Principles

## Introduction

- The SOLID Design Principles: SRP, OCP, LSP, ISP, DIP
- The goals the SOLID principles is to create mid-level (module level) software structures that tolerate change, are easy to understand, and are the basis of components that can be used in many software systems.

## The Single Responsibility Principle

- A module should have one, and only one reason to change.
- This isn't quite sufficient, what we mean here is that the "reason to change", refers to stakeholders and users. Multiple stakeholders and users may want the same change, so we will refer to the group that wants this change as an actor.
  - A module should be responsible to one, and only one, actor.

### Symptoms that Violate the SRP

#### Accidental Deletion

- An example is having an Employee class with 3 methods on it, and having 3 different actors on that class that are responsible for one of the methods.
  - Say CFO needs `calculatePay()`, COO needs `reportHours()`, and the CFO needs `save()`.
  - Now the employee class has 3 reasons to change: The CFO, COO, and CTO.
  - This coupling can cause the actions of the CFO's team to affect something that the COO's team depends on.
- We must separate the code that different actors depend on.

#### Merges

- This essentially means that violating the SRP can lead to 2 actors working on the same module at once, leading to a merge conflict.
- Merge conflicts can be risky and should be avoided where possible.
- Separate code that supports different actors.

### Solutions

- A potential solution is to separate the data from the functions and then have 3 separate classes that don't know about each other looking at the data.
- The downside of this is that you now have 3 separate classes you have to instantiate and track, to counter this we can use the **Facade pattern**, which involves having another class which uses these 3 classes.
  - The Facade class is responsible for instantiating and delegating to the classes with the functions.
- Sometimes its preferable to keep the important business rules closer to the data, in that case, the methods that rely on business logic would stay in the Facade class whilst the lesser functions would be extracted out.

**In summary the SRP is about functions and classes, but it reappears at the level of components where it becomes the Common Closure Principle, and at the architectural level where it becomes the Axis of Change responsible for the creation of Architectural Boundaries.**

## The Open-Closed Principle

- _A software artifact should be open for extension but closed for modification._
- The entire point of this chapter is to emphasize that a well designed system should not have to be modified in order to extend it.
- If the SRP and DIP principles are used diligently, it allows for the OCP principle to also be applied.

### Example

- The example in the book talks about `the Interactor` being the safest from change, so that any changes in the database or the views won't have an affect on the `the Interactor`.
- The reason `the Interactor` holds this position is due to it containing the business rules and high-level policies.
- This in turn creates a hierarchy of protection based on the notion of "level", low-level concepts, like a view, are the last protected whilst levels containing business rules and high-level policies will be the most protected.
- Functionality is separated based on how, why, and when it changes. (it being the functionality.)
- Directional control is shown Figure 8.2 of the book by the use of the interfaces in the controller and interactor, without these interfaces our `Interactor` wouldn't be safe from change.
- The purpose of the `Financial Report Requester` interface is to hide information so that the controller doesn't know too much.

### Conclusion

- The OCP is one of the driving factors behind the architecture of systems.
- The goal is to make the system easily extendible.
- We also want the components within the system to be in a dependency hierarchy that protects higher-level components from changes in lower-level components.

## The Liskov Substitution Principle

_If for each object o1 of type S there is an object o2 of type T such that for all programs P defined in terms of T, the behaviour of P is unchanged when o1 is substituted for o2 then S is a subtype of T._

- An example is having a Billing application that uses a License interface to calculate a fee. The subtypes of license conform to the License interface, making them subtypes of the License type, conforming to LSP.
- In terms of Software, LSP can easily be seen and applied through the use of interfaces and implementations.
- In terms of Architecture, it is more easy to see when it is violated and how the violation affects the system.

  - Assume we are building an aggregator for many taxi dispatch services. Customers use our website to find the most appropriate taxi to use, regardless of taxi company. Once the customer makes a decision, our system dispatches the chosen taxi by using a restful service.
  - Now assume the URI for the restful dispatch service is part of the information contained in the driver database. Once our system has chosen a driver appropriate for the customer, it gets a URI from the driver record and then uses it to dispatch to the driver.
  - Suppose Driver Bob has a dispatch URi that looks something like: `purblecab.com/driver/Bob`, our system will append the dispatch information onto this URi and send it with a PUT, as follows: `purplecab.com/driver/Bob/pickupAddress/24 Maple St./pickupTime/153/destination/ORD`. Here we can see that all Taxi companies must conform to the same REST interface, they must treat the pickupAddress, pickupTime, and destination fields identically.
  - Now suppose that the Acme Taxi Company hired some programmers who didn't read the spec carefully. They abbreviated the destination field to just dest.
  - This would lead to use needing a special case to be accounted for, the dispatch for any Acme driver would have to be constructed using a different set of rules from all other drivers.
  - This can lead to all sorts of bugs, errors and security breaches.

- In conclusion the LSP should be extended to the level of architecture. A simple violation of substitutability, can cause a system's architecture to be polluted with a significant amount of extra mechanisms.

## The Interface Segregation Principle

- This principle is easy to show how it can be violated, the book starts with a diagram of 3 users conforming to a single `OPS` class with 3 methods on it.
  - Say User1 only uses op1, User2 uses op2, User3 uses op3.
  - Say we implement this in something like Java, if op2 changes, even though User1 and User3 don't care about it, they'll have to get recompiled since the class they depend on has changed even though nothing they care about has changed.
  - We solve this problem be having each user conform to an interface for each method they actually use. Essentially how it works is, lets just look at User1. User1 depends on U1Ops and ops1 (ops1 implements U1Ops). Meaning that a change in ops1 only affects User1.
  - What essentially is happening is that the Users don't depend on the entire OPS class any more.
- The example we just went through was for statically typed languages.
- **Statically typed languages** force programmers to create declarations that users must import, use, or include. These create source code dependencies that force recompilation and redeployment.
- **Dynamically typed languages** don't have these declarations in source code. Instead they are inferred at runtime.
  - This leads to no source code dependencies to force recompilation and deployment, this allows for dynamically typed languages to create systems that are more flexible and less tightly coupled than statically typed languages.

### ISP and Architecture

- It is harmful to depend on modules that contain more than you need.
- As earlier discussed this is true for source code dependencies that force unnecessary recompilation and redeployment, it is also true at a higher architectural level.
- An example of this is say we want to add F to our system S, F depends on D.
  - Say that D has more than F needs, meaning stuff that S doesn't care about.
  - Changes to those features within D may force the redeployment of F and, therefore the redeployment of S.
  - Worst case a failure in one of the features in D may cause failures in F and S.

### Conclusion

- Depending on something that carries baggage that you don't need can cause you troubles that you didn't expect.
- This idea is discussed more in Chapter 13: Component Cohesion.

## The Dependency Inversion Principle

- The most flexible systems are those in which source code dependencies refer only to abstractions, not to concretions.
- In statically typed languages, say Java for example, `use`, `import`, and `include` statements should only refer to source modules containing interfaces, abstract classes or some other kind of abstract declaration.
- In dynamically typed languages it's the same thing, however it is harder to define what a concrete module is. In particular, it is any module in which the functions being called are implemented.
- Treating this as a rule is unrealistic as a general rule if the module isn't changed often and is very stable, usually there isn't much need to worry. The example they use is the `String` class in Java, it is a class in the `java.lang.string` module and is not subject to much change, so we don't mind depending on it.
- We tend to ignore the stable background of operating systems and platform facilities when it comes to DIP, we tolerate them because we know we can rely on them.
- It is the **volatile** concrete elements of our system that we want to avoid depending on, as they are frequently undergoing change.

### Stable Abstractions

- Every change to an abstract interface corresponds to a change to its concrete implementations.
- Not every change to concrete implementations require changes in the interface.
- Interfaces are less volatile than implementations.
- It is **Software Design 101** to design non-volatile interfaces or work hard to decrease volatility.
- Stable software architectures are those that avoid depending on volatile concretions, and that favour the use of stable abstract interfaces.
- The above implication boils down to a set of very specific coding practices:
  - Don't refer to volatile concrete classes, refer to abstract interfaces instead. This applies in all languages (static or dynamically typed). Enforces the use of abstract factories.
  - Don't derive from volatile concrete classes, this is a corollary to the previous rule. Inheritance should be treated with care.
  - Don't override concrete functions. Concrete functions often require source code dependencies, if you override these functions you don't eliminate those functions, you don't eliminate the dependencies, you inherit them. To manage those dependencies you should make the function abstract and create multiple implementations.
  - Never mention the name of anything concrete and volatile: restatement of the principle itself.

### Factories

- The creation of volatile concrete objects requires special handling, which is usually handled via an **Abstract Factory** to manage undesirable dependencies.
- Key Points from Figure 11.1 on page 90 of the book:
  - There is an architectural boundary between the implementations of the concrete code and the application and interfaces. Notice that all arrows crossing the boundary are pointed the same way, in the opposite direction of the source code dependencies, they're inverted hence the name of the principle.
  - The boundary divides the system into 2 parts: abstract and concrete. The abstract part contains all the high-level business rules of the application and the concrete part has all the implementation details.
  - The application calls the `makeSvc` method on the Service Factory interface which is implemented by the Service Factory Implementation Class. That implementation instantiates the Concrete Implementation and returns it as a Service.
  - The Service Factory interface is a often missed key here, if that service factory interface was not there the app would depend on the factory and not the concrete implementation, hooray! But the application is now transitively dependent on the concrete implementation because the factory is dependant on it. The interface inverts the dependency so now the app is not dependent at all on any concrete implementation.
  - The factory depends on the concrete implementation and this is okay, at some point you have to depend on something real. You can't depend on abstractions for ever. The goal here is to keep the concrete implementations close and on the same side of the architectural boundary.

### Concrete Components

- DIP violations cannot always be entirely removed, but they can be gathered into a small number of concrete components and kept separate from the rest of the system.
- Most systems contain at least one concrete component that has a dependency, in lots of cases this is the `main` function.

### Conclusion

- DIP shows up again and again and is one of the most viable organising principles in the books architecture diagrams.
- Architectural boundaries are covered deeper in later chapters.
- The direction of flow over this boundary is covered later in a chapter called "Dependency Rule".
