const { Statistics } = require('./statistics.js');

describe('Statistics', () => {
  let stats;
  
  beforeEach(() => {
    stats = new Statistics();
  });
  
  test('should calculate total income', () => {
    const transactions = [
      { type: 'income', amount: 1000 },
      { type: 'expense', amount: 200 },
      { type: 'income', amount: 500 }
    ];
    expect(stats.calculateTotalIncome(transactions)).toBe(1500);
  });
  
  test('should calculate total expenses', () => {
    const transactions = [
      { type: 'income', amount: 1000 },
      { type: 'expense', amount: 200 },
      { type: 'expense', amount: 300 }
    ];
    expect(stats.calculateTotalExpenses(transactions)).toBe(500);
  });
  
  test('should calculate balance', () => {
    const transactions = [
      { type: 'income', amount: 1000 },
      { type: 'expense', amount: 200 },
      { type: 'expense', amount: 300 }
    ];
    expect(stats.calculateBalance(transactions)).toBe(500);
  });
});