# Part I: Putting the Domain Model to Work

## Introduction

- Every software program relates to some activity or interest, the subject area to which a user applies the program is the **domain**.
- A model is a selectively simplified and consciously structured form of knowledge.
- A **domain model** is a rigorously organised and selective abstraction of the knowledge in a domain experts head.
- In DDD, three basic uses the determine the choice for a model:
  1. The model and the heart of the design shape each other, the link between model and implementation.
  2. The model is the backbone of a language used by all team members, allows communication between all relevant groups on the project without translation.
  3. The model is distilled knowledge, it is an agreed upon way, by everyone, of structuring domain knowledge.
- The heart of software is to solve domain-related problems.

## Crunching Knowledge

- The process of understanding the domain as a software developer takes time and is a process that requires lots of discussions and diagramming (UML can be helpful here.)
- The ingredients for effective modelling:
  - **Binding the model and the implementation** together, you can do this by roughing out a model (even if its wrong) and iterating over that model improving it as you deepen your understanding.
  - **Cultivating a language based on the mode.**
  - **Developing a knowledge-rich model**: showing and understanding the objects behaviour and rules.
  - **Distilling the model**: concepts can be added to make the design more complete, but concepts can also be dropped if deemed no longer useful to the model.
  - **Brainstorming and experimenting**.
- If programmers aren't interested in the domain they learn only what the application should do, not the intention behind it.
- It is essential to apply **continuous learning** so that we don't just deliver code, we deliver the knowledge that comes along with it (a well designed system.)
- You should learn something new when talking about and going over a domain model.
- Lots of stuff within a domain is solved daily through common sense and experience, software can't do this. This is why knowledge crunching fleshes out all these rules and captures the complexities of the domain.

## Communication and the Use of Language

- The model is a set of concepts built up in the heads of people on the project, with terms and relationships that reflect domain insight. These terms and interrelationships provide the semantics of a language that is tailored to the domain while being precise enough for technical development.
- **Ubiquitous Language**: A versatile, shared team language that is used for team projects.
- The entire point of having a ubiquitous language is so that everyone can speak in the same terms which will increase productivity and clarity ten fold.
- Coming up with the language that your team will use can be difficult and can require some time, but it is worth it.
- The model is used as the backbone of a language, you must commit to exercising that language relentlessly in all communication.
- A change in the ubiquitous language is a change to the model.
- Modelling out loud (actually speaking) can be a great way of ironing out details of the model, like seeing what terms sound better for example.
- Diagrams can be a great way of deepening ones understanding of the language and the model, usually sketch UML diagrams excel at this.
- Documents are also a great way to share understanding of a model, the hard part is ensuring that the documents (and diagrams) evolve as the code does.
  - Anytime the model changes, the documents and diagrams must change too.
  - Documents should complement code and speech.
  - A document must be involved in project activities.
- In XP (Extreme Programming), its convention to totally rely on the code itself and its tests to describe how everything is working.
  - The main discussion with this is that the message code communicates is not guaranteed to be accurate (ie. out of date variable names can mislead what is happening, functions may have side effects, etc.)
- One model should underline implementation, design, and team communication.

## Binding Model and Implementation

- Tightly relating the code to an underlying model gives the code meaning and makes the model relevant.
- Pure analysis models get abandoned soon after coding starts, this is due to developers having to make their own abstractions to understand the model for development. This ultimately leads to not the same realisations that the analysts experienced occurring.
- If any part of the design does not map to the domain model, a divide will emerge between analysis and design so that insight gained in each doesn't feed into one another.
- The code should be an expression of the model.
- It's important to keep in mind that a well coupled and designed model and implementation won't happen straight away or in one step, it'll take many iterations.
- Ubiquitous language, the model, and the code or not separate items. They are all linked to one another to make a project conceptually strong and easy to understand and maintain.

---

[Return](../)
