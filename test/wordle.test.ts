import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { matchGuess } from '../src/wordle';
import { match } from 'node:assert';

// Recitation Part 1: follow along with your TA, filling in the todos below.
// Problem set Task 1: keep adding properties until `npm run mutants:wordle`
// kills every mutant. Read the spec in src/wordle/matchGuess.ts.
//
// Label every property with its pattern, on the line above its `it(`:
//   // Pattern: invariant. The result always has exactly five colors.
// (invariant, algebraic, metamorphic, differential, or conditional)

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const wordFrom = (letters : string) => 
  fc.array(fc.constantFrom(...letters), { minLength: 5, maxLength: 5}).map(cs => cs.join(''));
const word = wordFrom(ALPHABET);

it("returns exactly 5 colors"), () => {
  fc.assert(
    fc.property(word, word, (secret, guess) => {
      expect(matchGuess(secret, guess)).toHaveLength(5); 
    }),
  );
}; 

it("only uses tcolors GYB"), () => {
  fc.assert(
    fc.property(word, word, (secret, guess) => {
      expect(matchGuess(secret, guess)).toHaveLength(5); 
      for (const c of matchGuess(secret, guess)) expect(['G', 'Y', 'B']).toContain(c); 
    }),
  );
}

it("guess secret word gives all greens"), () => {
  fc.assert(
    fc.property(word, word, (secret, guess) => {
      expect(matchGuess(secret, guess)).toEqual(['G','G','G','G','G']); 
    }),
  );
}

it("returns exactly 5 colors"), () => {
  fc.assert(
    fc.property(word, word, (secret, guess) => {
      const result = matchGuess(secret, guess);
      for (const letter of new Set(guess)) {
        const credited = [...guess].filter((c, i) => c === letter && result[i] !== 'B').length; 
        const inSecret = [...secret].filter(c => c === letter).length; 
        expect(credited).toBeLessThanOrEqual(inSecret);
      }
    }),
  );
}

describe('matchGuess', () => {
  it.todo('returns exactly five colors');
  it.todo('only uses the colors G, Y, B');
  it.todo('guessing the secret gives all greens');
  it.todo('never credits a letter more times than the secret contains it');
});
