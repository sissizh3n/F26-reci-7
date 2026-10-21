import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { matchGuess } from '../src/wordle';

// Recitation Part 1: follow along with your TA, filling in the todos below.
// Problem set Task 1: keep adding properties until `npm run mutants:wordle`
// kills every mutant. Read the spec in src/wordle/matchGuess.ts.
//
// Label every property with its pattern, on the line above its `it(`:
//   // Pattern: invariant. The result always has exactly five colors.
// (invariant, algebraic, metamorphic, differential, or conditional)

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Step 1: a generator for five-letter uppercase words.
// const word = ...

const wordFrom = (letters: string) =>
  fc.array(fc.constantFrom(...letters), { minLength: 5, maxLength: 5 }).map(cs => cs.join(''));
const word = wordFrom(ALPHABET);
// A small alphabet makes repeated and shared letters common, so duplicate-letter
// cases (the tricky part of the spec) show up in most runs.
const smallWord = wordFrom('ABC');

// pattern: invariant. the result always has exactly five colors.
it('returns exactly five colors', () => {
  fc.assert(
    fc.property(word, word, (secret, guess) => {
      expect(matchGuess(secret, guess)).toHaveLength(5);
    }),
  );
});

// pattern: invariant. the result always only has green, yellow, or black.
it('only uses the colors G, Y, B', () => {
  fc.assert(
    fc.property(word, word, (secret, guess) => {
      for (const c of matchGuess(secret, guess)) expect (['G', 'Y', 'B']).toContain(c);
    }),
  );
});

// pattern: conditional. if the guess is secret, every color is green.
it('guessing the secret gives all greens', () => {
  fc.assert(
    fc.property(word, w => {
      expect(matchGuess(w, w)).toEqual(['G', 'G', 'G', 'G', 'G']);
    }),
  );
});

// pattern: invariant. each letter is credited (G or Y) exactly min(count in guess, count in secret) times.
it('credits each letter as many times as both words share it', () => {
  fc.assert(
    fc.property(smallWord, smallWord, (secret, guess) => {
      const result = matchGuess(secret, guess);
      for (const letter of new Set(guess)) {
        const credited = [...guess].filter((c, i) => c === letter && result[i] !== 'B').length;
        const inGuess = [...guess].filter(c => c === letter).length;
        const inSecret = [...secret].filter(c => c === letter).length;
        expect(credited).toBe(Math.min(inGuess, inSecret));
      }
    }),
  );
});

describe('matchGuess', () => {
  it.todo('returns exactly five colors');
  it.todo('only uses the colors G, Y, B');
  it.todo('guessing the secret gives all greens');
  it.todo('credits each letter as many times as both words share it');
});

