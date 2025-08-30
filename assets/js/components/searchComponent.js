/**
 * Search Component
 * Handles search functionality and UI interactions
 */

class SearchComponent {
  constructor() {
    this.searchForm = DOMUtils.getElementById(CONFIG.ELEMENTS.SEARCH_FORM);
    this.searchInput = DOMUtils.getElementById(CONFIG.ELEMENTS.SEARCH_INPUT);
    
    // Debug log
    console.log('🔍 Search Component initialized');
    console.log('Search form found:', !!this.searchForm);
    console.log('Search input found:', !!this.searchInput);
    
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

    // Set up event delegation for quick search buttons
    this.setupQuickSearchButtons();
  }

  /**
   * Setup event delegation for quick search buttons
   */
  setupQuickSearchButtons() {
    document.addEventListener('click', (e) => {
      // Handle quick search buttons
      if (e.target.classList.contains('quick-search-btn')) {
        const searchTerm = e.target.getAttribute('data-search');
        const buttonId = e.target.id;
        
        // Handle random recipe button specifically
        if (buttonId === 'random-recipe-btn') {
          this.handleRandomRecipe();
          return;
        }
        
        // Handle regular search buttons
        if (searchTerm) {
          this.searchInput.value = searchTerm;
          this.handleSearch();
        }
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
        console.log('Displaying recipes and triggering scroll...');
        recipeDisplay.displayRecipes(result.recipes);
        
        // Auto-scroll to results
        this.scrollToResults();
        
        const specialCount = this.countSpecialCuisineRecipes(result.recipes);
        const isMultiword = searchTerm.trim().split(/\s+/).length > 1;
        
        let message = specialCount > 0 
          ? `Found ${result.recipes.length} recipes (${specialCount} special cuisine dishes) for "${searchTerm}"`
          : `Found ${result.recipes.length} recipes for "${searchTerm}"`;
          
        // Add multiword search tip for first-time users
        if (isMultiword && result.recipes.length > 5) {
          message += '. Results are sorted by relevance to your search terms.';
        }
        
        DOMUtils.showMessage(message);
        
      } else if (result.showSuggestions && result.recipes.length > 0) {
        // No exact matches but showing suggestions
        console.log('Displaying suggestions and triggering scroll...');
        recipeDisplay.displayRecipes(result.recipes);
        
        // Auto-scroll to results
        this.scrollToResults();
        
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
            <button class="quick-search-btn" data-search="pasta">🍝 Pasta</button>
            <button class="quick-search-btn" data-search="beef">� Beef</button>
            <button class="quick-search-btn" data-search="seafood">🐟 Seafood</button>
            <button class="quick-search-btn" data-search="vegetarian">� Vegetarian</button>
            <button class="quick-search-btn" data-search="rice">🍚 Rice</button>
            <button class="quick-search-btn" data-search="soup">� Soup</button>
            <button class="quick-search-btn" data-search="salad">🥗 Salad</button>
          </div>
          
          <h4>🍮 Sweet Treats:</h4>
          <div class="quick-buttons dessert-buttons">
            <button class="quick-search-btn dessert-btn" data-search="chocolate">� Chocolate</button>
            <button class="quick-search-btn dessert-btn" data-search="cake">🎂 Cake</button>
            <button class="quick-search-btn dessert-btn" data-search="cookies">� Cookies</button>
            <button class="quick-search-btn dessert-btn" data-search="ice cream">🍦 Ice Cream</button>
            <button class="quick-search-btn dessert-btn" data-search="pie">🥧 Pie</button>
            <button class="quick-search-btn dessert-btn" data-search="pudding">🍮 Pudding</button>
            <button class="quick-search-btn dessert-btn" data-search="fruit dessert">🍓 Fruit Dessert</button>
            <button class="quick-search-btn dessert-btn" data-search="sweet bread">🍞 Sweet Bread</button>
          </div>
          
          <h4>🎲 Random Discovery:</h4>
          <div class="quick-buttons random-buttons">
            <button class="quick-search-btn random-btn" id="random-recipe-btn">� Get Random Recipe</button>
            <button class="quick-search-btn random-btn" data-search="surprise me">✨ Surprise Me</button>
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
   * Count special cuisine recipes in results
   */
  countSpecialCuisineRecipes(recipes) {
    return recipes.filter(recipe => 
      CONFIG.CUISINE_KEYWORDS.some(keyword => 
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

  /**
   * Handle random recipe request
   */
  async handleRandomRecipe() {
    try {
      DOMUtils.showMessage('🎲 Finding a random recipe for you...', false, true);
      DOMUtils.clearResults();

      const apiService = window.apiService;
      const recipeDisplay = this.getRecipeDisplay();
      
      const result = await apiService.getRandomRecipe();
      
      DOMUtils.clearMessage();
      
      if (result && result.meals && result.meals.length > 0) {
        recipeDisplay.displayRecipes(result.meals);
        
        // Auto-scroll to results
        this.scrollToResults();
        
        DOMUtils.showMessage(`🎲 Here's a random recipe: ${result.meals[0].strMeal}`);
      } else {
        DOMUtils.showMessage('Sorry, could not fetch a random recipe. Please try again.', true);
      }
    } catch (error) {
      console.error('Random recipe error:', error);
      DOMUtils.showMessage('Failed to get random recipe. Please try again.', true);
    }
  }

  /**
   * Scroll to results section smoothly
   */
  scrollToResults() {
    console.log('🔽 scrollToResults called');
    
    // Small delay to ensure recipes are rendered
    setTimeout(() => {
      // Try multiple possible containers in order of preference
      const resultsGrid = document.getElementById('results-grid');
      const resultsContainer = document.getElementById('results-container');
      const recipeContainer = document.querySelector('.recipe-finder-container');
      const messageArea = document.getElementById('message-area');
      
      const targetElement = resultsGrid || resultsContainer || recipeContainer || messageArea;
      
      if (targetElement) {
        console.log('🎯 Found target element:', targetElement.id || targetElement.className);
        
        // Try modern smooth scroll first
        try {
          targetElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        } catch (error) {
          // Fallback for older browsers
          console.log('Using fallback scroll method');
          targetElement.scrollIntoView(true);
        }
        
        console.log('✅ Auto-scroll completed');
      } else {
        console.warn('❌ No results container found for auto-scroll');
      }
    }, 500);
  }
}

// Create global instance
window.searchComponent = new SearchComponent();
