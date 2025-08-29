/**
 * Search Component
 * Handles search functionality and UI interactions
 */

class SearchComponent {
  constructor() {
    this.searchForm = DOMUtils.getElementById(CONFIG.ELEMENTS.SEARCH_FORM);
    this.searchInput = DOMUtils.getElementById(CONFIG.ELEMENTS.SEARCH_INPUT);
    
    // Initialize event listeners immediately
    this.initializeEventListeners();
  }

  /**
   * Get services (lazy loading)
   */
  getRecipeService() {
    return window.recipeService;
  }

  getRecipeDisplay() {
    return window.recipeDisplayComponent;
  }

  /**
   * Initialize event listeners
   */
  initializeEventListeners() {
    // Search form submission
    if (this.searchForm) {
      DOMUtils.addEventListenerSafe(this.searchForm, 'submit', (e) => {
        e.preventDefault();
        this.handleSearch();
      });
    }

    // Modal close functionality
    this.initializeModalEvents();

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.getRecipeDisplay()?.closeModal();
      }
      if (e.key === 'Enter' && e.ctrlKey) {
        this.handleSearch();
      }
    });
  }

  /**
   * Initialize modal events
   */
  initializeModalEvents() {
    const modal = DOMUtils.getElementById(CONFIG.ELEMENTS.MODAL);
    const modalCloseBtn = DOMUtils.getElementById(CONFIG.ELEMENTS.MODAL_CLOSE_BTN);

    // Close button
    if (modalCloseBtn) {
      DOMUtils.addEventListenerSafe(modalCloseBtn, 'click', () => {
        this.getRecipeDisplay()?.closeModal();
      });
    }

    // Click outside modal to close
    if (modal) {
      DOMUtils.addEventListenerSafe(modal, 'click', (e) => {
        if (e.target === modal) {
          this.getRecipeDisplay()?.closeModal();
        }
      });
    }
  }

  /**
   * Handle search functionality
   */
  async handleSearch() {
    if (!this.searchInput) return;

    const searchTerm = this.searchInput.value.trim();
    
    if (!searchTerm) {
      DOMUtils.showMessage('Please enter a search term', true);
      return;
    }

    const recipeService = this.getRecipeService();
    const recipeDisplay = this.getRecipeDisplay();
    
    if (!recipeService || !recipeDisplay) {
      DOMUtils.showMessage('Application is still loading. Please try again.', true);
      return;
    }

    try {
      DOMUtils.showMessage(`${CONFIG.MESSAGES.SEARCHING} "${searchTerm}"...`, false, true);
      DOMUtils.clearResults();

      const result = await recipeService.searchRecipes(searchTerm);
      
      DOMUtils.clearMessage();
      
      if (result.error) {
        DOMUtils.showMessage(CONFIG.MESSAGES.NETWORK_ERROR, true);
        return;
      }
      
      if (result.hasResults && result.recipes.length > 0) {
        // Found matching recipes
        recipeDisplay.displayRecipes(result.recipes);
        
        const indianCount = this.countIndianRecipes(result.recipes);
        const message = indianCount > 0 
          ? `Found ${result.recipes.length} recipes (${indianCount} Indian dishes) for "${searchTerm}"`
          : `Found ${result.recipes.length} recipes for "${searchTerm}"`;
        DOMUtils.showMessage(message);
        
      } else if (result.showSuggestions && result.recipes.length > 0) {
        // No exact matches but showing suggestions
        recipeDisplay.displayRecipes(result.recipes);
        const message = CONFIG.MESSAGES.NO_RESULTS_WITH_SUGGESTIONS.replace('{query}', searchTerm);
        DOMUtils.showMessage(message);
        
      } else {
        // No results at all
        this.showNoResultsMessage(searchTerm);
      }
    } catch (error) {
      console.error('Search error:', error);
      DOMUtils.showMessage(CONFIG.MESSAGES.NETWORK_ERROR, true);
    }
  }

  /**
   * Show detailed no results message with suggestions
   */
  showNoResultsMessage(searchTerm) {
    DOMUtils.clearResults();
    
    const resultsGrid = DOMUtils.getElementById(CONFIG.ELEMENTS.RESULTS_GRID);
    if (!resultsGrid) return;

    const noResultsHTML = `
      <div class="no-results-container">
        <div class="no-results-icon">🔍</div>
        <h3>No recipes found for "${DOMUtils.sanitizeHTML(searchTerm)}"</h3>
        <p>Don't worry! Here are some tips to find great recipes:</p>
        
        <div class="search-suggestions">
          <h4>Try searching for:</h4>
          <ul class="suggestions-list">
            ${CONFIG.MESSAGES.SEARCH_SUGGESTIONS.map(suggestion => 
              `<li>${suggestion}</li>`
            ).join('')}
          </ul>
        </div>
        
        <div class="quick-search-buttons">
          <h4>Quick searches:</h4>
          <div class="quick-buttons">
            <button class="quick-search-btn" data-search="chicken">🐔 Chicken</button>
            <button class="quick-search-btn" data-search="rice">🍚 Rice</button>
            <button class="quick-search-btn" data-search="paneer">🧀 Paneer</button>
            <button class="quick-search-btn" data-search="dal">🫘 Dal</button>
            <button class="quick-search-btn" data-search="potato">🥔 Potato</button>
            <button class="quick-search-btn" data-search="curry">🍛 Curry</button>
          </div>
        </div>
        
        <div class="alternative-actions">
          <button id="try-random-instead" class="random-suggestion-btn">
            🎲 Get a Random Recipe Instead
          </button>
        </div>
      </div>
    `;

    resultsGrid.innerHTML = noResultsHTML;

    // Add event listeners for quick search buttons
    const quickSearchBtns = resultsGrid.querySelectorAll('.quick-search-btn');
    quickSearchBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const searchTerm = btn.dataset.search;
        if (this.searchInput) {
          this.searchInput.value = searchTerm;
          this.handleSearch();
        }
      });
    });

    // Add event listener for random recipe button
    const randomBtn = resultsGrid.querySelector('#try-random-instead');
    if (randomBtn) {
      randomBtn.addEventListener('click', () => {
        this.handleRandomRecipe();
      });
    }

    const message = CONFIG.MESSAGES.TRY_DIFFERENT_SEARCH.replace('{query}', searchTerm);
    DOMUtils.showMessage(message, true);
  }

  /**
   * Count Indian recipes in results
   */
  countIndianRecipes(recipes) {
    return recipes.filter(recipe => 
      CONFIG.INDIAN_KEYWORDS.some(keyword => 
        recipe.strMeal.toLowerCase().includes(keyword.toLowerCase())
      )
    ).length;
  }

  /**
   * Clear search input
   */
  clearSearch() {
    if (this.searchInput) {
      this.searchInput.value = '';
    }
  }

  /**
   * Focus search input
   */
  focusSearch() {
    if (this.searchInput) {
      this.searchInput.focus();
    }
  }
}

// Create global instance
window.searchComponent = new SearchComponent();
