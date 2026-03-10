class TransactionManager {
  constructor(storage, categoryManager) {
    this.storage = storage;
    this.categoryManager = categoryManager;
    this.transactions = this.storage.getAllTransactions();
  }

  addTransaction(transactionData) {
    const transaction = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      date: transactionData.date || new Date().toISOString().split('T')[0],
      description: transactionData.description.trim(),
      amount: parseFloat(transactionData.amount),
      type: transactionData.type || 'expense',
      category: transactionData.category || this.categoryManager.categorizeTransaction(transactionData.description, transactionData.amount).id
    };

    this.transactions.push(transaction);
    this.storage.saveTransaction(transaction);
    this.notifyUpdate();
    return transaction;
  }

  deleteTransaction(id) {
    const index = this.transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      this.transactions.splice(index, 1);
      this.storage.deleteTransaction(id);
      this.notifyUpdate();
      return true;
    }
    return false;
  }

  updateTransaction(id, updates) {
    const index = this.transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      this.transactions[index] = { ...this.transactions[index], ...updates };
      this.storage.updateTransaction(this.transactions[index]);
      this.notifyUpdate();
      return this.transactions[index];
    }
    return null;
  }

  getTransactions() {
    return [...this.transactions];
  }

  getTransactionsByMonth(month, year) {
    return this.transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === month && date.getFullYear() === year;
    });
  }

  getTransactionsByCategory(category) {
    return this.transactions.filter(t => t.category === category);
  }

  getTransactionsByType(type) {
    return this.transactions.filter(t => t.type === type);
  }

  notifyUpdate() {
    window.dispatchEvent(new CustomEvent('transactionUpdated'));
  }
}

// Export for both ES6 and CommonJS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TransactionManager };
}