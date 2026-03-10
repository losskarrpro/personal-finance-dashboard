class CategoryManager {
  constructor() {
    this.categories = [];
    this.keywords = {};
    this.loadCategories();
  }

  async loadCategories() {
    try {
      const response = await fetch('data/categories.json');
      if (!response.ok) {
        throw new Error('Failed to load categories');
      }
      const data = await response.json();
      this.categories = data.categories;
      this.buildKeywordMap();
    } catch (error) {
      console.error('Error loading categories:', error);
      this.loadDefaultCategories();
    }
  }

  loadDefaultCategories() {
    this.categories = [
      { id: 'food', name: 'Food & Dining', keywords: ['restaurant', 'cafe', 'grocery', 'supermarket', 'food', 'dining', 'lunch', 'dinner', 'coffee'] },
      { id: 'transport', name: 'Transportation', keywords: ['gas', 'fuel', 'bus', 'train', 'taxi', 'uber', 'lyft', 'parking', 'toll', 'car', 'transport'] },
      { id: 'shopping', name: 'Shopping', keywords: ['clothes', 'shoes', 'electronics', 'amazon', 'store', 'mall', 'shop', 'purchase'] },
      { id: 'entertainment', name: 'Entertainment', keywords: ['movie', 'cinema', 'netflix', 'spotify', 'concert', 'game', 'hobby', 'sports'] },
      { id: 'utilities', name: 'Utilities', keywords: ['electricity', 'water', 'gas bill', 'internet', 'phone', 'mobile', 'utility'] },
      { id: 'health', name: 'Health & Medical', keywords: ['doctor', 'hospital', 'pharmacy', 'medicine', 'dentist', 'health', 'medical'] },
      { id: 'education', name: 'Education', keywords: ['school', 'university', 'course', 'book', 'tuition', 'education', 'learning'] },
      { id: 'income', name: 'Income', keywords: ['salary', 'paycheck', 'bonus', 'freelance', 'income', 'payment', 'revenue'] },
      { id: 'housing', name: 'Housing', keywords: ['rent', 'mortgage', 'property tax', 'home', 'apartment', 'housing'] },
      { id: 'other', name: 'Other', keywords: [] }
    ];
    this.buildKeywordMap();
  }

  buildKeywordMap() {
    this.keywords = {};
    this.categories.forEach(category => {
      category.keywords.forEach(keyword => {
        this.keywords[keyword.toLowerCase()] = category.id;
      });
    });
  }

  categorizeTransaction(description, amount) {
    if (!description || typeof description !== 'string') {
      return this.getCategoryById('other');
    }

    const descLower = description.toLowerCase();
    
    // Check for income based on amount and description
    if (amount > 0) {
      const incomeCategory = this.categories.find(cat => cat.id === 'income');
      if (incomeCategory) return incomeCategory;
    }

    // Check for keywords in description
    for (const [keyword, categoryId] of Object.entries(this.keywords)) {
      if (descLower.includes(keyword)) {
        return this.getCategoryById(categoryId);
      }
    }

    return this.getCategoryById('other');
  }

  getCategoryById(id) {
    return this.categories.find(cat => cat.id === id) || this.categories.find(cat => cat.id === 'other');
  }

  getCategories() {
    return this.categories;
  }
}

// Export for both ES6 and CommonJS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CategoryManager };
}