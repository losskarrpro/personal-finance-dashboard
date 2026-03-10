import { getTransactions, getCategories } from './storage.js';
import { formatCurrency, getCurrentMonthYear } from './utils.js';

class ChartManager {
    constructor() {
        this.charts = {};
        this.init();
    }

    init() {
        this.renderCharts();
        this.setupEventListeners();
    }

    setupEventListeners() {
        window.addEventListener('transactionUpdated', () => this.renderCharts());
        window.addEventListener('categoryUpdated', () => this.renderCharts());
        window.addEventListener('goalUpdated', () => this.updateGoalProgressChart());
    }

    renderCharts() {
        this.renderMonthlyBalanceChart();
        this.renderExpenseByCategoryChart();
        this.renderIncomeVsExpenseChart();
        this.renderGoalProgressChart();
    }

    getMonthlyData() {
        const transactions = getTransactions();
        const monthlyData = {};
        
        transactions.forEach(transaction => {
            const date = new Date(transaction.date);
            const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            if (!monthlyData[monthYear]) {
                monthlyData[monthYear] = {
                    income: 0,
                    expense: 0,
                    balance: 0
                };
            }
            
            if (transaction.type === 'income') {
                monthlyData[monthYear].income += transaction.amount;
                monthlyData[monthYear].balance += transaction.amount;
            } else {
                monthlyData[monthYear].expense += transaction.amount;
                monthlyData[monthYear].balance -= transaction.amount;
            }
        });

        const sortedMonths = Object.keys(monthlyData).sort();
        const last6Months = sortedMonths.slice(-6);

        return {
            labels: last6Months.map(month => {
                const [year, monthNum] = month.split('-');
                return new Date(year, monthNum - 1).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
            }),
            income: last6Months.map(month => monthlyData[month]?.income || 0),
            expense: last6Months.map(month => monthlyData[month]?.expense || 0),
            balance: last6Months.map(month => monthlyData[month]?.balance || 0)
        };
    }

    renderMonthlyBalanceChart() {
        const ctx = document.getElementById('monthlyBalanceChart');
        if (!ctx) return;

        if (this.charts.monthlyBalance) {
            this.charts.monthlyBalance.destroy();
        }

        const data = this.getMonthlyData();

        this.charts.monthlyBalance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Solde',
                        data: data.balance,
                        borderColor: '#4CAF50',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Revenus',
                        data: data.income,
                        borderColor: '#2196F3',
                        backgroundColor: 'rgba(33, 150, 243, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4
                    },
                    {
                        label: 'Dépenses',
                        data: data.expense,
                        borderColor: '#F44336',
                        backgroundColor: 'rgba(244, 67, 54, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `${context.dataset.label}: ${formatCurrency(context.raw)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => formatCurrency(value)
                        }
                    }
                }
            }
        });
    }

    getExpenseByCategoryData() {
        const transactions = getTransactions();
        const categories = getCategories();
        const categoryTotals = {};
        
        transactions.forEach(transaction => {
            if (transaction.type === 'expense') {
                const category = categories.find(cat => cat.id === transaction.categoryId);
                const categoryName = category ? category.name : 'Non catégorisé';
                
                if (!categoryTotals[categoryName]) {
                    categoryTotals[categoryName] = 0;
                }
                categoryTotals[categoryName] += transaction.amount;
            }
        });

        const sortedCategories = Object.entries(categoryTotals)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 8);

        return {
            labels: sortedCategories.map(([name]) => name),
            data: sortedCategories.map(([, total]) => total)
        };
    }

    renderExpenseByCategoryChart() {
        const ctx = document.getElementById('expenseByCategoryChart');
        if (!ctx) return;

        if (this.charts.expenseByCategory) {
            this.charts.expenseByCategory.destroy();
        }

        const data = this.getExpenseByCategoryData();
        const backgroundColors = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
            '#9966FF', '#FF9F40', '#8AC926', '#1982C4'
        ];

        this.charts.expenseByCategory = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.data,
                    backgroundColor: backgroundColors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((context.raw / total) * 100);
                                return `${context.label}: ${formatCurrency(context.raw)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    getIncomeVsExpenseData() {
        const transactions = getTransactions();
        const currentMonth = getCurrentMonthYear();
        const [currentYear, currentMonthNum] = currentMonth.split('-');
        
        const monthlyData = {};
        
        transactions.forEach(transaction => {
            const date = new Date(transaction.date);
            const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            if (!monthlyData[monthYear]) {
                monthlyData[monthYear] = { income: 0, expense: 0 };
            }
            
            if (transaction.type === 'income') {
                monthlyData[monthYear].income += transaction.amount;
            } else {
                monthlyData[monthYear].expense += transaction.amount;
            }
        });

        const sortedMonths = Object.keys(monthlyData).sort();
        const last12Months = sortedMonths.slice(-12);

        return {
            labels: last12Months.map(month => {
                const [year, monthNum] = month.split('-');
                return new Date(year, monthNum - 1).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
            }),
            income: last12Months.map(month => monthlyData[month]?.income || 0),
            expense: last12Months.map(month => monthlyData[month]?.expense || 0)
        };
    }

    renderIncomeVsExpenseChart() {
        const ctx = document.getElementById('incomeVsExpenseChart');
        if (!ctx) return;

        if (this.charts.incomeVsExpense) {
            this.charts.incomeVsExpense.destroy();
        }

        const data = this.getIncomeVsExpenseData();

        this.charts.incomeVsExpense = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Revenus',
                        data: data.income,
                        backgroundColor: 'rgba(33, 150, 243, 0.7)',
                        borderColor: '#2196F3',
                        borderWidth: 1
                    },
                    {
                        label: 'Dépenses',
                        data: data.expense,
                        backgroundColor: 'rgba(244, 67, 54, 0.7)',
                        borderColor: '#F44336',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `${context.dataset.label}: ${formatCurrency(context.raw)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => formatCurrency(value)
                        }
                    }
                }
            }
        });
    }

    updateGoalProgressChart() {
        const goals = JSON.parse(localStorage.getItem('financeGoals') || '[]');
        const goalProgressElement = document.getElementById('goalProgressChart');
        
        if (!goalProgressElement || goals.length === 0) {
            const container = document.querySelector('.goal-progress-container');
            if (container) {
                container.innerHTML = '<p class="no-data">Aucun objectif défini</p>';
            }
            return;
        }

        const goal = goals[0];
        const transactions = getTransactions();
        const currentMonth = getCurrentMonthYear();
        
        const monthlyIncome = transactions
            .filter(t => t.type === 'income' && 
                new Date(t.date).toISOString().slice(0, 7) === currentMonth)
            .reduce((sum, t) => sum + t.amount, 0);
        
        const progress = Math.min((monthlyIncome / goal.targetAmount) * 100, 100);
        
        goalProgressElement.innerHTML = `
            <div class="goal-info">
                <h4>${goal.name}</h4>
                <p>Objectif: ${formatCurrency(goal.targetAmount)}</p>
                <p>Progression: ${formatCurrency(monthlyIncome)} / ${formatCurrency(goal.targetAmount)}</p>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
            <div class="progress-text">${progress.toFixed(1)}%</div>
        `;
    }

    renderGoalProgressChart() {
        this.updateGoalProgressChart();
    }

    destroyAllCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        this.charts = {};
    }
}

export default ChartManager;