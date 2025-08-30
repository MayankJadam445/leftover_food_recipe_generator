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
        this.updateDietTypeVisualStyle(e.target.value);
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
   * Update visual style for diet type selection
   */
  updateDietTypeVisualStyle(selectedValue) {
    // Remove all previous styling classes
    document.querySelectorAll('.filter-option').forEach(option => {
      option.classList.remove('vegetarian-selected', 'non-vegetarian-selected', 'all-selected');
    });

    // Find the selected filter option and apply appropriate styling
    const selectedRadio = document.querySelector(`input[name="diet-type"][value="${selectedValue}"]`);
    if (selectedRadio) {
      const filterOption = selectedRadio.closest('.filter-option');
      if (filterOption) {
        if (selectedValue === 'vegetarian') {
          filterOption.classList.add('vegetarian-selected');
          console.log('🥬 Applied green styling to vegetarian option');
        } else if (selectedValue === 'non-vegetarian') {
          filterOption.classList.add('non-vegetarian-selected');
          console.log('🍖 Applied red styling to non-vegetarian option');
        } else if (selectedValue === 'all') {
          filterOption.classList.add('all-selected');
          console.log('🔵 Applied blue styling to all option');
        }
      }
    }
  }

  /**
   * Set apply button visual state
   */
  setApplyButtonState(state, color = 'orange') {
    const applyBtn = this.applyFiltersBtn;
    if (!applyBtn) return;

    // Remove all state classes
    applyBtn.classList.remove('applying', 'applying-blue', 'applying-orange', 'success', 'normal');
    
    switch (state) {
      case 'applying':
        if (color === 'blue') {
          applyBtn.classList.add('applying-blue');
          console.log('🔵 Apply button: Applying state (blue) - All filters selected');
        } else {
          applyBtn.classList.add('applying-orange');
          console.log('🟠 Apply button: Applying state (orange) - Specific filters selected');
        }
        applyBtn.textContent = 'Applying Filters...';
        applyBtn.disabled = true;
        break;
      case 'success':
        applyBtn.classList.add('success');
        applyBtn.textContent = 'Filters Applied ✓';
        applyBtn.disabled = false;
        console.log('🟢 Apply button: Success state');
        break;
      case 'normal':
      default:
        applyBtn.classList.add('normal');
        applyBtn.textContent = 'Apply Filters';
        applyBtn.disabled = false;
        console.log('⚪ Apply button: Normal state');
        break;
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
      // Determine button color based on current filters
      const isAllSelected = this.currentFilters.dietType === 'all' && 
                           this.currentFilters.cuisine === 'all' && 
                           this.currentFilters.category === 'all';
      
      // Add appropriate styling to apply button based on selection
      this.setApplyButtonState('applying', isAllSelected ? 'blue' : 'orange');
      
      DOMUtils.showMessage('Applying filters...', false, true);
      DOMUtils.clearResults();

      const recipeService = this.getRecipeService();
      if (!recipeService) {
        DOMUtils.showMessage('Recipe service not available. Please try again.', true);
        this.setApplyButtonState('normal');
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

      // Reset button state after successful filtering
      this.setApplyButtonState('success');
      setTimeout(() => {
        this.setApplyButtonState('normal');
      }, 2000);

    } catch (error) {
      console.error('Filter error:', error);
      DOMUtils.showMessage('Error applying filters. Please try again.', true);
      this.setApplyButtonState('normal');
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
   * Filter by diet type
   */
  filterByDietType(recipes, dietType) {
    if (dietType === 'all') return recipes;

    return recipes.filter(recipe => {
      const recipeName = recipe.strMeal?.toLowerCase() || '';
      const recipeInstructions = recipe.strInstructions?.toLowerCase() || '';
      
      if (dietType === 'vegetarian') {
        return this.isVegetarianRecipe(recipeName, recipeInstructions);
      } else if (dietType === 'non-vegetarian') {
        return !this.isVegetarianRecipe(recipeName, recipeInstructions);
      }
      
      return true;
    });
  }

  /**
   * Check if recipe is vegetarian
   */
  isVegetarianRecipe(recipeName, recipeInstructions = '') {
    const meatKeywords = [
      'chicken', 'beef', 'pork', 'lamb', 'mutton', 'fish', 'shrimp', 'prawn', 
      'crab', 'lobster', 'turkey', 'duck', 'bacon', 'ham', 'sausage', 'meat',
      'seafood', 'tuna', 'salmon', 'cod', 'sardine', 'anchovy'
    ];
    
    const textToCheck = `${recipeName} ${recipeInstructions}`.toLowerCase();
    
    return !meatKeywords.some(keyword => textToCheck.includes(keyword));
  }

  /**
   * Intersect two recipe arrays
   */
  intersectRecipes(recipes1, recipes2) {
    const ids1 = new Set(recipes1.map(r => r.idMeal));
    return recipes2.filter(recipe => ids1.has(recipe.idMeal));
  }

  /**
   * Get filter summary
   */
  getFilterSummary() {
    const parts = [];
    
    if (this.currentFilters.dietType !== 'all') {
      parts.push(`${this.currentFilters.dietType} diet`);
    }
    
    if (this.currentFilters.cuisine !== 'all') {
      parts.push(`${this.currentFilters.cuisine} cuisine`);
    }
    
    if (this.currentFilters.category !== 'all') {
      parts.push(`${this.currentFilters.category} category`);
    }
    
    return parts.length > 0 ? ` for ${parts.join(', ')}` : '';
  }

  /**
   * Clear all filters
   */
  clearFilters() {
    // Reset filter values
    this.currentFilters = {
      dietType: 'all',
      cuisine: 'all',
      category: 'all'
    };

    // Reset UI elements
    this.dietTypeElements.forEach(radio => {
      radio.checked = radio.value === 'all';
    });

    if (this.cuisineFilter) {
      this.cuisineFilter.value = 'all';
    }

    if (this.categoryFilter) {
      this.categoryFilter.value = 'all';
    }

    // Update filter display
    this.updateFilterDisplay();
    this.updateDietTypeVisualStyle('all');

    // Clear results and show default message
    DOMUtils.clearResults();
    DOMUtils.showMessage('Filters cleared. Showing all recipes.');
  }

  /**
   * Get recipe service
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

// Initialize the filter component
const filterComponent = new FilterComponent();

// Make it available globally
window.filterComponent = filterComponent;
