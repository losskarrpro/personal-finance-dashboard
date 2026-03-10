class ExportManager {
    constructor(storage) {
        this.storage = storage;
    }

    exportToCSV() {
        const transactions = this.storage.getAllTransactions();
        if (transactions.length === 0) {
            alert('Aucune transaction à exporter.');
            return;
        }

        const headers = ['ID', 'Date', 'Description', 'Montant', 'Catégorie', 'Type'];
        const csvRows = [headers.join(',')];

        transactions.forEach(transaction => {
            const row = [
                transaction.id,
                transaction.date,
                `"${transaction.description.replace(/"/g, '""')}"`,
                transaction.amount,
                transaction.category,
                transaction.type
            ];
            csvRows.push(row.join(','));
        });

        const csvContent = csvRows.join('\n');
        this.downloadFile(csvContent, 'transactions.csv', 'text/csv');
    }

    exportToJSON() {
        const transactions = this.storage.getAllTransactions();
        if (transactions.length === 0) {
            alert('Aucune transaction à exporter.');
            return;
        }

        const data = {
            exportedAt: new Date().toISOString(),
            transactionCount: transactions.length,
            transactions: transactions
        };

        const jsonContent = JSON.stringify(data, null, 2);
        this.downloadFile(jsonContent, 'transactions.json', 'application/json');
    }

    exportStatisticsToCSV() {
        const stats = this.storage.getStatistics();
        if (!stats || Object.keys(stats).length === 0) {
            alert('Aucune statistique à exporter.');
            return;
        }

        const headers = ['Métrique', 'Valeur'];
        const csvRows = [headers.join(',')];

        Object.entries(stats).forEach(([key, value]) => {
            const row = [
                key,
                typeof value === 'object' ? JSON.stringify(value) : value
            ];
            csvRows.push(row.join(','));
        });

        const csvContent = csvRows.join('\n');
        this.downloadFile(csvContent, 'statistiques.csv', 'text/csv');
    }

    exportGoalsToJSON() {
        const goals = this.storage.getGoals();
        if (!goals || goals.length === 0) {
            alert('Aucun objectif à exporter.');
            return;
        }

        const data = {
            exportedAt: new Date().toISOString(),
            goals: goals
        };

        const jsonContent = JSON.stringify(data, null, 2);
        this.downloadFile(jsonContent, 'objectifs.json', 'application/json');
    }

    downloadFile(content, fileName, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    exportAllData() {
        const allData = {
            exportedAt: new Date().toISOString(),
            transactions: this.storage.getAllTransactions(),
            goals: this.storage.getGoals(),
            statistics: this.storage.getStatistics(),
            categories: this.storage.getCategories()
        };

        const jsonContent = JSON.stringify(allData, null, 2);
        this.downloadFile(jsonContent, 'personal-finance-dashboard-backup.json', 'application/json');
    }
}