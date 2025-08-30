/**
 * Filter Component
 * Handles filtering functionality for recipes
 */

class FilterComponent {
  constructor() {
    this.dietTypeElements = document.getElementsByName('diet-type');
    this.cuisineFilter = DOMUtils.getElementById(CONFIG.ELEMENTS.CUISINE_FILTER);
    this.categoryFilter = DOMUtils.getElementById(CONFIG.ELEMENTS.CATEGORY_FILTER);
    this.applyFiltersBtn = DOMUtils.getElementById(CONFIG.ELEMENTS.APPLY_FILTERS);
    this.clearFiltersBtn = DOMUtils.getElementById(CONFIG.ELEMENTS.CLEAR_FILTERS);
    
    this.currentFilters = {
      dietType: 'all',
      cuisine: 'all',
      category: 'all'
    };
    
    this.initializeEventListeners();
    
    // Debug log
    console.log('🔍 Filter Component initialized');
  }

  /**
   * Initialize event listeners
   */
  initializeEventListeners() {
    // Diet type radio buttons
    this.dietTypeElements.forEach(radio => {
      DOMUtils.addEventListenerSafe(radio, 'change', (e) => {
        this.currentFilters.dietType = e.target.value;
        this.updateFilterDisplay();
      });
    });

    // Cuisine dropdown
    if (this.cuisineFilter) {
      DOMUtils.addEventListenerSafe(this.cuisineFilter, 'change', (e) => {
        this.currentFilters.cuisine = e.target.value;
        this.updateFilterDisplay();
      });
    }

    // Category dropdown
    if (this.categoryFilter) {
      DOMUtils.addEventListenerSafe(this.categoryFilter, 'change', (e) => {
        this.currentFilters.category = e.target.value;
        this.updateFilterDisplay();
      });
    }

    // Apply filters button
    if (this.applyFiltersBtn) {
      DOMUtils.addEventListenerSafe(this.applyFiltersBtn, 'click', () => {
        this.applyFilters();
      });
    }

    // Clear filters button
    if (this.clearFiltersBtn) {
      DOMUtils.addEventListenerSafe(this.clearFiltersBtn, 'click', () => {
        this.clearFilters();
      });
    }
  }

  /**
   * Update filter display to show active state
   */
  updateFilterDisplay() {
    const filterContainer = DOMUtils.getElementById(CONFIG.ELEMENTS.FILTER_CONTAINER);
    const hasActiveFilters = this.hasActiveFilters();
    
    if (filterContainer) {
      if (hasActiveFilters) {
        filterContainer.classList.add('filter-active');
      } else {
        filterContainer.classList.remove('filter-active');
      }
    }
  }

  /**
   * Check if any filters are active
   */
  hasActiveFilters() {
    return this.currentFilters.dietType !== 'all' || 
           this.currentFilters.cuisine !== 'all' || 
           this.currentFilters.category !== 'all';
  }

  /**
   * Apply current filters
   */
  async applyFilters() {
    try {
      DOMUtils.showMessage('Applying filters...', false, true);
      DOMUtils.clearResults();

      const recipeService = this.getRecipeService();
      if (!recipeService) {
        DOMUtils.showMessage('Recipe service not available. Please try again.', true);
        return;
      }

      let filteredRecipes = [];

      // Apply cuisine filter
      if (this.currentFilters.cuisine !== 'all') {
        const cuisineResults = await this.filterByCuisine(this.currentFilters.cuisine);
        filteredRecipes = cuisineResults;
      }

      // Apply category filter
      if (this.currentFilters.category !== 'all') {
        const categoryResults = await this.filterByCategory(this.currentFilters.category);
        if (filteredRecipes.length > 0) {
          // Intersect with existing results
          filteredRecipes = this.intersectRecipes(filteredRecipes, categoryResults);
        } else {
          filteredRecipes = categoryResults;
        }
      }

      // If no specific filters applied, get all recipes
      if (this.currentFilters.cuisine === 'all' && this.currentFilters.category === 'all') {
        const indianData = await recipeService.apiService.getIndianRecipes();
        filteredRecipes = indianData.meals || [];
      }

      // Apply diet type filter
      if (this.currentFilters.dietType !== 'all') {
        filteredRecipes = this.filterByDietType(filteredRecipes, this.currentFilters.dietType);
      }

      DOMUtils.clearMessage();

      if (filteredRecipes.length > 0) {
        const recipeDisplay = this.getRecipeDisplay();
        if (recipeDisplay) {
          recipeDisplay.displayRecipes(filteredRecipes);
          
          const filterSummary = this.getFilterSummary();
          DOMUtils.showMessage(`Found ${filteredRecipes.length} recipes${filterSummary}`);
        }
      } else {
        DOMUtils.showMessage('No recipes found matching your filters. Try adjusting your criteria.', true);
      }

    } catch (error) {
      console.error('Filter error:', error);
      DOMUtils.showMessage('Error applying filters. Please try again.', true);
    }
  }

  /**
   * Filter by cuisine
   */
  async filterByCuisine(cuisine) {
    const apiService = this.getApiService();
    if (!apiService) return [];

    try {
      const data = await apiService.filterByArea(cuisine);
      return data.meals || [];
    } catch (error) {
      console.error('Cuisine filter error:', error);
      return [];
    }
  }

  /**
   * Filter by category
   */
  async filterByCategory(category) {
    const apiService = this.getApiService();
    if (!apiService) return [];

    try {
      const data = await apiService.filterByCategory(category);
      return data.meals || [];
    } catch (error) {
      console.error('Category filter error:', error);
      return [];
    }
  }

  /**
   * Filter by diet type (vegetarian/non-vegetarian)
   */
  filterByDietType(recipes, dietType) {
    if (dietType === 'all') return recipes;

    return recipes.filter(recipe => {
      const recipeName = recipe.strMeal.toLowerCase();
      const isVegetarian = this.isVegetarianRecipe(recipeName);
      
      if (dietType === 'vegetarian') {
        return isVegetarian;
      } else if (dietType === 'non-vegetarian') {
        return !isVegetarian;
      }
      
      return true;
    });
  }

  /**
   * Check if a recipe is vegetarian based on name
   */
  isVegetarianRecipe(recipeName) {
    const hasVegKeywords = CONFIG.FILTERS.VEGETARIAN_KEYWORDS.some(keyword => 
      recipeName.includes(keyword.toLowerCase())
    );
    
    const hasNonVegKeywords = CONFIG.FILTERS.NON_VEGETARIAN_KEYWORDS.some(keyword => 
      recipeName.includes(keyword.toLowerCase())
    );
    
    // If has non-veg keywords, definitely not vegetarian
    if (hasNonVegKeywords) return false;
    
    // If has veg keywords, likely vegetarian
    if (hasVegKeywords) return true;
    
    // Default assumption for ambiguous cases
    return false;
  }

  /**
   * Intersect two recipe arrays based on ID
   */
  intersectRecipes(recipes1, recipes2) {
    const ids2 = new Set(recipes2.map(recipe => recipe.idMeal));
    return recipes1.filter(recipe => ids2.has(recipe.idMeal));
  }

  /**
   * Get filter summary for display
   */
  getFilterSummary() {
    const parts = [];
    
    if (this.currentFilters.dietType !== 'all') {
      parts.push(`${this.currentFilters.dietType}`);
    }
    
    if (this.currentFilters.cuisine !== 'all') {
      parts.push(`${this.currentFilters.cuisine} cuisine`);
    }
    
    if (this.currentFilters.category !== 'all') {
      parts.push(`${this.currentFilters.category} category`);
    }
    
    return parts.length > 0 ? ` matching: ${parts.join(', ')}` : '';
  }

  /**
   * Clear all filters
   */
  clearFilters() {
    // Reset diet type
    this.dietTypeElements.forEach(radio => {
      radio.checked = radio.value === 'all';
    });
    
    // Reset dropdowns
    if (this.cuisineFilter) this.cuisineFilter.value = 'all';
    if (this.categoryFilter) this.categoryFilter.value = 'all';
    
    // Reset internal state
    this.currentFilters = {
      dietType: 'all',
      cuisine: 'all',
      category: 'all'
    };
    
    this.updateFilterDisplay();
    DOMUtils.showMessage('Filters cleared. Showing all recipes.');
    DOMUtils.clearResults();
  }

  /**
   * Get services (lazy loading)
   */
  getRecipeService() {
    return window.recipeService;
  }

  getApiService() {
    return window.apiService;
  }

  getRecipeDisplay() {
    return window.recipeDisplayComponent;
  }
}

// Create global instance
window.filterComponent = new FilterComponent();
