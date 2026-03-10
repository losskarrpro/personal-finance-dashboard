# Personal Finance Dashboard

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
Point d'entrée principal qui initialise tous les modules et gère les événements globaux.

#### `transaction.js`
Classe `Transaction` avec validation et méthodes de manipulation. Gère le cycle de vie des transactions.

#### `storage.js`
Abstraction du localStorage avec sérialisation/désérialisation et gestion des erreurs.

#### `chart-manager.js`
Configuration et mise à jour des graphiques Chart.js avec thèmes dynamiques.

#### `ui-manager.js`
Gestion des interactions utilisateur, mises à jour du DOM et validation des formulaires.

#### `category-manager.js`
Catégorisation automatique basée sur des mots-clés et apprentissage des habitudes.

#### `statistics.js`
Calcul des indicateurs financiers, tendances et projections.

#### `goals-manager.js`
Définition et suivi des objectifs d'épargne avec notifications.

#### `export-manager.js`
Export CSV et PNG avec formatage personnalisé.

#### `utils.js`
Fonctions utilitaires : formatage de dates, devises, validation, etc.

## 📱 Utilisation

### Ajouter une transaction
1. Cliquer sur le bouton "Nouvelle transaction"
2. Remplir le formulaire :
   - Description
   - Montant
   - Type (Revenu/Dépense)
   - Catégorie (sélection automatique ou manuelle)
   - Date
3. Cliquer sur "Enregistrer"

### Visualiser les statistiques
- Le tableau de bord principal affiche automatiquement :
  - Solde courant
  - Revenus du mois
  - Dépenses du mois
  - Épargne mensuelle
- Naviguer entre les onglets pour voir différents graphiques

### Définir un objectif
1. Aller dans la section "Objectifs"
2. Cliquer sur "Nouvel objectif"
3. Définir :
   - Nom de l'objectif
   - Montant cible
   - Date limite
4. Suivre la progression dans le tableau de bord

### Exporter des données
1. Aller dans la section "Export"
2. Choisir le format :
   - CSV pour les données brutes
   - PNG pour les graphiques
3. Télécharger le fichier

## 🧪 Tests

L'application inclut des tests unitaires pour les fonctions critiques :

```bash
# Exécuter les tests
# Ouvrir le fichier de test dans le navigateur
open js/transaction.test.html
open js/statistics.test.html
```

Les tests couvrent :
- Validation des transactions
- Calcul des statistiques
- Catégorisation automatique
- Persistance des données

## 🔧 Personnalisation

### Modifier les catégories
Éditer le fichier `data/categories.json` pour :
- Ajouter/supprimer des catégories
- Modifier les mots-clés de catégorisation automatique
- Changer les couleurs des catégories

### Thème personnalisé
Modifier les variables CSS dans `css/style.css` :
```css
:root {
  --primary-color: #4f46e5;
  --secondary-color: #10b981;
  --background-color: #f9fafb;
  --text-color: #111827;
}
```

### Ajouter de nouvelles fonctionnalités
1. Créer un nouveau module dans `js/`
2. L'importer dans `app.js`
3. Ajouter l'interface utilisateur correspondante

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 🐛 Support

Pour rapporter un bug ou suggérer une amélioration :
1. Vérifier les issues existantes
2. Créer une nouvelle issue avec :
   - Description détaillée
   - Étapes pour reproduire
   - Comportement attendu vs actuel
   - Captures d'écran si applicable

## 📞 Contact

Pour toute question ou feedback :
- Email : contact@example.com
- Issues GitHub : [github.com/votre-username/personal-finance-dashboard/issues](https://github.com/votre-username/personal-finance-dashboard/issues)

---

**Note** : Cette application fonctionne entièrement côté client. Les données sont stockées localement dans votre navigateur. Pensez à exporter régulièrement vos données pour éviter toute perte en cas de suppression des cookies ou du cache.