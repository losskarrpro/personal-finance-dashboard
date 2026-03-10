const { TransactionManager } = require('./transaction.js');
const { StorageManager } = require('./storage.js');
const { CategoryManager } = require('./category-manager.js');

describe('TransactionManager', () => {
  let storage;
  let categoryManager;
  let transactionManager;
  
  beforeEach(() => {
    storage = new StorageManager();
    categoryManager = new CategoryManager();
    transactionManager = new TransactionManager(storage, categoryManager);
  });
  
  test('should add a transaction', () => {
    const transaction = {
      description: 'Test transaction',
      amount: 100,
      type: 'expense',
      date: '2023-01-01'
    };
    
    transactionManager.addTransaction(transaction);
    const transactions = transactionManager.getTransactions();
    
    expect(transactions).toHaveLength(1);
    expect(transactions[0].description).toBe('Test transaction');
    expect(transactions[0].amount).toBe(100);
  });
  
  test('should delete a transaction', () => {
    const transaction = {
      description: 'Test transaction',
      amount: 100,
      type: 'expense',
      date: '2023-01-01'
    };
    
    const addedTransaction = transactionManager.addTransaction(transaction);
    transactionManager.deleteTransaction(addedTransaction.id);
    const transactions = transactionManager.getTransactions();
    
    expect(transactions).toHaveLength(0);
  });
  
  test('should filter transactions by month', () => {
    const transactions = [
      { description: 'Jan', amount: 100, type: 'expense', date: '2023-01-15' },
      { description: 'Feb', amount: 200, type: 'expense', date: '2023-02-15' },
      { description: 'Mar', amount: 300, type: 'expense', date: '2023-03-15' }
    ];
    
    transactions.forEach(t => transactionManager.addTransaction(t));
    const filtered = transactionManager.getTransactionsByMonth(2, 2023); // February
    
    expect(filtered).toHaveLength(1);
    expect(filtered[0].description).toBe('Feb');
  });
});