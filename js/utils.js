/**
 * Fonctions utilitaires pour le Personal Finance Dashboard
 */

const Utils = (function() {
    'use strict';

    /**
     * Formate un montant en devise (€)
     * @param {number} amount - Montant à formater
     * @param {boolean} showSign - Afficher le signe + pour les montants positifs
     * @returns {string} Montant formaté
     */
    function formatCurrency(amount, showSign = false) {
        if (typeof amount !== 'number' || isNaN(amount)) {
            return '0,00 €';
        }
        
        const sign = showSign && amount > 0 ? '+' : '';
        const formattedAmount = Math.abs(amount).toFixed(2).replace('.', ',');
        return `${sign}${formattedAmount} €`;
    }

    /**
     * Formate une date au format français (jj/mm/aaaa)
     * @param {Date|string} date - Date à formater
     * @returns {string} Date formatée
     */
    function formatDate(date) {
        if (!date) return '';
        
        const d = new Date(date);
        if (isNaN(d.getTime())) return '';
        
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const year = d.getFullYear();
        
        return `${day}/${month}/${year}`;
    }

    /**
     * Formate une date pour l'input date (aaaa-mm-jj)
     * @param {Date} date - Date à formater
     * @returns {string} Date au format input date
     */
    function formatDateForInput(date) {
        if (!date) return '';
        
        const d = new Date(date);
        if (isNaN(d.getTime())) return '';
        
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    }

    /**
     * Obtient le nom du mois à partir de son index (0-11)
     * @param {number} monthIndex - Index du mois (0-11)
     * @returns {string} Nom du mois
     */
    function getMonthName(monthIndex) {
        const months = [
            'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
        ];
        return months[monthIndex] || '';
    }

    /**
     * Obtient le nom abrégé du mois
     * @param {number} monthIndex - Index du mois (0-11)
     * @returns {string} Nom abrégé du mois
     */
    function getShortMonthName(monthIndex) {
        const months = [
            'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
            'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'
        ];
        return months[monthIndex] || '';
    }

    /**
     * Calcule la différence en jours entre deux dates
     * @param {Date} date1 - Première date
     * @param {Date} date2 - Deuxième date
     * @returns {number} Différence en jours
     */
    function getDaysDifference(date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        const diffTime = Math.abs(d2 - d1);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    /**
     * Obtient le premier jour du mois
     * @param {Date} date - Date de référence
     * @returns {Date} Premier jour du mois
     */
    function getFirstDayOfMonth(date) {
        const d = new Date(date);
        return new Date(d.getFullYear(), d.getMonth(), 1);
    }

    /**
     * Obtient le dernier jour du mois
     * @param {Date} date - Date de référence
     * @returns {Date} Dernier jour du mois
     */
    function getLastDayOfMonth(date) {
        const d = new Date(date);
        return new Date(d.getFullYear(), d.getMonth() + 1, 0);
    }

    /**
     * Génère un identifiant unique
     * @returns {string} Identifiant unique
     */
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * Valide un montant
     * @param {string|number} amount - Montant à valider
     * @returns {boolean} True si le montant est valide
     */
    function isValidAmount(amount) {
        if (typeof amount === 'string') {
            amount = parseFloat(amount.replace(',', '.'));
        }
        
        return typeof amount === 'number' && 
               !isNaN(amount) && 
               isFinite(amount) && 
               amount !== 0;
    }

    /**
     * Valide une date
     * @param {string|Date} date - Date à valider
     * @returns {boolean} True si la date est valide
     */
    function isValidDate(date) {
        if (!date) return false;
        
        const d = new Date(date);
        return d instanceof Date && !isNaN(d.getTime());
    }

    /**
     * Valide une description
     * @param {string} description - Description à valider
     * @returns {boolean} True si la description est valide
     */
    function isValidDescription(description) {
        return typeof description === 'string' && 
               description.trim().length > 0 && 
               description.trim().length <= 200;
    }

    /**
     * Calcule le pourcentage
     * @param {number} part - Partie
     * @param {number} total - Total
     * @returns {number} Pourcentage (0-100)
     */
    function calculatePercentage(part, total) {
        if (total === 0) return 0;
        return Math.round((part / total) * 100);
    }

    /**
     * Arrondit un nombre à deux décimales
     * @param {number} num - Nombre à arrondir
     * @returns {number} Nombre arrondi
     */
    function roundToTwoDecimals(num) {
        return Math.round((num + Number.EPSILON) * 100) / 100;
    }

    /**
     * Calcule la moyenne d'un tableau de nombres
     * @param {number[]} numbers - Tableau de nombres
     * @returns {number} Moyenne
     */
    function calculateAverage(numbers) {
        if (!Array.isArray(numbers) || numbers.length === 0) return 0;
        
        const sum = numbers.reduce((acc, num) => acc + num, 0);
        return roundToTwoDecimals(sum / numbers.length);
    }

    /**
     * Calcule la médiane d'un tableau de nombres
     * @param {number[]} numbers - Tableau de nombres
     * @returns {number} Médiane
     */
    function calculateMedian(numbers) {
        if (!Array.isArray(numbers) || numbers.length === 0) return 0;
        
        const sorted = [...numbers].sort((a, b) => a - b);
        const middle = Math.floor(sorted.length / 2);
        
        if (sorted.length % 2 === 0) {
            return roundToTwoDecimals((sorted[middle - 1] + sorted[middle]) / 2);
        }
        
        return roundToTwoDecimals(sorted[middle]);
    }

    /**
     * Calcule l'écart type d'un tableau de nombres
     * @param {number[]} numbers - Tableau de nombres
     * @returns {number} Écart type
     */
    function calculateStandardDeviation(numbers) {
        if (!Array.isArray(numbers) || numbers.length < 2) return 0;
        
        const avg = calculateAverage(numbers);
        const squareDiffs = numbers.map(num => Math.pow(num - avg, 2));
        const avgSquareDiff = calculateAverage(squareDiffs);
        
        return roundToTwoDecimals(Math.sqrt(avgSquareDiff));
    }

    /**
     * Filtre les transactions par période
     * @param {Array} transactions - Liste des transactions
     * @param {string} period - Période ('day', 'week', 'month', 'year', 'all')
     * @param {Date} referenceDate - Date de référence
     * @returns {Array} Transactions filtrées
     */
    function filterTransactionsByPeriod(transactions, period, referenceDate = new Date()) {
        if (!Array.isArray(transactions)) return [];
        
        const now = new Date(referenceDate);
        
        switch (period) {
            case 'day':
                const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
                return transactions.filter(t => {
                    const date = new Date(t.date);
                    return date >= startOfDay && date < endOfDay;
                });
                
            case 'week':
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay());
                startOfWeek.setHours(0, 0, 0, 0);
                
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 7);
                
                return transactions.filter(t => {
                    const date = new Date(t.date);
                    return date >= startOfWeek && date < endOfWeek;
                });
                
            case 'month':
                const startOfMonth = getFirstDayOfMonth(now);
                const endOfMonth = getLastDayOfMonth(now);
                endOfMonth.setHours(23, 59, 59, 999);
                
                return transactions.filter(t => {
                    const date = new Date(t.date);
                    return date >= startOfMonth && date <= endOfMonth;
                });
                
            case 'year':
                const startOfYear = new Date(now.getFullYear(), 0, 1);
                const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
                
                return transactions.filter(t => {
                    const date = new Date(t.date);
                    return date >= startOfYear && date <= endOfYear;
                });
                
            case 'all':
            default:
                return [...transactions];
        }
    }

    /**
     * Groupe les transactions par catégorie
     * @param {Array} transactions - Liste des transactions
     * @returns {Object} Transactions groupées par catégorie
     */
    function groupTransactionsByCategory(transactions) {
        if (!Array.isArray(transactions)) return {};
        
        return transactions.reduce((groups, transaction) => {
            const category = transaction.category || 'Non catégorisé';
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(transaction);
            return groups;
        }, {});
    }

    /**
     * Groupe les transactions par mois
     * @param {Array} transactions - Liste des transactions
     * @returns {Object} Transactions groupées par mois
     */
    function groupTransactionsByMonth(transactions) {
        if (!Array.isArray(transactions)) return {};
        
        return transactions.reduce((groups, transaction) => {
            const date = new Date(transaction.date);
            const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            
            if (!groups[monthKey]) {
                groups[monthKey] = [];
            }
            groups[monthKey].push(transaction);
            return groups;
        }, {});
    }

    /**
     * Trie un objet par ses valeurs (décroissant)
     * @param {Object} obj - Objet à trier
     * @returns {Array} Tableau de paires [clé, valeur] triées
     */
    function sortObjectByValue(obj) {
        return Object.entries(obj).sort((a, b) => b[1] - a[1]);
    }

    /**
     * Débounce une fonction
     * @param {Function} func - Fonction à débouncer
     * @param {number} wait - Temps d'attente en ms
     * @returns {Function} Fonction débouncée
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Affiche un message de notification
     * @param {string} message - Message à afficher
     * @param {string} type - Type de message ('success', 'error', 'warning', 'info')
     * @param {number} duration - Durée d'affichage en ms
     */
    function showNotification(message, type = 'info', duration = 3000) {
        //const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            opacity: 0;
            transform: translateX(100px);
            transition: opacity 0.3s, transform 0.3s;
        `;
        
        // Styles selon le type
        switch(type) {
            case 'success':
                notification.style.backgroundColor = '#4CAF50';
                break;
            case 'error':
                notification.style.backgroundColor = '#f44336';
                break;
            case 'warning':
                notification.style.backgroundColor = '#ff9800';
                break;
            case 'info':
            default:
                notification.style.backgroundColor = '#2196F3';
        }
        
        document.body.appendChild(notification);
        
        // Animation d'entrée
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Suppression après la durée
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100px)';
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }

    /**
     * Copie du texte dans le presse-papier
     * @param {string} text - Texte à copier
     * @returns {Promise<boolean>} Succès de la copie
     */
    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            showNotification('Copié dans le presse-papier', 'success');
            return true;
        } catch (err) {
            console.error('Erreur lors de la copie:', err);
            showNotification('Erreur lors de la copie', 'error');
            return false;
        }
    }

    /**
     * Télécharge un fichier
     * @param {string} content - Contenu du fichier
     * @param {string} filename - Nom du fichier
     * @param {string} type - Type MIME
     */
    function downloadFile(content, filename, type = 'text/plain') {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    }

    /**
     * Parse une chaîne CSV
     * @param {string} csv - Chaîne CSV
     * @param {string} delimiter - Délimiteur
     * @returns {Array} Données parsées
     */
    function parseCSV(csv, delimiter = ',') {
        const lines = csv.split('\n');
        const result = [];
        
        if (lines.length === 0) return result;
        
        const headers = lines[0].split(delimiter).map(h => h.trim());
        
        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            
            const obj = {};
            const currentLine = lines[i].split(delimiter);
            
            headers.forEach((header, index) => {
                obj[header] = currentLine[index] ? currentLine[index].trim() : '';
            });
            
            result.push(obj);
        }
        
        return result;
    }

    /**
     * Convertit un objet en chaîne CSV
     * @param {Array} data - Données à convertir
     * @param {Array} headers - En-têtes CSV
     * @param {string} delimiter - Délimiteur
     * @returns {string} Chaîne CSV
     */
    function toCSV(data, headers = null, delimiter = ',') {
        if (!Array.isArray(data) || data.length === 0) return '';
        
        const actualHeaders = headers || Object.keys(data[0]);
        const csvRows = [];
        
        // En-têtes
        csvRows.push(actualHeaders.join(delimiter));
        
        // Données
        data.forEach(item => {
            const row = actualHeaders.map(header => {
                const value = item[header];
                // Gérer les valeurs contenant des virgules ou guillemets
                if (typeof value === 'string' && (value.includes(delimiter) || value.includes('"'))) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value !== undefined && value !== null ? value : '';
            });
            csvRows.push(row.join(delimiter));
        });
        
        return csvRows.join('\n');
    }

    /**
     * Génère une couleur à partir d'une chaîne
     * @param {string} str - Chaîne d'entrée
     * @returns {string} Couleur hexadécimale
     */
    function stringToColor(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        const color = `hsl(${hash % 360}, 70%, 60%)`;
        return color;
    }

    /**
     * Calcule la luminosité d'une couleur
     * @param {string} color - Couleur hexadécimale
     * @returns {number} Luminosité (0-255)
     */
    function getColorLuminance(color) {
        // Convertir hex en RGB
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        // Formule de luminance relative
        return (0.299 * r + 0.587 * g + 0.114 * b);
    }

    /**
     * Détermine si une couleur est claire ou foncée
     * @param {string} color - Couleur hexadécimale
     * @returns {boolean} True si la couleur est claire
     */
    function isLightColor(color) {
        return getColorLuminance(color) > 186;
    }

    /**
     * Obtient une couleur de texte contrastée
     * @param {string} backgroundColor - Couleur de fond
     * @returns {string} Couleur de texte (noir ou blanc)
     */
    function getContrastTextColor(backgroundColor) {
        return isLightColor(backgroundColor) ? '#000000' : '#FFFFFF';
    }

    /**
     * Formate un nombre avec des séparateurs de milliers
     * @param {number} num - Nombre à formater
     * @returns {string} Nombre formaté
     */
    function formatNumberWithSeparators(num) {
        if (typeof num !== 'number' || isNaN(num)) return '0';
        
        return num.toLocaleString('fr-FR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });
    }

    /**
     * Calcule l'âge d'une transaction en jours
     * @param {Date|string} transactionDate - Date de la transaction
     * @returns {number} Âge en jours
     */
    function getTransactionAge(transactionDate) {
        const transaction = new Date(transactionDate);
        const now = new Date();
        const diffTime = Math.abs(now - transaction);
        return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    }

    /**
     * Vérifie si une date est aujourd'hui
     * @param {Date|string} date - Date à vérifier
     * @returns {boolean} True si la date est aujourd'hui
     */
    function isToday(date) {
        const d = new Date(date);
        const today = new Date();
        
        return d.getDate() === today.getDate() &&
               d.getMonth() === today.getMonth() &&
               d.getFullYear() === today.getFullYear();
    }

    /**
     * Vérifie si une date est dans le futur
     * @param {Date|string} date - Date à vérifier
     * @returns {boolean} True si la date est dans le futur
     */
    function isFutureDate(date) {
        const d = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return d > today;
    }

    /**
     * Vérifie si une date est dans le passé
     * @param {Date|string} date - Date à vérifier
     * @returns {boolean} True si la date est dans le passé
     */
    function isPastDate(date) {
        const d = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return d < today;
    }

    /**
     * Obtient la période de la journée
     * @returns {string} Période ('morning', 'afternoon', 'evening', 'night')
     */
    function getTimeOfDay() {
        const hour = new Date().getHours();
        
        if (hour < 12) return 'morning';
        if (hour < 17) return 'afternoon';
        if (hour < 21) return 'evening';
        return 'night';
    }

    /**
     * Génère un message de salutation selon l'heure
     * @returns {string} Message de salutation
     */
    function getGreeting() {
        const timeOfDay = getTimeOfDay();
        const greetings = {
            morning: 'Bonjour',
            afternoon: 'Bon après-midi',
            evening: 'Bonsoir',
            night: 'Bonne nuit'
        };
        
        return greetings[timeOfDay] || 'Bonjour';
    }

    // API publique
    return {
        formatCurrency,
        formatDate,
        formatDateForInput,
        getMonthName,
        getShortMonthName,
        getDaysDifference,
        getFirstDayOfMonth,
        getLastDayOfMonth,
        generateId,
        isValidAmount,
        isValidDate,
        isValidDescription,
        calculatePercentage,
        roundToTwoDecimals,
        calculateAverage,
        calculateMedian,
        calculateStandardDeviation,
        filterTransactionsByPeriod,
        groupTransactionsByCategory,
        groupTransactionsByMonth,
        sortObjectByValue,
        debounce,
        showNotification,
        copyToClipboard,
        downloadFile,
        parseCSV,
        toCSV,
        stringToColor,
        getColorLuminance,
        isLightColor,
        getContrastTextColor,
        formatNumberWithSeparators,
        getTransactionAge,
        isToday,
        isFutureDate,
        isPastDate,
        getTimeOfDay,
        getGreeting
    };
})();