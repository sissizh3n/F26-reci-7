import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { mergeIntervals, type Interval } from '../src/intervals';

// Recitation Part 2 (groups) and problem set Task 2.
// Read the spec in src/intervals/mergeIntervals.ts, then check your progress
// with `npm run mutants:intervals`.
//
// Label every property with its pattern, on the line above its `it(`:
//   // Pattern: invariant. The output is sorted.
// (invariant, algebraic, metamorphic, differential, or conditional)

// A first attempt at a generator. It has a problem: run the tests and read
// the counterexample.
const interval: fc.Arbitrary<Interval> = fc
  .tuple(fc.integer({min:-10, max:10}), fc.integer({min:-10, max:10}))
  .map(([a, b]) => (a <= b ? [a, b] : [b, a]));
const intervalList = fc.array(interval);

const covered = (input: readonly Interval[], p: number) => 
  input.some(([s, e]) => s <= p && p <= e);

// Sorted, pairwise disjoint intervals built left to right: each interval starts
// gap >= 1 after the previous one ends, so none overlap or touch.
const disjointIntervals: fc.Arbitrary<Interval[]> = fc
  .tuple(
    fc.integer({min: -10, max: 10}),
    fc.array(fc.tuple(fc.integer({min: 1, max: 3}), fc.integer({min: 0, max: 3}))),
  )
  .map(([start, pairs]) => {
    const out: Interval[] = [];
    let cursor = start;
    for (const [gap, len] of pairs) {
      const s = cursor + gap;
      out.push([s, s + len]);
      cursor = s + len;
    }
    return out;
  });

describe('mergeIntervals', () => {
  // Pattern: invariant. Every input interval lies inside some output interval.
  it('every input interval lies inside some output interval', () => {
    fc.assert(
      fc.property(intervalList, xs => {
        const out = mergeIntervals(xs);
        const uncovered = xs.filter(([s, e]) => !out.some(([a, b]) => a <= s && e <= b));
        expect(uncovered).toEqual([]);
      }),
    );
  });

  // Add your properties here. Aim for at least one of each pattern:
  // invariant, algebraic, metamorphic, differential, conditional.
});

// Pattern: invariant. result's intervals neither overlap nor touch.
it("result's intervals neither overlap nor touch", () => {
  fc.assert(
    fc.property(intervalList, input => {
      const output = mergeIntervals(input);
      for (let i = 0; i + 1 < output.length; i++) {
        expect(output[i][1]).toBeLessThan(output[i+1][0]);
      }
    }),
  );
});

// Pattern: invariant. input is not modified after the function is run.
it("input is not modified after the function is run", () => {
  fc.assert(
    fc.property(intervalList, input => {
      const inputCopy = structuredClone(input);
      mergeIntervals(input);
      expect(inputCopy).toEqual(input); 
    }),
  );
});

// Pattern: differential. output and input cover exactly the same points.
it("output and input cover exactly the same points", () => {
  fc.assert(
    fc.property(intervalList, fc.integer({min:-10, max:10}), fc.boolean(), (input, num, half) => {
      const output = mergeIntervals(input);
      const p = half ? num + 0.5 : num; 
      expect(covered(output, p)).toBe(covered(input, p));
    }),
  );
});

// Pattern: metamorphic. sorting input by start does not change output. 
it("sorting input by start does not change output", () => {
  fc.assert(
    fc.property(intervalList, (input) => {
      const unsorted = mergeIntervals(input);
      const descending = mergeIntervals([...input].sort((a, b) => b[0] - a[0])); 
      const ascending = mergeIntervals([...input].sort((a, b) => a[0] - b[0])); 
      expect(unsorted).toEqual(descending);
      expect(unsorted).toEqual(ascending);
    }),
  );
});

// Pattern: algebraic (idempotency). merging a merged intervals list returns a list exactly the same. 
it("merging a merged intervals list returns a list exactly the same", () => {
  fc.assert(
    fc.property(intervalList, (input) => {
      const mergedOnce = mergeIntervals(input);
      const mergedTwice = mergeIntervals([...mergedOnce]);
      expect(mergedTwice).toEqual(mergedOnce);
    }),
  );
});

// Pattern: conditional. if inputs do not overlap or touch, output should match input exactly.
it("if inputs do not overlap or touch, output should match input exactly", () => {
  fc.assert(
    fc.property(disjointIntervals, (input) => {
      const output = mergeIntervals(input);
      expect(output).toEqual(input);
    }),
  );
});

describe('mergeIntervals', () => {
  it.todo("result's intervals neither overlap nor touch");
  it.todo("input is not modified after the function is run");
  it.todo("output and input cover exactly the same points");
  it.todo("sorting input by start does not change output");
  it.todo("merging a merged intervals list returns a list exactly the same");
  it.todo("if inputs do not overlap or touch, output should match input exactly");
});