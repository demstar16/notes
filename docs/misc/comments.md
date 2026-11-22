# Comments - git & Code
Useful comments and messages can help other tools work more effectively and save you time such as AI tools, grok and grep.
Aside from this, having a specific format can really assist with parsing and making the info more machine readable.
## Format
```
<label> [decorations]: <subject>

[discussion]
```
### Examples
- `suggestion:` This is not worded correctly.
- `issue (non-blocking):` This is not worded correctly.
- `issue (blocking):`This is not worded correctly
- `issue (ux, non-blocking):` These buttons should be red, but let's handle this in a follow-up.
Example to illustrate parsing:
```
question (non-blocking): At this point, does it matter which thread has won?

Maybe to prevent a race condition we should keep looping until they’ve all won?
```
into
```json
{
  "label": "question",
  "subject": "At this point, does it matter which thread has won?",
  "decorations": ["non-blocking"],
  "discussion": "Maybe to prevent a race condition we should keep looping until they've all won?"
}
```
## Labels

| **praise:**     | Praises highlight something positive. Try to leave at least one of these comments per review. _Do not_ leave false praise (which can actually be damaging). _Do_ look for something to sincerely praise.                                                                                                                   |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **nitpick:**    | Nitpicks are trivial preference-based requests. These should be non-blocking by nature.                                                                                                                                                                                                                                    |
| **suggestion:** | Suggestions propose improvements to the current subject. It’s important to be explicit and clear on _what_ is being suggested and _why_ it is an improvement. Consider using patches and the _blocking_ or _non-blocking_ [decorations](https://conventionalcomments.org/#decorations) to further communicate your intent. |
| **issue:**      | Issues highlight specific problems with the subject under review. These problems can be user-facing or behind the scenes. It is strongly recommended to pair this comment with a `suggestion`. If you are not sure if a problem exists or not, consider leaving a `question`.                                              |
| **todo:**       | TODO’s are small, trivial, but necessary changes. Distinguishing todo comments from issues: or suggestions: helps direct the reader’s attention to comments requiring more involvement.                                                                                                                                    |
| **question:**   | Questions are appropriate if you have a potential concern but are not quite sure if it’s relevant or not. Asking the author for clarification or investigation can lead to a quick resolution.                                                                                                                             |
| **thought:**    | Thoughts represent an idea that popped up from reviewing. These comments are non-blocking by nature, but they are extremely valuable and can lead to more focused initiatives and mentoring opportunities.                                                                                                                 |
| **chore:**      | Chores are simple tasks that must be done before the subject can be “officially” accepted. Usually, these comments reference some common process. Try to leave a link to the process description so that the reader knows how to resolve the chore.                                                                        |
| **note:**       | Notes are always non-blocking and simply highlight something the reader should take note of.                                                                                                                                                                                                                               |
| **typo:**       | Typo comments are like **todo:**, where the main issue is a misspelling.                                                                                                                                                                                                                                                   |
| **polish:**     | Polish comments are like a **suggestion**, where there is nothing necessarily wrong with the relevant content, there’s just some ways to immediately improve the quality.                                                                                                                                                  |
| **quibble:**    | Quibbles are very much like **nitpick:**, except it does not conjure up images of lice and animal hygiene practices.                                                                                                                                                                                                       |

