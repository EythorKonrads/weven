/** ISO 4217 currency codes Weven supports. Extend as currencies are added. */
export const CURRENCY_CODES = ['DKK', 'ISK', 'EUR', 'SEK', 'NOK', 'USD', 'GBP'] as const;

export type CurrencyCode = (typeof CURRENCY_CODES)[number];

/** An amount in integer minor units (øre, cents) of a currency. Never a float. */
export type Money = {
  readonly amount: number;
  readonly currency: CurrencyCode;
};

export class CurrencyMismatchError extends Error {
  constructor(a: CurrencyCode, b: CurrencyCode) {
    super(`Cannot combine ${a} and ${b}`);
    this.name = 'CurrencyMismatchError';
  }
}

export class NonIntegerAmountError extends Error {
  constructor(amount: number) {
    super(`Money amounts must be safe integers in minor units, got ${amount}`);
    this.name = 'NonIntegerAmountError';
  }
}

function assertSafeInteger(amount: number): void {
  if (!Number.isSafeInteger(amount)) {
    throw new NonIntegerAmountError(amount);
  }
}

/** Adds two amounts of the same currency. Throws on mixed currencies or non-integer amounts. */
export function addMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) {
    throw new CurrencyMismatchError(a.currency, b.currency);
  }
  assertSafeInteger(a.amount);
  assertSafeInteger(b.amount);
  const amount = a.amount + b.amount;
  assertSafeInteger(amount);
  return { amount, currency: a.currency };
}
