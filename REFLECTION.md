# Reflection

**Name / Andrew ID:**
Sissi Zhen / yuxizhen

**Recitation group members (Task 2):**
Misha Garg

---

### 1. Valid but weak

Pick a property you wrote that passes on the correct implementation but
kills few or no mutants. Why is it still a *valid* property? Describe a
concrete bug (not one of our mutants) that it *would* catch.

Property: "input is not modified after the function is run" (line 70-78)
The property only killed 1 mutant: aliasesInput. It is still a valid property because it follows the specs' requirement that an input array and its elements should not be modified. A bug that it can catch is the case where the input intervals list is disjoint but unsorted, and for the implementation to sort the list in place. 

### 2. A generator problem, not a property problem

Describe a mutant, from either task, that survived or was flaky because of
your **generator** rather than your property. What did the generator fail to
produce? How did you fix it? Paste the runner output from before and after.

Once I implemented invariant "result's intervals neither overlap nor touch" using the generator with the checkpoint 1 fix, I was surprised to see touchingNotMerged survived / was flaky. 
Turns out, I wasn't limiting the range of my generator, so it's unlikely for the generator to produce list of intervals with overlaps. 
I fixed it by passing a {min, max} object into the fc.integer(generator), and the mutant was killed. 
Runner output (with all other tests commented out): 
1. Before: 
  ✘ assumesSorted           SURVIVED
  ✘ lexicographicSort       SURVIVED
  ~ touchingNotMerged       flaky: killed in 1/5 runs  by: result's intervals neither overlap nor touch
    Counterexample: [[[-15,-15],[-15,0]]]
    AssertionError: expected -15 to be less than -15
  ✘ mergesIntegerNeighbors  SURVIVED
  ✘ keepsLastEnd            SURVIVED
  ✘ dropsLast               SURVIVED
  ✘ aliasesInput            SURVIVED
2. After: 
  ✘ assumesSorted           SURVIVED
  ✘ lexicographicSort       SURVIVED
  ✔ touchingNotMerged       killed  by: result's intervals neither overlap nor touch
      Counterexample: [[[-5,0],[-6,-5]]]
      AssertionError: expected -5 to be less than -5
  ✘ mergesIntegerNeighbors  SURVIVED
  ✘ keepsLastEnd            SURVIVED
  ✘ dropsLast               SURVIVED
  ✘ aliasesInput            SURVIVED

### 3. Reading a counterexample

Paste one counterexample that the mutation runner printed for a killed
mutant. In 2–3 sentences, explain using the *specification* why that input
exposes the bug.

✔ mergesIntegerNeighbors  killed  by: if inputs do not overlap or touch, output should match input exactly
    Counterexample: [[[1,1],[2,2]]]
    AssertionError: expected [ [ 1, 2 ] ] to deeply equal [ [ 1, 1 ], [ 2, 2 ] ]

This input had consecutive intervals that neither overlap nor touch. As per the spec (src/mergeInterval.ts:17), [1, 1] and [2, 2] leave a gap (1 < x < 2), so the only 2 intervals should stay separate in the output. Instead, the mutant returns a merged interval [1, 2], which fails the conditional property check.

### 4. Your project

Name one function or module in your team's project that would benefit from
property-based testing. State two properties in English, name the pattern of
each, and describe the generator you'd need, including anything about its
inputs that a naive generator would get wrong.

1. For any providers, the prompt always contains the tutor's "explain directly when asked" clause exactly once, nothing drops or truncates it. This property is an invariant. The generator use random providers, random AGENTS.md context, random user instructions. A naive generator may only generate short contexts, while dropping/truncating contexts only show up for long instructions.  

2. For any write type tool call, the resolved permission for the tutor agent is never "allow". This property is an invariant. The generator creates random config objects. A naive generator may only generate configs that do not conflict with tutor's permissions, and never tests for global/project setting overriding write-tools deny. 