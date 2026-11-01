import fc from 'fast-check';
import { describe, expect, it } from 'vitest';

import {
  addMoney,
  CURRENCY_CODES,
  CurrencyMismatchError,
  type Money,
  NonIntegerAmountError,
} from './money';

// Keep sums inside the safe-integer range so the properties are about addition, not overflow.
const LIMIT = Math.floor(Number.MAX_SAFE_INTEGER / 2);
const currency = fc.constantFrom(...CURRENCY_CODES);
const amount = fc.integer({ min: -LIMIT, max: LIMIT });
const moneyPair = fc.tuple(currency, amount, amount).map(([c, x, y]): [Money, Money] => [
  { amount: x, currency: c },
  { amount: y, currency: c },
]);

describe('addMoney', () => {
  it('adds amounts of the same currency', () => {
    expect(addMoney({ amount: 150, currency: 'DKK' }, { amount: 275, currency: 'DKK' })).toEqual({
      amount: 425,
      currency: 'DKK',
    });
  });

  it('is commutative', () => {
    fc.assert(
      fc.property(moneyPair, ([a, b]) => {
        expect(addMoney(a, b)).toEqual(addMoney(b, a));
      }),
    );
  });

  it('keeps the currency and stays an integer', () => {
    fc.assert(
      fc.property(moneyPair, ([a, b]) => {
        const sum = addMoney(a, b);
        expect(Number.isInteger(sum.amount)).toBe(true);
        expect(sum.currency).toBe(a.currency);
      }),
    );
  });

  it('throws on mixed currencies', () => {
    expect(() =>
      addMoney({ amount: 100, currency: 'DKK' }, { amount: 100, currency: 'ISK' }),
    ).toThrow(CurrencyMismatchError);
  });

  it('throws on non-integer amounts', () => {
    fc.assert(
      fc.property(currency, fc.double({ noInteger: true }), amount, (c, bad, good) => {
        expect(() => addMoney({ amount: bad, currency: c }, { amount: good, currency: c })).toThrow(
          NonIntegerAmountError,
        );
        expect(() => addMoney({ amount: good, currency: c }, { amount: bad, currency: c })).toThrow(
          NonIntegerAmountError,
        );
      }),
    );
  });

  it('throws when the sum leaves the safe-integer range', () => {
    expect(() =>
      addMoney(
        { amount: Number.MAX_SAFE_INTEGER, currency: 'EUR' },
        { amount: 1, currency: 'EUR' },
      ),
    ).toThrow(NonIntegerAmountError);
  });
});
