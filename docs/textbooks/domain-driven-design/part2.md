# Part II: The Building Blocks of Model-Driven Design

## Isolating the Domain

### Layered Architecture

- Layered Architecture consists of 4 conventional parts: User Interface, Application, Domain, and Infrastructure.
  - Our model lives in the domain layer.
- **UI Layer**: Responsible for showing information to the user and interpreting the user's commands.
- **Application Layer**: Defines the jobs the software is supposed to do and directs the expressive domain objects to work out problems. It doesn't contain business rules, it only coordinates tasks and delegates work to collaborations of domain objects in the next level down.
- **Domain Layer**: Responsible for representing concepts of the business, information about the business situation, and business rules. This layer is the heart of business software.
- **Infrastructure Layer**: Provides generic technical capabilities that support the higher layers, this layer may also support the pattern of interactions between the four layers through an architectural framework.

#### Relating the Layers

- _How do we connect the layers without losing the benefit of separating concerns?_ Is the driving motivation behind many design patterns.
- Architectural patterns for lower layers to connect to higher levels:
  - Callbacks
  - Observers
  - Model-View Controller (MVC) (connecting the UI to the application and domain layers)
  - Model-View Separation Pattern
  - Application Coordinator
- Any approach is fine, as long as we maintain the isolation of the domain layer.
- Infrastructure layer usually offers its capabilities through `services`.

#### Architectural Frameworks

- The best architectural frameworks solve a complex technical problem while allowing the domain dev to focus on expressing the model.
- When a applying on a framework, focus on your goal: building an implementation of a domain model and using it to solve important problems.
- Given how complicated many frameworks are to use, minimalist in framework feature application can help keep business objects/login readable and expressive.

#### Domain Layer is where the Model lives

- It is not practical to achieve that correspondence when the domain logic is mixed with other concerns of the program.

### The Smart UI Anti-Pattern

- This approach is not compatible with DDD, it involves putting all the business logic into the UI (essentially having everything in one place.)
- Advantages:
  - Productivity is high.
  - Less capable devs can work this way with little training.
  - Deficiencies in requirements analysis can be overcome by releasing a prototype to users and then quickly changing the product to fit their requests.
  - Applications are decoupled from each other, so that delivery schedules of small modules can be planned relatively accurately.
  - Relational databases work well and provide integration at the data level.
  - 4GL tools work well (MATLAB).
  - When apps are handed off, maintenance programmers will be able to quickly redo portions they can't figure out, because the effects of the changes should be localised to each particular UI.
- Disadvantages:
  - Integration of applications is difficult except through the database.
  - There is no reuse of behaviour and no abstraction of the business problem. Business rules have to be duplicated in each operation to which they apply.
  - Rapid prototyping and iteration reach a natural limit because the lack of abstraction limits refactoring options.
  - Complexity buries you quickly, so the growth path is strictly toward additional simple apps. There is no graceful path to richer behaviour.
- Only use this sort of design approach if it fits your use case perfectly, otherwise it becomes a mess.

## A Model Expressed in Software

- This chapter is all about the "how" in terms of creating the model in the code.
- The three entities that will be focused on making distinctions between are: **entities**, **value objects**, and **services**.

### Associations

- Reflecting models in code in comparison to drawing a diagram can be quite difficult.
- _For every traversable association in the model, there is a mechanism in the software with the same properties._`
- There are 3 ways of making associations more tractable:
  - Imposing a traversal direction.
  - Adding a qualifier.
  - Eliminating non-essential associations.
- It's important to create models that are specific and lack unnecessary detail, the example they use is that something can be presented as bi-directional but it makes more sense to be represented as uni-directional. This makes it more obvious for when you do see a relationship that has more meaning in terms of a bi-directional relationship. Essentially take care when showing your representations so that you can understand how the software should work on a better level.
- If a model is made well and it's relationships are accurate, the software implementation is irrelevant in the sense that if it meets the requirements of the spec, it doesn't really matter how it happens.

### Entities

- Some objects are not defined primarily by their attributes, they represent a thread of identity that runs through time and often across distinct representations.
- Sometimes such an object must be matched with another object even though attributes differ.
- An object must be distinguished from other objects even though they might have the same attributes, mistaken identity can ultimately lead to data corruption.
- An object defined primarily by its identity is an Entity.
- An Entity is anything that has continuity through a life cycle and distinctions independent of attributes that are important to the application's use.
- Not all objects in the model are entities, with meaningful identities.
- The most basic responsibility of entities is to establish continuity so that behaviour can be clear and predictable.
- Entities tend to fulfil their responsibilities by coordinating the operations of objects they own.
- An identifying attribute must be guaranteed to be unique within the system.
- It is important to have a unique identifier (usually a combination of attributes) that is relevant to the domain and guaranteed to be unique across systems.

### Value Objects

- Objects that don't have a conceptual identity but describe characteristics of something, they are instantiated to represent elements of the design that we care about only for what they are, not who or which they are.
- Tracking identity of Entities is essential, but attaching identity to other, unnecessary objects can potentially be harmful.
- An example they use in the book is children drawing, the kid doesn't care which marker he is using (ie. 2 red markers are interchangeable, kid just wants red) but a child can distinguish their own drawing from others. That is because the child along with their drawing are uniquely identifiable. If you were to ask the child for every line in the drawing, what marker he used it would be quite difficult.
- Value objects can reference entities, an example is a routing program. The route object may be a value object, but the start and destination are both entities.
- They are frequently passed in as parameters in messages between objects, usually being transient, created for an operation and then discarded.
- Value objects can give information about an entity, it should be conceptually whole.
- Defining value objects and designing them as immutable is a case of following a general rule: Avoiding unnecessary constraints in a model leaves developers free to do purely technical performance tuning.

#### Designing Associations That Involve Value Objects

- The fewer and simpler the associations in the model the better.
- Bidirectional associations between value objects doesn't make any sense, without identity it's meaningless to say that an object points back to the same value object that points to it.
- Try to completely eliminate bidirectional associations between value objects.
- If in the end such an association seems necessary rethink the decision to declare said object as a value object.

### Services

- Sometimes concepts from the domain don't make sense to be in an object, like a activity or an action, this is where services come in.
- A service is an operation offered as an interface that stands alone in the model, without encapsulating state, as entities and value objects do.
- Services are a common pattern in technical frameworks and also apply in the domain layer.
- Named as a verb rather than a noun.
- A service should have a defined responsibility, and that responsibility and the interface fulfilling it should be defined as part of the domain model.
- Operation names within the service should come from the **ubiquitous language**.
- A good service has 3 characteristics:
  - The operation relates to a domain concept that is not a natural part of an entity or value object.
  - The interface is defined in terms of other elements of the domain model.
  - The operation is stateless (meaning that a user can use any instance of a service without regard to the instance's individual history).
- When a significant process or transformation in the domain is not a natural responsibility of entity or value object, add an operation to the model as a standalone interface declared as a service.

#### Services and the Isolated Domain Layer

- This is a pattern focused on services that have an important meaning in the domain in their own right.
- Most services generally belong in the infrastructure layer, Domain and application services collaborate with these infrastructure services.
- An example of distinguishing these services is used; Take a bank that sends a notification to a user when the balance goes below a threshold.
  - The infrastructure layer service encapsulates the email system and perhaps an alternate means of notification.
  - The application layer service is responsible for ordering the notification.
  - The domain layer service is responsible for determining if a threshold was met.
- A good way to think of it is that the domain layer should contain terms that are used in the domain (ubiquitous language) and should not show up in the infrastructure layers. Technical services should lack business meaning.

#### Granularity

- This pattern is also valuable as a means of controlling granularity in the interfaces of the domain layer, as well as decoupling clients from the entities and value objects.
- Granularity refers to the breaking down of larger tasks into smaller ones.
- Fine-grained domain objects can contribute to knowledge leaks from the domain into the application layer, where the domain object's behaviour is coordinated.
- Judicious use of domain services can help maintain the bright line between layers, helping us stop different layered concerns creeping across layers.
- This pattern favours interface simplicity over client control and versatility.

#### Access to Services

- The means of providing access to a service is not as important as the design decision to carve off specific responsibilities.
- A simple **singleton** can be written easily to provide access.
  - A singleton is a design pattern which ensures that only one object of its kind exists and provides a single point of access to it for any other code.
- Coding conventions can make it clear that these objects are just delivery mechanisms for service interfaces, and not meaningful domain objects.

### Modules (Packages)

- There should be a low coupling between modules and high cohesion within them.
  - There is a limit to how many things a person can think about at once (low coupling.)
  - Incoherent fragments of ideas are as hard to understand as an undifferentiated soup of ideas (high cohesion.)
- Modules and the smaller elements should co-evolve, typically they don't though.
- Modules are chosen to organise an early form of the objects, then after that the objects tend to change in ways that keep them within the bounds of the module definition.
- Refactoring modules can be dangerous and is more difficult than refactoring classes.
- Modules are a communication mechanism, the meaning of the objects being partitioned needs to drive the choice of modules.
- If your model is telling a story, think of modules as the chapters.
- Modules and their names should reflect insight into the domain.

#### Agile Modules

- Modules should co-evolve with the code, however this often doesn't happen.
- This results in module structures and names reflecting much earlier forms of the model.
- Early mistakes in module choices lead to high coupling which make it harder to refactor.

#### Pitfalls of Infrastructure-Driven Packaging

- A useful framework standard is the enforcement of layered architecture by placing infrastructure and user interface code into separate groups of packages, leaving the domain physically separate.
- Some frameworks create tiers by spreading the responsibilities of a single domain object across multiple objects and then placing those objects in separate packages.
- An example of a fine-grained object split up into 4 tiers could looks something like this:
  - First tier: data persistence layer, handling mapping and access to a database.
  - Second tier: handles behaviour intrinsic to the objects in all situations.
  - Third tier: superimposes application-specific functionality.
  - Fourth tier: a public interface, decoupled from all the implementation below.
- Elaborate technically driven packaging schemes impose 2 costs:
  - If the framework's partitioning conventions pull apart the elements implementing the conceptual objects, the code no longer reveals the model.
  - There is only so much partitioning a mind can stitch back together, and if the framework uses it all up, the domain developers lose their ability to chunk the model into meaningful pieces.
- Keep things simple! Choose a minimum of technical partitioning rules that re essentials to the technical environment or that actually aid development.
- Keep all code that implements a single conceptual object in the same module, if not the same object.

### Modelling Paradigms

- Model-Driven Design calls for an implementation technology in tune with the particular modelling paradigm being applied.
- The dominant paradigm is **object-oriented design**.

#### Why the Object Paradigm Predominates

- Object modelling strikes a nice balance of simplicity and sophistication.
- Fundamentals of OO seem to come naturally to most people.
- It is rich enough to capture the essence of the domain model.
- Many common problems have been solved for objects.
- The developer community and design culture is also important for a modelling paradigm.

#### Non-objects in an Object World

- A domain model doesn't have to be an object model (although its the most popular and "safest").
- Model paradigms have been conceived to address certain ways people like to think about domains.
- Then the models for those domains are shaped by the paradigm.
- The result is a model that conforms to the paradigm so that it can be effectively implemented in the tools that support that modelling style.
- It is okay to have an ugly object if there is only a small case where one thing would suit a different paradigm.
- Alternatively if there are lots of things that suit another paradigm, it may be worth swapping.
- If there are major parts of the system both being better off with different paradigms then it's best to design them both in their own paradigms.

#### Sticking with Model-Driven Design when Mixing Paradigms

- The example the book goes through is modelling rules in your project, although you can model rules with objects there is a technology (Rules engine) that does it much better. Mixing the rules paradigm with the objects paradigm.
  - It is important to continue to think in terms of models while working with rules.
  - The goal is to find a single model that can work with both paradigms.
  - The most effective tool for holding the parts together is a robust _ubiquitous language_ that underlies the whole heterogeneous model.
- A model-driven design does not have to be object-orientated but it does depend on having an expressive implementation of the model constructs.
- Below are 4 rules of thumb for mixing non-object elements into a predominantly object-orientated system:
  1. **Don't fight the implementation paradigm.**
     - There's always another way to think about a domain.
     - Find model concepts that fit the paradigm.
  2. **Lean on the ubiquitous language.**
     - Even when there is no rigorous connection between tools, very consistent use of language can keep parts of the design from diverging.
  3. **Don't get hung up on UML.**
     - Can lead you to distort the model to make it fit what can easily be drawn.
     - Sometimes just a plain old english description is better.
  4. **Be sceptical.**
     - Is the tool I am using pulling its weight?
     - Just because you have some rules doesn't mean you need a rules engine.
     - Question these things.
     - Mixing paradigms is complicated, and if its not necessary don't do it.
- Before mixing paradigms the options within the dominant paradigm should be exhausted.
