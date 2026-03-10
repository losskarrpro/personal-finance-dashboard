import { StorageManager } from './storage.js';
import { TransactionManager } from './transaction.js';
import { CategoryManager } from './category-manager.js';
import { UIManager } from './ui-manager.js';
import { ChartManager } from './chart-manager.js';
import { StatisticsManager } from './statistics.js';
import { GoalsManager } from './goals-manager.js';
import { ExportManager } from './export-manager.js';
import { formatCurrency, formatDate } from './utils.js';

class PersonalFinanceDashboard {
    constructor() {
        this.storage = new StorageManager();
        this.categoryManager = new CategoryManager();
        this.transactionManager = new TransactionManager(this.storage, this.categoryManager);
        this.uiManager = new UIManager(this.transactionManager, this.categoryManager);
        this.chartManager = new ChartManager(this.transactionManager);
        this.statisticsManager = new StatisticsManager(this.transactionManager);
        this.goalsManager = new GoalsManager(this.storage, this.transactionManager);
        this.exportManager = new ExportManager(this.transactionManager);
        
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
        
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.loadCategories();
            this.setupEventListeners();
            this.loadInitialData();
            this.updateDashboard();
        });
    }

    loadCategories() {
        this.categoryManager.loadCategories()
            .then(() => {
                console.log('Categories loaded successfully');
            })
            .catch(error => {
                console.error('Error loading categories:', error);
            });
    }

    setupEventListeners() {
        this.setupTransactionFormListeners();
        this.setupFilterListeners();
        this.setupNavigationListeners();
        this.setupGoalListeners();
        this.setupExportListeners();
        this.setupThemeListener();
    }

    setupTransactionFormListeners() {
        const form = document.getElementById('transaction-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleTransactionSubmit(e));
        }

        const cancelBtn = document.getElementById('cancel-transaction');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.uiManager.hideTransactionForm());
        }

        const showFormBtn = document.getElementById('show-transaction-form');
        if (showFormBtn) {
            showFormBtn.addEventListener('click', () => this.uiManager.showTransactionForm());
        }
    }

    setupFilterListeners() {
        const monthFilter = document.getElementById('month-filter');
        const yearFilter = document.getElementById('year-filter');
        const categoryFilter = document.getElementById('category-filter');
        const typeFilter = document.getElementById('type-filter');

        if (monthFilter) {
            monthFilter.addEventListener('change', () => this.updateDashboard());
        }

        if (yearFilter) {
            yearFilter.addEventListener('change', () => this.updateDashboard());
        }

        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.updateDashboard());
        }

        if (typeFilter) {
            typeFilter.addEventListener('change', () => this.updateDashboard());
        }
    }

    setupNavigationListeners() {
        const prevMonthBtn = document.getElementById('prev-month');
        const nextMonthBtn = document.getElementById('next-month');
        const currentMonthBtn = document.getElementById('current-month');

        if (prevMonthBtn) {
            prevMonthBtn.addEventListener('click', () => this.navigateMonth(-1));
        }

        if (nextMonthBtn) {
            nextMonthBtn.addEventListener('click', () => this.navigateMonth(1));
        }

        if (currentMonthBtn) {
            currentMonthBtn.addEventListener('click', () => this.goToCurrentMonth());
        }
    }

    setupGoalListeners() {
        const goalForm = document.getElementById('goal-form');
        if (goalForm) {
            goalForm.addEventListener('submit', (e) => this.handleGoalSubmit(e));
        }

        const showGoalFormBtn = document.getElementById('show-goal-form');
        if (showGoalFormBtn) {
            showGoalFormBtn.addEventListener('click', () => this.uiManager.showGoalForm());
        }

        const cancelGoalBtn = document.getElementById('cancel-goal');
        if (cancelGoalBtn) {
            cancelGoalBtn.addEventListener('click', () => this.uiManager.hideGoalForm());
        }
    }

    setupExportListeners() {
        const exportBtn = document.getElementById('export-data');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportManager.exportToCSV());
        }

        const importBtn = document.getElementById('import-data');
        if (importBtn) {
            importBtn.addEventListener('change', (e) => this.handleImport(e));
        }
    }

    setupThemeListener() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    handleTransactionSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const transactionData = {
            description: formData.get('description'),
            amount: parseFloat(formData.get('amount')),
            type: formData.get('type'),
            category: formData.get('category'),
            date: formData.get('date') || new Date().toISOString().split('T')[0],
            notes: formData.get('notes') || ''
        };

        const transaction = this.transactionManager.addTransaction(transactionData);
        
        if (transaction) {
            this.uiManager.hideTransactionForm();
            e.target.reset();
            this.updateDashboard();
            this.uiManager.showNotification('Transaction added successfully!', 'success');
        } else {
            this.uiManager.showNotification('Error adding transaction', 'error');
        }
    }

    handleGoalSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const goalData = {
            name: formData.get('goal-name'),
            targetAmount: parseFloat(formData.get('target-amount')),
            currentAmount: parseFloat(formData.get('current-amount') || 0),
            deadline: formData.get('deadline'),
            category: formData.get('goal-category')
        };

        const goal = this.goalsManager.addGoal(goalData);
        
        if (goal) {
            this.uiManager.hideGoalForm();
            e.target.reset();
            this.updateGoals();
            this.uiManager.showNotification('Goal added successfully!', 'success');
        } else {
            this.uiManager.showNotification('Error adding goal', 'error');
        }
    }

    async handleImport(e) {
        const file = e.target.files[0];
        if (!file) return;

        try {
            await this.exportManager.importFromCSV(file);
            this.updateDashboard();
            this.uiManager.showNotification('Data imported successfully!', 'success');
        } catch (error) {
            this.uiManager.showNotification('Error importing data: ' + error.message, 'error');
        }
        
        e.target.value = '';
    }

    navigateMonth(delta) {
        this.currentMonth += delta;
        
        if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        } else if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        }
        
        this.updateDashboard();
        this.updateMonthDisplay();
    }

    goToCurrentMonth() {
        const now = new Date();
        this.currentMonth = now.getMonth();
        this.currentYear = now.getFullYear();
        this.updateDashboard();
        this.updateMonthDisplay();
    }

    updateMonthDisplay() {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                          'July', 'August', 'September', 'October', 'November', 'December'];
        const monthDisplay = document.getElementById('current-month-display');
        if (monthDisplay) {
            monthDisplay.textContent = `${monthNames[this.currentMonth]} ${this.currentYear}`;
        }
    }

    loadInitialData() {
        this.updateMonthDisplay();
        this.updateCategoryFilters();
        this.updateGoals();
    }

    updateDashboard() {
        const filters = this.getCurrentFilters();
        const transactions = this.transactionManager.getTransactions(filters);
        
        this.uiManager.renderTransactionList(transactions);
        this.chartManager.updateCharts(transactions, filters);
        this.updateStatistics(transactions);
        this.updateCategoryFilters();
    }

    updateStatistics(transactions) {
        const stats = this.statisticsManager.calculateStatistics(transactions);
        this.uiManager.updateStatisticsDisplay(stats);
    }

    updateGoals() {
        const goals = this.goalsManager.getGoals();
        this.uiManager.renderGoalsList(goals);
        this.uiManager.updateGoalsProgress(goals);
    }

    updateCategoryFilters() {
        const categories = this.categoryManager.getCategories();
        this.uiManager.updateCategoryFilters(categories);
    }

    getCurrentFilters() {
        const monthFilter = document.getElementById('month-filter');
        const yearFilter = document.getElementById('year-filter');
        const categoryFilter = document.getElementById('category-filter');
        const typeFilter = document.getElementById('type-filter');

        return {
            month: monthFilter ? parseInt(monthFilter.value) - 1 : this.currentMonth,
            year: yearFilter ? parseInt(yearFilter.value) : this.currentYear,
            category: categoryFilter ? categoryFilter.value : 'all',
            type: typeFilter ? typeFilter.value : 'all'
        };
    }

    toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        this.storage.saveSetting('theme', newTheme);
        
        const themeIcon = document.getElementById('theme-icon');
        if (themeIcon) {
            themeIcon.textContent = newTheme === 'dark' ? '🌙' : '☀️';
        }
    }

    loadTheme() {
        const savedTheme = this.storage.getSetting('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        const themeIcon = document.getElementById('theme-icon');
        if (themeIcon) {
            themeIcon.textContent = savedTheme === 'dark' ? '🌙' : '☀️';
        }
    }
}

const app = new PersonalFinanceDashboard();