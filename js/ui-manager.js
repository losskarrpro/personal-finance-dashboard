import { TransactionManager } from './transaction.js';
import { CategoryManager } from './category-manager.js';
import { ChartManager } from './chart-manager.js';
import { Statistics } from './statistics.js';
import { GoalsManager } from './goals-manager.js';
import { ExportManager } from './export-manager.js';
import { Storage } from './storage.js';

class UIManager {
    constructor() {
        this.transactionManager = new TransactionManager();
        this.categoryManager = new CategoryManager();
        this.chartManager = new ChartManager();
        this.statistics = new Statistics();
        this.goalsManager = new GoalsManager();
        this.exportManager = new ExportManager();
        this.storage = new Storage();

        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();

        this.initElements();
        this.bindEvents();
        this.loadInitialData();
    }

    initElements() {
        this.transactionForm = document.getElementById('transaction-form');
        this.transactionType = document.getElementById('transaction-type');
        this.transactionAmount = document.getElementById('transaction-amount');
        this.transactionDescription = document.getElementById('transaction-description');
        this.transactionCategory = document.getElementById('transaction-category');
        this.transactionDate = document.getElementById('transaction-date');
        this.transactionsList = document.getElementById('transactions-list');
        this.totalIncome = document.getElementById('total-income');
        this.totalExpenses = document.getElementById('total-expenses');
        this.balance = document.getElementById('balance');
        this.monthSelect = document.getElementById('month-select');
        this.yearSelect = document.getElementById('year-select');
        this.addGoalBtn = document.getElementById('add-goal-btn');
        this.goalForm = document.getElementById('goal-form');
        this.goalName = document.getElementById('goal-name');
        this.goalTarget = document.getElementById('goal-target');
        this.goalDeadline = document.getElementById('goal-deadline');
        this.goalsList = document.getElementById('goals-list');
        this.exportBtn = document.getElementById('export-btn');
        this.filterCategory = document.getElementById('filter-category');
        this.filterType = document.getElementById('filter-type');
        this.applyFiltersBtn = document.getElementById('apply-filters');
        this.resetFiltersBtn = document.getElementById('reset-filters');
        this.modal = document.getElementById('transaction-modal');
        this.closeModal = document.querySelector('.close-modal');
        this.openModalBtn = document.getElementById('open-modal-btn');
        this.editTransactionId = null;
    }

    bindEvents() {
        this.transactionForm.addEventListener('submit', (e) => this.handleTransactionSubmit(e));
        this.monthSelect.addEventListener('change', () => this.updateDashboard());
        this.yearSelect.addEventListener('change', () => this.updateDashboard());
        this.addGoalBtn.addEventListener('click', () => this.toggleGoalForm());
        this.goalForm.addEventListener('submit', (e) => this.handleGoalSubmit(e));
        this.exportBtn.addEventListener('click', () => this.handleExport());
        this.applyFiltersBtn.addEventListener('click', () => this.applyFilters());
        this.resetFiltersBtn.addEventListener('click', () => this.resetFilters());
        this.openModalBtn.addEventListener('click', () => this.openModal());
        this.closeModal.addEventListener('click', () => this.closeTransactionModal());
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeTransactionModal();
            }
        });

        this.transactionType.addEventListener('change', () => this.updateCategoryOptions());
    }

    loadInitialData() {
        this.populateMonthYearSelectors();
        this.populateCategoryOptions();
        this.populateFilterCategories();
        this.updateDashboard();
        this.loadGoals();
    }

    populateMonthYearSelectors() {
        const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        months.forEach((month, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = month;
            if (index === this.currentMonth) option.selected = true;
            this.monthSelect.appendChild(option);
        });

        const currentYear = new Date().getFullYear();
        for (let year = currentYear - 5; year <= currentYear + 5; year++) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            if (year === this.currentYear) option.selected = true;
            this.yearSelect.appendChild(option);
        }
    }

    populateCategoryOptions() {
        this.transactionCategory.innerHTML = '';
        const categories = this.categoryManager.getCategories();
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            this.transactionCategory.appendChild(option);
        });
        this.updateCategoryOptions();
    }

    updateCategoryOptions() {
        const type = this.transactionType.value;
        const categories = this.categoryManager.getCategoriesByType(type);
        this.transactionCategory.innerHTML = '';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            this.transactionCategory.appendChild(option);
        });
    }

    populateFilterCategories() {
        this.filterCategory.innerHTML = '<option value="all">Toutes catégories</option>';
        const categories = this.categoryManager.getCategories();
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            this.filterCategory.appendChild(option);
        });
    }

    async handleTransactionSubmit(e) {
        e.preventDefault();
        const type = this.transactionType.value;
        const amount = parseFloat(this.transactionAmount.value);
        const description = this.transactionDescription.value.trim();
        const categoryId = this.transactionCategory.value;
        const date = this.transactionDate.value;

        if (!description || isNaN(amount) || amount <= 0) {
            this.showAlert('Veuillez remplir tous les champs correctement.', 'error');
            return;
        }

        const transactionData = {
            type,
            amount,
            description,
            categoryId,
            date
        };

        if (this.editTransactionId) {
            await this.transactionManager.updateTransaction(this.editTransactionId, transactionData);
            this.editTransactionId = null;
            this.showAlert('Transaction mise à jour avec succès!', 'success');
        } else {
            await this.transactionManager.addTransaction(transactionData);
            this.showAlert('Transaction ajoutée avec succès!', 'success');
        }

        this.transactionForm.reset();
        this.transactionDate.value = new Date().toISOString().split('T')[0];
        this.closeTransactionModal();
        this.updateDashboard();
    }

    openModal(transaction = null) {
        this.modal.style.display = 'block';
        if (transaction) {
            this.editTransactionId = transaction.id;
            this.transactionType.value = transaction.type;
            this.transactionAmount.value = transaction.amount;
            this.transactionDescription.value = transaction.description;
            this.transactionCategory.value = transaction.categoryId;
            this.transactionDate.value = transaction.date.split('T')[0];
            document.querySelector('#transaction-form button[type="submit"]').textContent = 'Mettre à jour';
        } else {
            this.editTransactionId = null;
            this.transactionForm.reset();
            this.transactionDate.value = new Date().toISOString().split('T')[0];
            document.querySelector('#transaction-form button[type="submit"]').textContent = 'Ajouter';
        }
        this.updateCategoryOptions();
    }

    closeTransactionModal() {
        this.modal.style.display = 'none';
        this.editTransactionId = null;
        this.transactionForm.reset();
        this.transactionDate.value = new Date().toISOString().split('T')[0];
        document.querySelector('#transaction-form button[type="submit"]').textContent = 'Ajouter';
    }

    renderTransactions(transactions) {
        this.transactionsList.innerHTML = '';
        if (transactions.length === 0) {
            this.transactionsList.innerHTML = '<tr><td colspan="6" class="no-data">Aucune transaction trouvée.</td></tr>';
            return;
        }

        transactions.forEach(transaction => {
            const row = document.createElement('tr');
            const category = this.categoryManager.getCategoryById(transaction.categoryId);
            const typeClass = transaction.type === 'income' ? 'income' : 'expense';
            const typeText = transaction.type === 'income' ? 'Revenu' : 'Dépense';
            const amountFormatted = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(transaction.amount);

            row.innerHTML = `
                <td>${new Date(transaction.date).toLocaleDateString('fr-FR')}</td>
                <td>${transaction.description}</td>
                <td><span class="category-badge" style="background-color: ${category.color}">${category.name}</span></td>
                <td><span class="transaction-type ${typeClass}">${typeText}</span></td>
                <td class="amount ${typeClass}">${amountFormatted}</td>
                <td class="actions">
                    <button class="btn-edit" data-id="${transaction.id}">✏️</button>
                    <button class="btn-delete" data-id="${transaction.id}">🗑️</button>
                </td>
            `;

            this.transactionsList.appendChild(row);
        });

        this.attachTransactionActions();
    }

    attachTransactionActions() {
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const transaction = this.transactionManager.getTransactionById(id);
                if (transaction) this.openModal(transaction);
            });
        });

        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.getAttribute('data-id');
                if (confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
                    await this.transactionManager.deleteTransaction(id);
                    this.showAlert('Transaction supprimée avec succès!', 'success');
                    this.updateDashboard();
                }
            });
        });
    }

    updateDashboard() {
        const month = parseInt(this.monthSelect.value);
        const year = parseInt(this.yearSelect.value);
        const transactions = this.transactionManager.getTransactionsByMonth(month, year);

        this.renderTransactions(transactions);

        const stats = this.statistics.calculateMonthlyStats(transactions);
        this.totalIncome.textContent = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(stats.totalIncome);
        this.totalExpenses.textContent = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(stats.totalExpenses);
        this.balance.textContent = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(stats.balance);

        this.chartManager.renderCharts(transactions, month, year);
    }

    applyFilters() {
        const categoryId = this.filterCategory.value;
        const type = this.filterType.value;
        const month = parseInt(this.monthSelect.value);
        const year = parseInt(this.yearSelect.value);

        let transactions = this.transactionManager.getTransactionsByMonth(month, year);

        if (categoryId !== 'all') {
            transactions = transactions.filter(t => t.categoryId === categoryId);
        }

        if (type !== 'all') {
            transactions = transactions.filter(t => t.type === type);
        }

        this.renderTransactions(transactions);
    }

    resetFilters() {
        this.filterCategory.value = 'all';
        this.filterType.value = 'all';
        this.updateDashboard();
    }

    toggleGoalForm() {
        const form = document.getElementById('goal-form-container');
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    }

    async handleGoalSubmit(e) {
        e.preventDefault();
        const name = this.goalName.value.trim();
        const target = parseFloat(this.goalTarget.value);
        const deadline = this.goalDeadline.value;

        if (!name || isNaN(target) || target <= 0 || !deadline) {
            this.showAlert('Veuillez remplir tous les champs correctement.', 'error');
            return;
        }

        const goal = {
            name,
            target,
            deadline,
            current: 0,
            createdAt: new Date().toISOString()
        };

        await this.goalsManager.addGoal(goal);
        this.showAlert('Objectif ajouté avec succès!', 'success');
        this.goalForm.reset();
        this.toggleGoalForm();
        this.loadGoals();
    }

    async loadGoals() {
        const goals = await this.goalsManager.getGoals();
        this.goalsList.innerHTML = '';

        if (goals.length === 0) {
            this.goalsList.innerHTML = '<div class="no-goals">Aucun objectif défini.</div>';
            return;
        }

        goals.forEach(goal => {
            const progress = (goal.current / goal.target) * 100;
            const progressBarClass = progress >= 100 ? 'progress-bar success' : 'progress-bar';
            const goalElement = document.createElement('div');
            goalElement.className = 'goal-item';
            goalElement.innerHTML = `
                <div class="goal-header">
                    <h4>${goal.name}</h4>
                    <div class="goal-actions">
                        <button class="btn-edit-goal" data-id="${goal.id}">✏️</button>
                        <button class="btn-delete-goal" data-id="${goal.id}">🗑️</button>
                    </div>
                </div>
                <div class="goal-details">
                    <span>Objectif: ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(goal.target)}</span>
                    <span>Épargné: ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(goal.current)}</span>
                    <span>Date limite: ${new Date(goal.deadline).toLocaleDateString('fr-FR')}</span>
                </div>
                <div class="progress-container">
                    <div class="${progressBarClass}" style="width: ${Math.min(progress, 100)}%"></div>
                </div>
                <div class="goal-progress-text">${progress.toFixed(1)}%</div>
            `;
            this.goalsList.appendChild(goalElement);
        });

        this.attachGoalActions();
    }

    attachGoalActions() {
        document.querySelectorAll('.btn-edit-goal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                this.editGoal(id);
            });
        });

        document.querySelectorAll('.btn-delete-goal').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.getAttribute('data-id');
                if (confirm('Êtes-vous sûr de vouloir supprimer cet objectif ?')) {
                    await this.goalsManager.deleteGoal(id);
                    this.showAlert('Objectif supprimé avec succès!', 'success');
                    this.loadGoals();
                }
            });
        });
    }

    async editGoal(id) {
        const goal = await this.goalsManager.getGoalById(id);
        if (!goal) return;

        const newAmount = prompt(`Montant actuel pour "${goal.name}" (objectif: ${goal.target}€):`, goal.current);
        if (newAmount !== null) {
            const amount = parseFloat(newAmount);
            if (!isNaN(amount) && amount >= 0) {
                goal.current = amount;
                await this.goalsManager.updateGoal(id, goal);
                this.showAlert('Objectif mis à jour!', 'success');
                this.loadGoals();
            } else {
                this.showAlert('Veuillez entrer un montant valide.', 'error');
            }
        }
    }

    async handleExport() {
        const month = parseInt(this.monthSelect.value);
        const year = parseInt(this.yearSelect.value);
        const transactions = this.transactionManager.getTransactionsByMonth(month, year);
        const goals = await this.goalsManager.getGoals();
        const data = { transactions, goals, month, year };
        this.exportManager.exportToJSON(data);
        this.showAlert('Données exportées avec succès!', 'success');
    }

    showAlert(message, type) {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        document.body.appendChild(alert);

        setTimeout(() => {
            alert.remove();
        }, 3000);
    }
}

export { UIManager };