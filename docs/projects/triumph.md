# Triumph

## Overview

This was a University project for the CITS3001 unit at UWA. It involved creating a CLI political war game based around the resistance and the government. The goal was to incorporate a level of AI to the game. Although I don't think I totally achieved this, I was happy with what a learnt through project. Below is my project write up that was submitted with the project.

## Introduction

Triumph is a political wargame developed where a movement called "The Resistance" is seeking geopolitical influence over the Government. Both of these parties are represented as a Red (The Resistance) and Blue (Government) agent. The Resistance's key objective is to influence the general population which is represented as Green nodes. The Government's objective is to resist the Resistance's plans and prevent their numbers from growing and to promote democratic government over the entire country. There is a certain amount of days until election day and whoever has the most voters/non-voters on the day, wins the game.

The game is represented as a network of green nodes that have attributes which define their opinion on whether they want to vote or not, this is a scale between 0 and 1 representing how uncertain they are.

Both teams can send out messages which have different levels of potency, the game is based on "high risk, high reward". The more the potent the message, the more followers they can attract if the message is successfully received. However, if the message is unsuccessfully received, the more they lose.

The Government has an energy bar which can decrease depending on how potent the message they said is, if they run out of energy, they lose the game. They also have an option to send spies to sabotage the Resistance without using any of their energy. This does come with a cost since a spy can potentially betray them and benefit the Resistance.

## Assumptions

1. The uncertainty intercal is (0,1), where values towards 0 are less uncertain (certain) and values towards 1 are more uncertain.
2. No one in the population is ever completely uncertain or certain.
3. Uncertainty under 0.2 means that the individual is certain of their opinion.
4. Green node's opinions were set to be either true or false, true meaning "Vote" and false meaning "Not Vote".

## Selection and Design of Appropriate AI Technology

### Methodology

Multiple values which were decided to be user inputs for the game, some varied depending on the game mode which was being played and some were inputs regardless of the game mode. The values that values where game mode was irrelevant included:

- How many green agents (nodes) were in the population (think of general population of our simulated world).
- How long until Election Day (how many rounds of play).
- How many grey agents (nodes) will be in the game (spies).
- The probability of betrayal from a spy (decimal 0-1).
- The probability of a node being connected to another node in the graph (think of it as how well people know each other).

Extra inputs depending on game mode:

- Game Mode 1 - Playing as the Red Team (Government).
  - A message of certain potency to be sent to the green population.
- Game Mode 2 - Playing as the Blue Team (Resistance).
  - A message of certain potency to be sent to the green population.
  - Option to send a spy to sabotage the Red Team's operation.
  - Option to miss a turn and wait for next round.

### Intelligence

The integration of agent intelligence was initially a central design consideration. However, due to time constraints, the sophistication of the agents’ decision-making processes was limited. Instead, players are able to modulate the level of uncertainty associated with agent behaviour at the outset of the game, thereby influencing overall difficulty.

While Bayesian reasoning was considered as a mechanism for modelling agent intelligence, its implementation was ultimately constrained. Bayes’ theorem, however, was employed as a core computational component for determining the extent to which messages were effectively received by the population.

Game difficulty, therefore, is largely governed by the initialisation parameters set at the beginning of play. Rather than enhancing agent intelligence per se, these parameters adjust the likelihood of successful influence. For example, difficulty may be increased by raising the probability that Government messages are well received, or by configuring spies deployed by the Resistance to have a high likelihood of betrayal.

In summary, the parameters that most significantly alter gameplay dynamics are:

- The degree of social connectivity within the population.
- The level of uncertainty applied to Government or Resistance strategies.
- The probability of spy betrayal against their assigned faction.

## Agents

### Design

- In regards to the uncertainty of the agents, below 0.2 is considered certain they will vote and above 0.8 is considered certain they will NOT vote (ie. they won't change their mind). The middle is the "uncertain" range.

#### Green Agent

- Attributes:
  - _name_: It's ID.
  - _voteStatus_: boolean variable, true if they want to vote, false if they don't.
  - _uncertainty_: number between 0 and 1, representing how uncertain they are and determines if they want to vote or not.

#### Blue Agent

- Can send messages of differing potencies.
- Attributes:
  - _name_: It's name given when created.
  - _uncertainty_: number between 0 and 1, representing the agent's uncertainty.
  - _usr_energy_: number between 0 and 100, representing the user's energy (used in game mode 2, playing as the blue team).
  - _energy_: number between 0 and 100, representing the energy which is used for the AI functions.
- The blue agent has the ability to skip a turn to try and recoup some of its lost energy.

#### Red Agent

- Can send messages of differing potencies.
- Attributes:
  - _name_: It's name given when created.
  - _uncertainty_: number between 0 and 1, representing the agents uncertainty.

#### Grey Agent

- Attributes:
  - _name_: It's name given when created.
  - _betray_: number between 0 and 1, representing the likelihood of betraying the government (blue team).
- The grey agent's (or spy's) betrayal can be interpreted as it's uncertainty towards the government.

### Implementation

- The agents were implemented in python with an object-orientated approach.

#### Green Agents

- Used the Erdos-Renil model to implement the network graph.
  - Mainly due to it considering a random graph model.
  - Great for randomly generated population networks.
- Used the **NetworkX** library has a random graph generation function that incorporates the Erdos-Renil model.
  - Each edge in the graph is considered with a probability, `p`, independent from the other edges.
  - All the graphs with `n` nodes and `M` edges have an equivalent probability: `p^M(1-p)^((n/2)-M)`

#### Red Agents

- Uncertainty is used in the calculation of the probability of a message being received well.
- This agent would, when it is it's turn, assess the current status of the game and with its current influence and uncertainty make a decision to try and influence more nodes uncertainties the way they want.

#### Blue Agents

- The energy of the blue agent is affected each time it sends a message and the potency of the message determines how much energy will be lost.
- The uncertainty is not only used for calculating the likelihood of a message being received well, it is also affected by the result of the message.
  - If the message isn't received well, it will increase it's uncertainty which will affect its next term.
  - If the message is received well, it will decrease it's uncertainty which will affect its next term.

#### Grey Agents

- Have 2 attributes, betray and name.
  - **name**: exists for debugging purposes.
  - **betray**: changed via user input and it represents the probability that a spy/grey agent will betray the blue team.
- They can be sent whenever wanted when a human player plays but the AI will only send a spy if it has any available and is low on energy (ie. it needs to save energy).

#### Bayes Theorem

- Used to calculate conditional probabilities for how the messages are received by the green nodes.
- This theorem provides an organic and principled result by combining previous results with data.
- `P(M|U) - (P(U|M) * P(M))/P(U)`
  - **P(M|U)**: probability of a message being received well given the agent is uncertain.
  - **P(M)**: probability of a message being received well (depends on the potency).
  - **P(U)**: The agent's uncertainty.
  - **P(U|M)**: probability of an agent being uncertain given that the message was received well.

#### Message & Potency

- There are 5 different messages, 1 through 5, with an increasing level of potency.
- The higher the potency the more followers you can potentially gain or lose.
- The lower the potency the fewer followers you can potentially gain or lose.
- The message also affects the agent's uncertainty in a similar fashion.
- A high risk, high reward principle.

## Program Runtime

- Runs well.
- Experiences performance hindrances when large populations are paired with many rounds.
- Experiments:
  - Population of 500, 10 days: **24.24s**
  - Population of 50, 200 days: **1.19s**
  - Population of 500, 50 days: **1119.47s**

## Languages & Libraries

- Used **python** for ease of implementation and useful libraries.
- **NetworkX**: used to help implement our network of nodes (allows each node to have attributes).
- **matplotlib**: A visualisation library to visualise the population via graphs.
- **colorama**: to add color to the terminal, for visual appearance.
- **pyprobs**: used to do the probability calculations in the game.
