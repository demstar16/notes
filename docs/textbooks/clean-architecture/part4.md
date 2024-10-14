# Part IV: Component Principles

- [Part IV: Component Principles](#part-iv-component-principles)
  - [Components](#components)
    - [History of Components](#history-of-components)
      - [Relocatability](#relocatability)
      - [Linkers](#linkers)
    - [Conclusion](#conclusion)
  - [Component Cohesion](#component-cohesion)
    - [The Reuse/Release Equivalence Principle](#the-reuserelease-equivalence-principle)
    - [The Common Closure Principle](#the-common-closure-principle)
    - [The Common Reuse Principle](#the-common-reuse-principle)
    - [Tension Diagram for Component Cohesion](#tension-diagram-for-component-cohesion)
    - [Conclusion](#conclusion-1)
  - [Component Coupling](#component-coupling)

## Components

- The SOLID principles tell us how to arrange the bricks into walls and rooms, then the component principles tell us how to arrange rooms into buildings.
- Large software systems are built out of smaller components.
- Components can be thought of as units of deployment, they're the smaller entities that can be deployed as part of a system (the granule of deployment.)
- Components can be linked together into a single executable, or they can be aggregated together into a single archive (`.war` file), or they can independently deployed as separate dynamically loaded plugins (`.dll`, `.jar`, `.exe`).
- Regardless of how they're deployed, well-designed components always **retain the ability to be independently deployable and independently developable**.

### History of Components

- Lots of programs back in the day had to control memory location, one of the first lines of code in a program was often referred to as the `origin statement`. Which was essentially a line that declared which address the program would be loaded in at.
- Compiling large programs could take a long time, an approach taken to improve compile times was to separate the source code of the function library from the application and allocate an address for each.
- The problem with this was that if the space for say the function library out grew what we allocated, we need to pick a new spot which often isn't near where the rest of it is.
- This leads to having parts in memory all over the place and memory management can become a real nightmare.

#### Relocatability

- The solution for the above issue was relocatable binaries, which involved the compiler outputting binary code that could be relocated in memory by a smart loader.
- The loader would be told where to load the relocatable code.
- The relocatable code was instrumented with flags that told the loader which parts of the loaded data had to be altered to be loaded at the selected address.
- This now allowed the programmer to tell the loader where to load the function library, and where to load the application; which ultimately let the programmer to load only the functions they need.
- The compiler was also changed to emit the names of the functions as metadata in the relocatable binary.
- If a library **called** a library function, the compiler would emit that name as an **external reference**.
- If a library **defined** a library function, the compiler would emit that name as an **external definition**.
- Then the loader could link the external references to the external definitions once it had determined where it had loaded those definitions.
- This is how the **linking loader** was born.

#### Linkers

- The linking loader allowed programmers to divide their programs up onto separately compilable and loadable segments.
- When programs got bigger these linkers got too slow to tolerate.
- This lead to loading and linking being separating into 2 different phases.
  - The linker, which did the linking.
  - The output of the linker was a linked relocatable that a relocating loader could load very quickly.
- This allowed programmers to prepare an executable using the slow linker but they could load it quickly anytime.
- Eventually as time went on and computers and devices got more fast, we could do the linking at load time.
- This ultimately lead to the **plugin architecture** being born.

### Conclusion

- Dynamically linked files that can be plugged together at runtime are the software components of our architectures.
- Long ago, it wouldn't have seemed possible but now plugin architecture can be the casual default.

## Component Cohesion

- Principles of Component Cohesion:
  - **REP**: The Reuse/Release Equivalence Principle
  - **CCP**: The Common Closure Principle
  - **CRP**: The Common Reuse Principle

### The Reuse/Release Equivalence Principle

- **The granule of reuse is the granule of release**
- May seem obvious, however, people who want to reuse software components usually won't unless those components are tracked through a release process and are given release numbers.
  - This is more so because developers need to know when new releases are coming, and which changes those new releases will bring.
  - Developers need to make informed decisions as to whether they want to use the newer versions of software or if they are better off to stay with their current version.
- Software design and Architecture POV: This principle means that the classes and modules that are formed into a component must belong to a cohesive group. The component can't consist of a random hodgepodge of classes and modules, there should be some overarching theme or purpose that all the modules share.
- Classes and modules that are grouped together should be releasable together, being grouped together should make sense to both the author and user.
- The next 2 principles support this vague principle by highlighting the negative affects of breaking it.

### The Common Closure Principle

- _Gather into components those classes that change for the same reasons and at the same times. Separate into different components those classes that change at different times and for different reasons_
- This is essentially the Single Responsibility principle restated for components... a component should not have multiple reasons to change.
- If 2 components are so tightly bound (either physically or conceptually) that they always change together, then they belong in the same component.
- This minimizes the workload related to releasing, revalidating, and redeploying the software.

- This principle is tightly associated with the Open-Closed Principle in regards to closure.
- The OCP states that classes should be closed for modification but open for extension because 100% closure is not attainable, closure is strategic.
- The CCP amplifies this lesson by gathering together into the same component those classes that are closed to the same types of changes.

  - This means that when a change come along, there's a good change of it being restricted to a minimal number of components.

- SRP and CCP can be summarised with the following: _Gather together those things that change at the same times and for the same reasons. Separate those things that change at different times or for different reasons._

### The Common Reuse Principle

- _Don't force users of a component to depend on things they don't need._
- Classes and modules that tend to be reused together belong in the same component.
- In a component with such coupling, we'd expect the classes to have lots of dependencies between each other.
- The principle also tells us which classes not to keep together in a component.
- We want to make sure that the classes that we put into a component are inseparable, it is impossible to depend on some and not the others.
  - This is because we will be redeploying more components than is necessary, and wasting significant energy.
- In essence the CRP says that classes that are not tightly coupled should not be in the same component.
- The CRP is the generic version of the ISP, the ISP advises us not to depend on classes that have methods we don't use, whereas the CRP advises us not to depend on components that have classes we don't use.
- _Don't depend on things you don't need._

### Tension Diagram for Component Cohesion

The 3 cohesive principles fight each other. The REP and CCP are inclusive, making components larger. Whereas CRP is exclusive, making components smaller. Grouping components together can cause too many unneeded releases or too many components changing and splitting components to avoid unneeded releases can make components harder to reuse. An architect who just focuses on REP and CRP will find that too many components are impacted when simple changes are made. In contrast, those who focus too much CCP and REP will cause too many unneeded releases to be generated.

A good architect will strike a balance that best suits the current needs of the development team and is aware that this can change over time. Projects generally start out towards the right hand side of the triangle, where reuse is the only sacrifice aa the teams focus is developing. As the project matures and other projects begin to draw from it, we start to drift over to the left.]

### Conclusion

- In choosing the classes to group together into components, we must consider the opposing forces involved in reusability and develop-ability.
- This balance is always dynamic, what is appropriate now might not be appropriate next year.
- The composition of components will likely jitter and evolve with time as the focus of the project changes from develop-ability to reusability.

## Component Coupling
