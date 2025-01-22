# Part V: Architecture

A software architect is responsible for the shape of a project. They do not shy away from programming tasks and still do lots of programming tasks to gain insights into the system. They're goal is to guide the team towards a desirable design optimal for development, deployment, operation, and maintenance. The form of the shape is in the division of a system by its components, their arrangements, and how they interact with each other.

## Development

- It is common for smaller teams to avoid caring too much about their architecture in the early days of development.
- Leading to lack of architecture as project grows.

- For larger teams, a well thought out architecture is essential.
- Otherwise you end up with a "component-per-team" and the project as a whole becomes very difficult to put together and maintain.

## Deployment

- The higher the cost of deployment, the less useful the system is.
- A goal of a software architecture should be to make a system that can easily be deployed with a single action.
- Deployment strategy is usually neglected early in development, which can make it nicer to develop but harder to deploy later down the line.

## Operation

- Most operational difficulties can be solved by throwing money at the issue (more hardware).
- Hardware is cheap and people are expensive.
- Not to say that an architecture that is well tuned to the operation of the system is not desirable, it is!
  - The cost equation just leans more towards dev, deployment, and maintenance.
- A good software architecture communicates the operational needs of the system.
- Architecture should reveal operation.

## Maintenance

- The most costly!
- The never ending new features and big fixing/finding consume a lot of human resources.
- Main maintenance cost are in _Spelunking_ and risk.
  - _Spelunking_ is when you go digging through the code base to find where to add the new feature or to find the defect.
- While making such changes, there is a chance you may break something else.
- A carefully thought out architecture can greatly reduce these costs.

## Keeping Options Open

- Software exists so that we can quickly and easily change the behaviour of machines.
- This flexibility depends largely on the shape of the system.
- The way you keep software soft, is to leave as many options open as possible, for as long as possible.
- All software systems can be broken down into 2 major elements: **policy** and **details**.
  - The policy element embodies all the business rules and procedures, it is where the true value of the system lives.
  - The details are the things necessary to enable humans, other systems, and programmers to communicate with the policy, but that don't impact the behaviour of the policy at all (frameworks, IO devices, databases, servers, etc).
- The goal of the architect is to create a shape for the system that recognises policy as the most essential element of the system while making the details irrelevant to that policy.
  - This allows decisions about those details to be delayed or deferred.
- If you can develop the high-level policy without committing to the details around it, you can delay and defer decisions about those details for a long time.
- The longer you wait the more informed you'll be later on to make a better decision.
- This also allows for easy experimentation with different details.
- IF A DECISION HAS ALREADY BEEN MADE it is beneficial to design your piece of work as if the decision has not been made for all the reasons above.
- A good architect maximises the number of decisions NOT made.

## Device Independence

- Refers to the **Open-Closed** principle.
- Not directly relying on a device and being open for extension but closed for modification.
- The example that's spoken about is how back in the day they had to use punch cards and all the code was written specifically for that.
- Then one day we discovered that magnetic tape is better which required a whole code re-write.
- This principle involves abstracting specific device implementations into functions (or classes, it doesn't matter) so that when a new device comes along we don't need to change anything. We just add on some new functionality.
