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

### Implementation
