# Personal Finance Dashboard

**Créé par LUMENA**

## 📊 Vue d'ensemble

**Personal Finance Dashboard** est une application web moderne et responsive permettant de suivre et gérer ses finances personnelles. L'application offre une interface intuitive pour enregistrer des transactions, visualiser ses dépenses et revenus, suivre des objectifs d'épargne et analyser ses habitudes financières.

## ✨ Fonctionnalités principales

### 1. **Gestion des transactions**
- Ajout de transactions (revenus et dépenses)
- Suppression de transactions
- Modification des transactions existantes
- Catégorisation automatique des transactions
- Filtrage par catégorie, type et période

### 2. **Visualisations interactives**
- Graphiques en secteurs (camembert) pour les dépenses par catégorie
- Graphiques en barres pour l'évolution mensuelle
- Graphiques en ligne pour suivre l'épargne
- Tableau de bord avec indicateurs clés (KPI)

### 3. **Statistiques et analyses**
- Statistiques mensuelles détaillées
- Comparaison mois par mois
- Tendance des dépenses et revenus
- Solde courant et projections

### 4. **Gestion des objectifs**
- Définition d'objectifs d'épargne
- Suivi de la progression vers les objectifs
- Alertes visuelles pour les objectifs atteints

### 5. **Export et sauvegarde**
- Export des données au format CSV
- Export des graphiques en image PNG
- Sauvegarde automatique dans le localStorage
- Restauration des données

### 6. **Interface utilisateur**
- Design moderne et épuré
- Interface entièrement responsive
- Mode sombre/clair
- Navigation intuitive
- Feedback visuel immédiat

## 🚀 Installation

### Prérequis
- Navigateur web moderne (Chrome 80+, Firefox 75+, Safari 13+)
- Aucune installation serveur requise

### Installation locale

1. **Cloner le dépôt**
```bash
git clone https://github.com/votre-username/personal-finance-dashboard.git
cd personal-finance-dashboard
```

2. **Ouvrir l'application**
- Ouvrir le fichier `index.html` directement dans votre navigateur
- Ou utiliser un serveur local :
```bash
# Avec Python
python -m http.server 8000

# Avec Node.js
npx serve .
```

3. **Accéder à l'application**
- Ouvrir votre navigateur à l'adresse : `http://localhost:8000`

## 📁 Structure du projet

```
personal-finance-dashboard/
├── index.html              # Page principale
├── css/
│   ├── style.css          # Styles principaux
│   ├── components.css     # Styles des composants
│   └── responsive.css     # Styles responsives
├── js/
│   ├── app.js             # Point d'entrée de l'application
│   ├── transaction.js     # Gestion des transactions
│   ├── storage.js         # Gestion du localStorage
│   ├── chart-manager.js   # Gestion des graphiques Chart.js
│   ├── ui-manager.js      # Gestion de l'interface utilisateur
│   ├── category-manager.js # Catégorisation automatique
│   ├── statistics.js      # Calcul des statistiques
│   ├── goals-manager.js   # Gestion des objectifs
│   ├── export-manager.js  # Fonctions d'export
│   ├── utils.js           # Fonctions utilitaires
│   ├── transaction.test.js # Tests unitaires transactions
│   └── statistics.test.js  # Tests unitaires statistiques
├── data/
│   └── categories.json    # Définition des catégories
├── assets/
│   └── icons/
│       └── favicon.ico    # Icône de l'application
├── package.json           # Configuration npm
├── README.md              # Documentation
└── .gitignore            # Fichiers ignorés par Git
```

## 🛠️ Architecture technique

### Technologies utilisées
- **HTML5** : Structure sémantique
- **CSS3** : Styles avec variables CSS et Flexbox/Grid
- **JavaScript ES6+** : Logique métier modulaire
- **Chart.js 3.x** : Visualisations graphiques
- **LocalStorage** : Persistance des données
- **FileSaver.js** : Export des fichiers

### Modules JavaScript

#### `app.js`
Point d'entrée principal qui initialise tous les modules et coordonne l'application.

#### `transaction.js`
Gère le cycle de vie des transactions (CRUD) et la logique métier associée.

#### `storage.js`
Abstraction du localStorage avec sérialisation/désérialisation JSON et gestion des erreurs.

#### `chart-manager.js`
Configuration et mise à jour des graphiques Chart.js avec les données actuelles.

#### `ui-manager.js`
Gère les interactions utilisateur, les formulaires et les mises à jour de l'interface.

#### `category-manager.js`
Implémente la catégorisation automatique des transactions basée sur des mots-clés.

#### `statistics.js`
Calcule les statistiques financières (totaux, moyennes, tendances).

#### `goals-manager.js`
Gère la création, le suivi et la mise à jour des objectifs d'épargne.

#### `export-manager.js`
Génère les fichiers CSV et PNG pour l'export des données et graphiques.

#### `utils.js`
Fonctions utilitaires (formatage de dates, nombres, validation).

## 📈 Utilisation

### Ajouter une transaction
1. Cliquer sur le bouton "+ Nouvelle transaction"
2. Remplir le formulaire (description, montant, type, catégorie, date)
3. Cliquer sur "Enregistrer"

### Visualiser les données
- Les graphiques se mettent à jour automatiquement
- Utiliser les filtres pour affiner l'affichage
- Basculer entre les vues mensuelles et annuelles

### Définir un objectif
1. Aller dans l'onglet "Objectifs"
2. Cliquer sur "+ Nouvel objectif"
3. Définir le montant cible et la date limite
4. Suivre la progression dans le tableau de bord

### Exporter des données
1. Aller dans l'onglet "Export"
2. Choisir le format (CSV ou PNG)
3. Cliquer sur "Télécharger"

## 🧪 Tests

### Tests unitaires
Les tests unitaires sont implémentés avec Jest et couvrent les fonctionnalités principales :

```bash
# Lancer les tests
npm test
```

### Tests couverts
- Gestion des transactions (ajout, suppression, modification)
- Calcul des statistiques (totaux, moyennes)
- Catégorisation automatique
- Persistance des données

## 🔧 Développement

### Installation des dépendances
```bash
npm install
```

### Lancer en mode développement
```bash
npm run dev
```

### Builder pour production
```bash
npm run build
```

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amélioration`)
3. Commiter les changements (`git commit -m 'Ajout d'une nouvelle fonctionnalité'`)
4. Pousser la branche (`git push origin feature/amélioration`)
5. Ouvrir une Pull Request

## 📞 Support

Pour toute question ou problème, ouvrir une issue sur GitHub.
