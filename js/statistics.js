class StatisticsManager {
  constructor(transactionManager) {
    this.transactionManager = transactionManager;
  }

  calculateTotalIncome(transactions = null) {
    const trans = transactions || this.transactionManager.getTransactions();
    return trans
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  calculateTotalExpenses(transactions = null) {
    const trans = transactions || this.transactionManager.getTransactions();
    return trans
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  calculateBalance(transactions = null) {
    const trans = transactions || this.transactionManager.getTransactions();
    return this.calculateTotalIncome(trans) - this.calculateTotalExpenses(trans);
  }

  getAverageMonthlyExpense() {
    const transactions = this.transactionManager.getTransactions();
    const expenses = transactions.filter(t => t.type === 'expense');
    if (expenses.length === 0) return 0;
    
    const monthlyExpenses = {};
    expenses.forEach(t => {
      const date = new Date(t.date);
      const monthYear = `${date.getFullYear()}-${date.getMonth()}`;
      if (!monthlyExpenses[monthYear]) {
        monthlyExpenses[monthYear] = { total: 0, count: 0 };
      }
      monthlyExpenses[monthYear].total += t.amount;
      monthlyExpenses[monthYear].count++;
    });
    
    const totals = Object.values(monthlyExpenses).map(m => m.total);
    return totals.reduce((sum, total) => sum + total, 0) / totals.length;
  }

  getTopExpenseCategory() {
    const transactions = this.transactionManager.getTransactions();
    const expenses = transactions.filter(t => t.type === 'expense');
    if (expenses.length === 0) return null;
    
    const categoryTotals = {};
    expenses.forEach(t => {
      if (!categoryTotals[t.category]) {
        categoryTotals[t.category] = 0;
      }
      categoryTotals[t.category] += t.amount;
    });
    
    let topCategory = null;
    let maxAmount = 0;
    Object.entries(categoryTotals).forEach(([category, amount]) => {
      if (amount > maxAmount) {
        maxAmount = amount;
        topCategory = category;
      }
    });
    
    return { category: topCategory, amount: maxAmount };
  }
}

// Export for both ES6 and CommonJS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StatisticsManager };
}