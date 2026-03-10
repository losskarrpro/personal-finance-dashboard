const STORAGE_KEYS = {
    TRANSACTIONS: 'personal_finance_transactions',
    GOALS: 'personal_finance_goals',
    SETTINGS: 'personal_finance_settings',
    CATEGORIES: 'personal_finance_categories'
};

class StorageManager {
    constructor() {
        this._loadDefaultCategories();
    }

    // Transactions
    getTransactions() {
        const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
        return data ? JSON.parse(data) : [];
    }

    saveTransactions(transactions) {
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    }

    addTransaction(transaction) {
        const transactions = this.getTransactions();
        transactions.push(transaction);
        this.saveTransactions(transactions);
        return transaction;
    }

    updateTransaction(id, updatedTransaction) {
        const transactions = this.getTransactions();
        const index = transactions.findIndex(t => t.id === id);
        if (index !== -1) {
            transactions[index] = { ...transactions[index], ...updatedTransaction };
            this.saveTransactions(transactions);
            return transactions[index];
        }
        return null;
    }

    deleteTransaction(id) {
        const transactions = this.getTransactions();
        const filtered = transactions.filter(t => t.id !== id);
        this.saveTransactions(filtered);
        return filtered.length !== transactions.length;
    }

    // Goals
    getGoals() {
        const data = localStorage.getItem(STORAGE_KEYS.GOALS);
        return data ? JSON.parse(data) : [];
    }

    saveGoals(goals) {
        localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
    }

    addGoal(goal) {
        const goals = this.getGoals();
        goals.push(goal);
        this.saveGoals(goals);
        return goal;
    }

    updateGoal(id, updatedGoal) {
        const goals = this.getGoals();
        const index = goals.findIndex(g => g.id === id);
        if (index !== -1) {
            goals[index] = { ...goals[index], ...updatedGoal };
            this.saveGoals(goals);
            return goals[index];
        }
        return null;
    }

    deleteGoal(id) {
        const goals = this.getGoals();
        const filtered = goals.filter(g => g.id !== id);
        this.saveGoals(filtered);
        return filtered.length !== goals.length;
    }

    // Settings
    getSettings() {
        const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        const defaultSettings = {
            currency: 'EUR',
            language: 'fr',
            theme: 'light',
            monthlyBudget: 0,
            notificationEnabled: true
        };
        return data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings;
    }

    saveSettings(settings) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    }

    updateSetting(key, value) {
        const settings = this.getSettings();
        settings[key] = value;
        this.saveSettings(settings);
        return settings;
    }

    // Categories
    getCategories() {
        const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
        if (data) {
            return JSON.parse(data);
        }
        return this._getDefaultCategories();
    }

    saveCategories(categories) {
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    }

    addCategory(category) {
        const categories = this.getCategories();
        categories.push(category);
        this.saveCategories(categories);
        return category;
    }

    updateCategory(id, updatedCategory) {
        const categories = this.getCategories();
        const index = categories.findIndex(c => c.id === id);
        if (index !== -1) {
            categories[index] = { ...categories[index], ...updatedCategory };
            this.saveCategories(categories);
            return categories[index];
        }
        return null;
    }

    deleteCategory(id) {
        const categories = this.getCategories();
        const filtered = categories.filter(c => c.id !== id);
        this.saveCategories(filtered);
        return filtered.length !== categories.length;
    }

    // Data Management
    exportData() {
        return {
            transactions: this.getTransactions(),
            goals: this.getGoals(),
            settings: this.getSettings(),
            categories: this.getCategories(),
            exportDate: new Date().toISOString()
        };
    }

    importData(data) {
        if (data.transactions) {
            this.saveTransactions(data.transactions);
        }
        if (data.goals) {
            this.saveGoals(data.goals);
        }
        if (data.settings) {
            this.saveSettings(data.settings);
        }
        if (data.categories) {
            this.saveCategories(data.categories);
        }
        return true;
    }

    clearAllData() {
        localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
        localStorage.removeItem(STORAGE_KEYS.GOALS);
        localStorage.removeItem(STORAGE_KEYS.SETTINGS);
        localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    }

    // Private methods
    _loadDefaultCategories() {
        const existing = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
        if (!existing) {
            const defaultCategories = this._getDefaultCategories();
            this.saveCategories(defaultCategories);
        }
    }

    _getDefaultCategories() {
        return [
            { id: 'cat_1', name: 'Alimentation', type: 'expense', color: '#FF6384', icon: 'shopping-cart' },
            { id: 'cat_2', name: 'Transport', type: 'expense', color: '#36A2EB', icon: 'car' },
            { id: 'cat_3', name: 'Logement', type: 'expense', color: '#FFCE56', icon: 'home' },
            { id: 'cat_4', name: 'Loisirs', type: 'expense', color: '#4BC0C0', icon: 'film' },
            { id: 'cat_5', name: 'Santé', type: 'expense', color: '#9966FF', icon: 'heart' },
            { id: 'cat_6', name: 'Éducation', type: 'expense', color: '#FF9F40', icon: 'book' },
            { id: 'cat_7', name: 'Shopping', type: 'expense', color: '#C9CBCF', icon: 'shopping-bag' },
            { id: 'cat_8', name: 'Salaire', type: 'income', color: '#2ECC71', icon: 'briefcase' },
            { id: 'cat_9', name: 'Investissement', type: 'income', color: '#3498DB', icon: 'trending-up' },
            { id: 'cat_10', name: 'Cadeau', type: 'income', color: '#9B59B6', icon: 'gift' },
            { id: 'cat_11', name: 'Autre revenu', type: 'income', color: '#1ABC9C', icon: 'dollar-sign' },
            { id: 'cat_12', name: 'Autre dépense', type: 'expense', color: '#95A5A6', icon: 'more-horizontal' }
        ];
    }
}

const storageManager = new StorageManager();