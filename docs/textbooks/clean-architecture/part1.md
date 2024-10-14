# Part I: Introduction

<!-- TODO: Fix anchors, the build will tell you which ones -->

- [Part I: Introduction](#part-i-introduction)
- [What is Design and Architecture?](#what-is-design-and-architecture)
- [A Tale of Two Values](#a-tale-of-two-values)

# What is Design and Architecture?

- When software is done right, you save time and resources, increase maintainability and scalability, and it makes fixing issues much easier.
- Design and Architecture and interchangeable, there is no difference between the 2.
  - The low-level details and the high-level structure are all part of the same whole, can't have on without the other.
- **The goal** of software architecture is to minimise the human resources required to build and maintain the required system.
- A simple way to measure the level of the design:
  - If the measure of effort required to meet the needs of the customer is low and stays low throughout the lifetime of the system, the design **is good**.
  - If the measure of effort required to meet the needs of the customer grows with each new release, the design **is bad**.

Business Example:

- When with each iteration of the system: the number of staff is increasing, cost is increasing, and productivity is plateauing/decreasing.
- This screams an issue, and is usually due to not wanting to deal with writing clean code and making cautious design decisions now, they are put off.
- Being caught in this trap of always rushing to complete the next feature will be your downfall.

**Don't fall for the "I'll do it later" trap!**

Solutions:

- Complete your work under test (TDD).
- Take your time when making coding decisions.
- Write clean code as you're working, don't rely on "cleaning it up later".

# A Tale of Two Values

- The 2 things software developers must maintain are **Behaviour** & **Structure**.
- Behaviour requires a programmer to write code that meets a spec and either makes or saves money for the stakeholders.
- Structure refers to the structure of our software and ensuring that it is easy to change.
  - If a stakeholder changes their mind on a feature or wants to add a feature, this change should be easy to make.
- Architectures should be as shape agnostic are practical.
- It is more important for a system to be able to adapt to change than it is for it to work.
  - If a system isn't adaptable but works, when the requirements change, the system is done for.
  - If the system can adapt but doesn't work, we can make it work as requirements change.

_The urgent are not important, and the important are never urgent._

- Behaviour: Is urgent but never particularly important.
- Structure/Architecture: Is important but never particularly urgent.

Priorities:

1. Urgent and important.
2. Not urgent and important.
3. Urgent and not important.
4. Not urgent and not important.

**It is the responsibility of the developers to assert the importance of architecture over the urgency of features.**

---

[Return](../)
