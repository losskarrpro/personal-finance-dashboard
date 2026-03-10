class GoalsManager {
    constructor(storageKey = 'financeGoals') {
        this.storageKey = storageKey;
        this.goals = this.loadGoals();
        this.currentGoalId = null;
    }

    loadGoals() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
    }

    saveGoals() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.goals));
    }

    addGoal(name, targetAmount, targetDate, category = 'General') {
        const goal = {
            id: Date.now().toString(),
            name,
            targetAmount: parseFloat(targetAmount),
            currentAmount: 0,
            targetDate: new Date(targetDate).toISOString().split('T')[0],
            category,
            createdAt: new Date().toISOString(),
            completed: false
        };

        this.goals.push(goal);
        this.saveGoals();
        return goal;
    }

    updateGoal(id, updates) {
        const goalIndex = this.goals.findIndex(g => g.id === id);
        if (goalIndex === -1) return null;

        const goal = this.goals[goalIndex];
        Object.assign(goal, updates);

        if (goal.currentAmount >= goal.targetAmount && !goal.completed) {
            goal.completed = true;
            goal.completedAt = new Date().toISOString();
        } else if (goal.currentAmount < goal.targetAmount && goal.completed) {
            goal.completed = false;
            delete goal.completedAt;
        }

        this.goals[goalIndex] = goal;
        this.saveGoals();
        return goal;
    }

    deleteGoal(id) {
        const initialLength = this.goals.length;
        this.goals = this.goals.filter(g => g.id !== id);
        this.saveGoals();
        return this.goals.length !== initialLength;
    }

    getGoal(id) {
        return this.goals.find(g => g.id === id) || null;
    }

    getAllGoals() {
        return this.goals;
    }

    getActiveGoals() {
        return this.goals.filter(g => !g.completed);
    }

    getCompletedGoals() {
        return this.goals.filter(g => g.completed);
    }

    addToGoal(id, amount) {
        const goal = this.getGoal(id);
        if (!goal) return null;

        const newAmount = goal.currentAmount + parseFloat(amount);
        return this.updateGoal(id, { currentAmount: newAmount });
    }

    withdrawFromGoal(id, amount) {
        const goal = this.getGoal(id);
        if (!goal) return null;

        const newAmount = Math.max(0, goal.currentAmount - parseFloat(amount));
        return this.updateGoal(id, { currentAmount: newAmount });
    }

    calculateProgress(goal) {
        if (goal.targetAmount <= 0) return 0;
        return Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
    }

    getDaysRemaining(goal) {
        const today = new Date();
        const targetDate = new Date(goal.targetDate);
        const diffTime = targetDate - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    getGoalsByCategory(category) {
        return this.goals.filter(g => g.category === category);
    }

    getTotalTargetAmount() {
        return this.goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    }

    getTotalCurrentAmount() {
        return this.goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
    }

    getTotalProgress() {
        const totalTarget = this.getTotalTargetAmount();
        if (totalTarget <= 0) return 0;
        return (this.getTotalCurrentAmount() / totalTarget) * 100;
    }

    resetGoal(id) {
        return this.updateGoal(id, { currentAmount: 0, completed: false });
    }

    setCurrentGoal(id) {
        this.currentGoalId = id;
    }

    getCurrentGoal() {
        return this.currentGoalId ? this.getGoal(this.currentGoalId) : null;
    }

    clearCurrentGoal() {
        this.currentGoalId = null;
    }

    exportGoals(format = 'json') {
        switch (format.toLowerCase()) {
            case 'json':
                return JSON.stringify(this.goals, null, 2);
            case 'csv':
                const headers = ['ID', 'Name', 'Target Amount', 'Current Amount', 'Progress', 'Target Date', 'Category', 'Created', 'Completed'];
                const rows = this.goals.map(goal => [
                    goal.id,
                    goal.name,
                    goal.targetAmount,
                    goal.currentAmount,
                    this.calculateProgress(goal),
                    goal.targetDate,
                    goal.category,
                    goal.createdAt,
                    goal.completed
                ]);
                const csvContent = [
                    headers.join(','),
                    ...rows.map(row => row.join(','))
                ].join('\n');
                return csvContent;
            default:
                return null;
        }
    }

    importGoals(data, format = 'json') {
        try {
            let importedGoals;
            if (format.toLowerCase() === 'json') {
                importedGoals = JSON.parse(data);
            } else if (format.toLowerCase() === 'csv') {
                const lines = data.split('\n');
                const headers = lines[0].split(',');
                importedGoals = lines.slice(1).map(line => {
                    const values = line.split(',');
                    const goal = {};
                    headers.forEach((header, index) => {
                        goal[header.toLowerCase().replace(' ', '')] = values[index];
                    });
                    return goal;
                });
            } else {
                return false;
            }

            if (Array.isArray(importedGoals)) {
                importedGoals.forEach(goal => {
                    if (!goal.id) goal.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
                    if (!goal.createdAt) goal.createdAt = new Date().toISOString();
                    if (goal.completed === 'true') goal.completed = true;
                    if (goal.completed === 'false') goal.completed = false;
                    goal.targetAmount = parseFloat(goal.targetAmount);
                    goal.currentAmount = parseFloat(goal.currentAmount) || 0;
                });

                this.goals = [...this.goals, ...importedGoals];
                this.saveGoals();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error importing goals:', error);
            return false;
        }
    }

    clearAllGoals() {
        this.goals = [];
        this.saveGoals();
    }

    getUpcomingDeadlines(days = 30) {
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + days);

        return this.getActiveGoals().filter(goal => {
            const goalDate = new Date(goal.targetDate);
            return goalDate >= today && goalDate <= futureDate;
        }).sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate));
    }

    getGoalsSummary() {
        const totalGoals = this.goals.length;
        const completedGoals = this.getCompletedGoals().length;
        const activeGoals = totalGoals - completedGoals;
        const totalTarget = this.getTotalTargetAmount();
        const totalCurrent = this.getTotalCurrentAmount();
        const totalProgress = this.getTotalProgress();

        return {
            totalGoals,
            completedGoals,
            activeGoals,
            totalTarget,
            totalCurrent,
            totalProgress,
            completionRate: totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0
        };
    }
}