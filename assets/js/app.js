/**
 * Main Application
 * Entry point for the Indian Recipe Finder application
 */

class RecipeFinderApp {
  constructor() {
    this.isInitialized = false;
    this.version = CONFIG.APP.VERSION;
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      console.log(`🍛 ${CONFIG.APP.NAME} v${this.version} - Initializing...`);
      
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.start());
      } else {
        this.start();
      }
    } catch (error) {
      console.error('Failed to initialize application:', error);
      this.showInitializationError();
    }
  }

  /**
   * Start the application
   */
  async start() {
    try {
      console.log('🚀 Starting Recipe Finder Application...');
      
      // Add debug logging
      console.log('Checking services...');
      console.log('CONFIG available:', !!window.CONFIG);
      console.log('ApiService available:', !!window.apiService);
      console.log('RecipeService available:', !!window.recipeService);
      
      // Initialize components
      await this.initializeComponents();
      
      // Initialize hero feature buttons
      this.initializeHeroFeatures();
      
      // Set up global error handling
      this.setupErrorHandling();
      
      // Show welcome message
      this.showWelcomeMessage();
      
      // Focus search input
      window.searchComponent.focusSearch();
      
      this.isInitialized = true;
      console.log('✅ Application initialized successfully');
      
    } catch (error) {
      console.error('Failed to start application:', error);
      this.showInitializationError();
    }
  }

  /**
   * Initialize hero feature buttons
   */
  initializeHeroFeatures() {
    console.log('🚀 Initializing hero feature buttons...');
    
    // Global Cuisines button
    const globalCuisinesBtn = document.getElementById('global-cuisines-btn');
    console.log('Global cuisines button found:', !!globalCuisinesBtn);
    if (globalCuisinesBtn) {
      globalCuisinesBtn.addEventListener('click', () => {
        console.log('🌍 Global cuisines button clicked');
        this.showGlobalCuisines();
      });
    }

    // Quick Recipes button
    const quickRecipesBtn = document.getElementById('quick-recipes-btn');
    console.log('Quick recipes button found:', !!quickRecipesBtn);
    if (quickRecipesBtn) {
      quickRecipesBtn.addEventListener('click', () => {
        console.log('⚡ Quick recipes button clicked');
        this.showQuickRecipes();
      });
    }

    // Random Discovery button
    const randomDiscoveryBtn = document.getElementById('random-discovery-btn');
    console.log('Random discovery button found:', !!randomDiscoveryBtn);
    if (randomDiscoveryBtn) {
      randomDiscoveryBtn.addEventListener('click', () => {
        console.log('🎲 Random discovery button clicked');
        this.showRandomRecipe();
      });
    }
  }

  /**
   * Show global cuisines section with featured dishes
   */
  async showGlobalCuisines() {
    try {
      console.log('🌍 Starting Global Cuisines search...');
      
      // Show a curated selection of popular dishes from different cuisines
      const globalDishes = [
        // Italian
        { name: 'Carbonara', cuisine: 'Italian' },
        { name: 'Margherita Pizza', cuisine: 'Italian' },
        { name: 'Lasagne', cuisine: 'Italian' },
        
        // Indian
        { name: 'Butter Chicken', cuisine: 'Indian' },
        { name: 'Biryani', cuisine: 'Indian' },
        { name: 'Tikka Masala', cuisine: 'Indian' },
        
        // Chinese
        { name: 'Sweet and Sour Pork', cuisine: 'Chinese' },
        { name: 'Kung Pao Chicken', cuisine: 'Chinese' },
        { name: 'Fried Rice', cuisine: 'Chinese' },
        
        // Mexican
        { name: 'Tacos', cuisine: 'Mexican' },
        { name: 'Quesadilla', cuisine: 'Mexican' },
        { name: 'Burrito', cuisine: 'Mexican' },
        
        // French
        { name: 'Coq au Vin', cuisine: 'French' },
        { name: 'Ratatouille', cuisine: 'French' },
        { name: 'Croissant', cuisine: 'French' },
        
        // Japanese
        { name: 'Sushi', cuisine: 'Japanese' },
        { name: 'Ramen', cuisine: 'Japanese' },
        { name: 'Tempura', cuisine: 'Japanese' },
        
        // Thai
        { name: 'Pad Thai', cuisine: 'Thai' },
        { name: 'Green Curry', cuisine: 'Thai' },
        { name: 'Tom Yum', cuisine: 'Thai' },
        
        // Greek
        { name: 'Moussaka', cuisine: 'Greek' },
        { name: 'Souvlaki', cuisine: 'Greek' },
        { name: 'Greek Salad', cuisine: 'Greek' }
      ];

      // Display message about global cuisines
      DOMUtils.showMessage('🌍 Exploring Global Cuisines - Discover popular dishes from around the world!');

      // Search for a random selection of these dishes
      const randomDishes = this.getRandomSelection(globalDishes, 6);
      console.log('Selected dishes:', randomDishes);

      const searchPromises = randomDishes.map(async (dish) => {
        try {
          console.log(`Searching for: ${dish.name}`);
          const result = await window.recipeService.searchRecipes(dish.name);
          console.log(`Search result for ${dish.name}:`, result);
          return result.recipes || [];
        } catch (error) {
          console.error(`Error searching for ${dish.name}:`, error);
          return [];
        }
      });

      const results = await Promise.all(searchPromises);
      const allRecipes = results.flat().filter(recipe => recipe);
      
      console.log('Total recipes found:', allRecipes.length);

      if (allRecipes.length > 0) {
        // Display the global cuisine recipes
        window.recipeDisplayComponent.displayRecipes(allRecipes);
        
        // Scroll to results
        setTimeout(() => {
          window.searchComponent.scrollToResults();
        }, 100);
      } else {
        console.log('No recipes found, trying fallback...');
        // Fallback: try to get some random recipes
        try {
          const randomRecipes = [];
          for (let i = 0; i < 3; i++) {
            const randomResult = await window.apiService.getRandomRecipe();
            if (randomResult && randomResult.meals && randomResult.meals[0]) {
              randomRecipes.push(randomResult.meals[0]);
            }
          }
          
          if (randomRecipes.length > 0) {
            window.recipeDisplayComponent.displayRecipes(randomRecipes);
            setTimeout(() => {
              window.searchComponent.scrollToResults();
            }, 100);
            DOMUtils.showMessage('🌍 Here are some random global recipes for you to explore!');
          } else {
            DOMUtils.showMessage('Unable to load global cuisine recipes. Please try searching manually.', true);
          }
        } catch (fallbackError) {
          console.error('Fallback error:', fallbackError);
          DOMUtils.showMessage('Unable to load global cuisines. Please try again.', true);
        }
      }

    } catch (error) {
      console.error('Error showing global cuisines:', error);
      DOMUtils.showMessage('Unable to load global cuisines. Please try again.', true);
    }
  }

  /**
   * Get random selection from array
   * @param {Array} array - Array to select from (can be objects or strings)
   * @param {number} count - Number of items to select
   * @returns {Array} Random selection from the array
   */
  getRandomSelection(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, array.length));
  }

  /**
   * Show quick recipes (recipes that can be made in 30 minutes or less)
   */
  async showQuickRecipes() {
    try {
      // Search for quick recipes
      const quickRecipeTerms = ['chicken', 'pasta', 'rice', 'egg', 'quick'];
      const randomTerm = quickRecipeTerms[Math.floor(Math.random() * quickRecipeTerms.length)];
      
      // Set search input and trigger search
      if (window.searchComponent && window.searchComponent.searchInput) {
        window.searchComponent.searchInput.value = randomTerm;
        await window.searchComponent.handleSearch();
      }
      
      // Scroll to results
      const resultsContainer = document.getElementById('results-container');
      if (resultsContainer) {
        resultsContainer.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    } catch (error) {
      console.error('Error showing quick recipes:', error);
      DOMUtils.showMessage('Unable to load quick recipes. Please try again.', true);
    }
  }

  /**
   * Show random recipe with enhanced dish collection
   */
  async showRandomRecipe() {
    try {
      console.log('🎲 Starting Random Discovery...');
      
      // Expanded collection of dishes from around the world
      const randomDishCollection = [
        // Italian Classics
        'Carbonara', 'Lasagne', 'Margherita Pizza', 'Risotto', 'Osso Buco', 'Tiramisu',
        'Bruschetta', 'Minestrone', 'Gnocchi', 'Parmigiana', 'Focaccia', 'Calzone',
        
        // Indian Delights
        'Butter Chicken', 'Biryani', 'Tikka Masala', 'Dal Makhani', 'Tandoori Chicken',
        'Palak Paneer', 'Chole Bhature', 'Samosa', 'Dosa', 'Idli', 'Vada Pav', 'Rajma',
        
        // Chinese Favorites
        'Sweet and Sour Pork', 'Kung Pao Chicken', 'Fried Rice', 'Dumplings', 'Spring Rolls',
        'Mapo Tofu', 'Hot Pot', 'Peking Duck', 'Chow Mein', 'Wontons', 'Dim Sum',
        
        // Mexican Cuisine
        'Tacos', 'Quesadilla', 'Burrito', 'Enchiladas', 'Guacamole', 'Nachos',
        'Pozole', 'Tamales', 'Carnitas', 'Mole', 'Fajitas', 'Chiles Rellenos',
        
        // French Sophistication
        'Coq au Vin', 'Ratatouille', 'Croissant', 'Bouillabaisse', 'Quiche Lorraine',
        'French Onion Soup', 'Escargot', 'Beef Bourguignon', 'Crème Brûlée', 'Soufflé',
        
        // Japanese Cuisine
        'Sushi', 'Ramen', 'Tempura', 'Miso Soup', 'Teriyaki Chicken', 'Katsu',
        'Yakitori', 'Udon', 'Soba', 'Takoyaki', 'Okonomiyaki', 'Mochi',
        
        // Thai Flavors
        'Pad Thai', 'Green Curry', 'Tom Yum', 'Som Tam', 'Massaman Curry',
        'Pad See Ew', 'Mango Sticky Rice', 'Thai Basil Chicken', 'Larb', 'Satay',
        
        // Greek Mediterranean
        'Moussaka', 'Souvlaki', 'Greek Salad', 'Gyros', 'Spanakopita', 'Tzatziki',
        'Dolmades', 'Baklava', 'Pastitsio', 'Avgolemono', 'Feta Cheese Pie',
        
        // Spanish Delights
        'Paella', 'Tapas', 'Gazpacho', 'Tortilla Española', 'Jamón Ibérico',
        'Churros', 'Patatas Bravas', 'Sangria', 'Crema Catalana', 'Albondigas',
        
        // Middle Eastern
        'Hummus', 'Falafel', 'Shawarma', 'Kebab', 'Tabbouleh', 'Baklava',
        'Mansaf', 'Kibbeh', 'Fattoush', 'Baba Ganoush', 'Muhammara',
        
        // British Classics
        'Fish and Chips', 'Shepherd\'s Pie', 'Bangers and Mash', 'Beef Wellington',
        'Sunday Roast', 'Cornish Pasty', 'Bubble and Squeak', 'Spotted Dick',
        
        // American Comfort Food
        'Mac and Cheese', 'BBQ Ribs', 'Fried Chicken', 'Clam Chowder', 'Apple Pie',
        'Burgers', 'Pancakes', 'Buffalo Wings', 'Cheesecake', 'Hot Dogs',
        
        // Korean Cuisine
        'Kimchi', 'Bulgogi', 'Bibimbap', 'Korean BBQ', 'Japchae', 'Tteokbokki',
        'Kimchi Jjigae', 'Galbi', 'Korean Fried Chicken', 'Banchan',
        
        // Turkish Delights
        'Kebab', 'Baklava', 'Turkish Delight', 'Döner', 'Meze', 'Börek',
        'Turkish Coffee', 'Pide', 'Manti', 'Lahmacun', 'Iskender',
        
        // Vietnamese Fresh
        'Pho', 'Banh Mi', 'Spring Rolls', 'Bun Bo Hue', 'Com Tam', 'Cao Lau',
        'Vietnamese Coffee', 'Banh Xeo', 'Goi Cuon', 'Bun Cha',
        
        // German Hearty
        'Schnitzel', 'Bratwurst', 'Sauerkraut', 'Pretzels', 'Black Forest Cake',
        'Currywurst', 'Sauerbraten', 'Spätzle', 'Weisswurst', 'Strudel',
        
        // International Desserts
        'Gelato', 'Macarons', 'Churros', 'Cannoli', 'Panna Cotta', 'Tres Leches',
        'Flan', 'Pavlova', 'Sticky Toffee Pudding', 'Banoffee Pie',
        
        // Seafood Specialties
        'Paella', 'Fish Curry', 'Lobster Roll', 'Crab Cakes', 'Shrimp Scampi',
        'Fish Tacos', 'Salmon Teriyaki', 'Ceviche', 'Fish and Chips', 'Cioppino',
        
        // Vegetarian/Vegan Options
        'Vegetable Curry', 'Caprese Salad', 'Quinoa Salad', 'Veggie Burger',
        'Ratatouille', 'Stuffed Peppers', 'Vegetable Stir Fry', 'Lentil Soup'
      ];

      // Display loading message
      DOMUtils.showMessage('🎲 Discovering random recipes from around the world...', false, true);

      // Get multiple random dishes for variety
      const numberOfDishes = Math.floor(Math.random() * 4) + 3; // 3-6 dishes
      const selectedDishes = this.getRandomSelection(randomDishCollection, numberOfDishes);
      console.log(`Selected ${numberOfDishes} random dishes:`, selectedDishes);

      const searchPromises = selectedDishes.map(async (dishName) => {
        try {
          console.log(`Searching for: ${dishName}`);
          const result = await window.recipeService.searchRecipes(dishName);
          console.log(`Search result for ${dishName}:`, result);
          return result.recipes || [];
        } catch (error) {
          console.error(`Error searching for ${dishName}:`, error);
          return [];
        }
      });

      const results = await Promise.all(searchPromises);
      const allRecipes = results.flat().filter(recipe => recipe);
      
      console.log('Total random recipes found:', allRecipes.length);

      if (allRecipes.length > 0) {
        // Shuffle the recipes for more randomness
        const shuffledRecipes = allRecipes.sort(() => 0.5 - Math.random());
        
        // Display the random recipes
        window.recipeDisplayComponent.displayRecipes(shuffledRecipes);
        
        // Update message with success
        DOMUtils.showMessage(`🎲 Random Discovery: Found ${allRecipes.length} exciting recipes for you to try!`);
        
        // Scroll to results
        setTimeout(() => {
          window.searchComponent.scrollToResults();
        }, 100);
      } else {
        console.log('No specific recipes found, trying API random...');
        // Fallback: Use API's random recipe feature
        try {
          const randomRecipes = [];
          const numberOfRandomRecipes = Math.floor(Math.random() * 3) + 2; // 2-4 recipes
          
          for (let i = 0; i < numberOfRandomRecipes; i++) {
            const randomResult = await window.apiService.getRandomRecipe();
            if (randomResult && randomResult.meals && randomResult.meals[0]) {
              randomRecipes.push(randomResult.meals[0]);
            }
          }
          
          if (randomRecipes.length > 0) {
            window.recipeDisplayComponent.displayRecipes(randomRecipes);
            DOMUtils.showMessage(`🎲 Random Discovery: Here are ${randomRecipes.length} surprise recipes from our collection!`);
            setTimeout(() => {
              window.searchComponent.scrollToResults();
            }, 100);
          } else {
            DOMUtils.showMessage('Unable to load random recipes. Please try again or search manually.', true);
          }
        } catch (fallbackError) {
          console.error('Random recipe fallback error:', fallbackError);
          DOMUtils.showMessage('Unable to load random recipes. Please try again.', true);
        }
      }

    } catch (error) {
      console.error('Error in random discovery:', error);
      DOMUtils.showMessage('Unable to load random recipes. Please try again.', true);
    }
  }

  /**
   * Initialize all components
   */
  async initializeComponents() {
    // Components should already be initialized when their scripts load
    // This method can be used for any additional setup
    
    if (!window.apiService) {
      throw new Error('API Service not initialized');
    }
    
    if (!window.recipeService) {
      throw new Error('Recipe Service not initialized');
    }
    
    if (!window.recipeDisplayComponent) {
      throw new Error('Recipe Display Component not initialized');
    }
    
    if (!window.searchComponent) {
      throw new Error('Search Component not initialized');
    }
    
    if (!window.filterComponent) {
      throw new Error('Filter Component not initialized');
    }
  }

  /**
   * Set up global error handling
   */
  setupErrorHandling() {
    // Global error handler
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
      DOMUtils.showMessage('An unexpected error occurred. Please refresh the page.', true);
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      DOMUtils.showMessage('An unexpected error occurred. Please try again.', true);
    });
  }

  /**
   * Show welcome message
   */
  showWelcomeMessage() {
    // Welcome message removed as requested
  }

  /**
   * Show initialization error
   */
  showInitializationError() {
    const messageArea = document.getElementById(CONFIG.ELEMENTS.MESSAGE_AREA);
    if (messageArea) {
      messageArea.innerHTML = `
        <div class="error">
          <h3>⚠️ Application Failed to Load</h3>
          <p>Please refresh the page. If the problem persists, check your internet connection.</p>
          <button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Refresh Page
          </button>
        </div>
      `;
    }
  }

  /**
   * Get application info
   */
  getInfo() {
    return {
      name: CONFIG.APP.NAME,
      version: this.version,
      initialized: this.isInitialized,
      timestamp: new Date().toISOString()
    };
  }
}

// Initialize application when script loads
const app = new RecipeFinderApp();

// Make app available globally for debugging
window.recipeFinderApp = app;

// Auto-initialize
app.init();
