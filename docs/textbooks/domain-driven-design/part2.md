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
-
