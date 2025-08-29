/**
 * Application Configuration
 * Contains all API endpoints and application constants
 */

const CONFIG = {
  // API Endpoints
  API: {
    BASE_URL: 'https://www.themealdb.com/api/json/v1/1',
    ENDPOINTS: {
      SEARCH_BY_INGREDIENT: '/filter.php?i=',
      SEARCH_BY_NAME: '/search.php?s=',
      RANDOM_RECIPE: '/random.php',
      RECIPE_DETAILS: '/lookup.php?i=',
      INDIAN_RECIPES: '/filter.php?a=Indian',
      CATEGORIES: '/categories.php',
      AREAS: '/list.php?a=list'
    }
  },

  // Application Settings
  APP: {
    NAME: 'Leftover Food Recipe Generator',
    VERSION: '2.0.0',
    MAX_SEARCH_RESULTS: 20,
    CACHE_DURATION: 300000, // 5 minutes in milliseconds
  },

  // Indian cuisine keywords for recipe prioritization
  INDIAN_KEYWORDS: [
    'curry', 'dal', 'biryani', 'tandoori', 'masala', 'naan', 'chapati', 
    'roti', 'samosa', 'dosa', 'idli', 'paratha', 'pulao', 'kebab', 
    'paneer', 'tikka', 'vindaloo', 'korma', 'jalfrezi', 'bhaji', 
    'raita', 'lassi', 'chai', 'butter chicken', 'palak', 'aloo', 
    'gobi', 'matar', 'chana', 'rajma', 'sambar', 'rasam', 'upma',
    'poha', 'kheer', 'gulab jamun', 'halwa', 'pakora', 'chutney'
  ],

  // UI Messages
  MESSAGES: {
    SEARCHING: 'Searching for recipes...',
    NO_RESULTS: 'No recipes found. Try searching for ingredients like "chicken", "rice", "paneer", or "dal".',
    NO_RESULTS_WITH_SUGGESTIONS: 'No recipes found for "{query}". Here are some popular recipes you might like:',
    NETWORK_ERROR: 'Something went wrong. Please check your connection and try again.',
    LOADING_DETAILS: 'Loading recipe details...',
    INDIAN_SUGGESTIONS: 'No exact matches found. Here are some popular Indian recipes:',
    TRY_DIFFERENT_SEARCH: 'No recipes found for "{query}". Try searching for:',
    SEARCH_SUGGESTIONS: [
      'Common ingredients: chicken, beef, rice, potato, onion, tomato',
      'Indian ingredients: paneer, dal, masala, curry, biryani',
      'Cooking methods: fried, grilled, baked, stewed',
      'Meal types: breakfast, lunch, dinner, dessert'
    ]
  },

  // DOM Element IDs
  ELEMENTS: {
    SEARCH_FORM: 'search-form',
    SEARCH_INPUT: 'search-input',
    SEARCH_BUTTON: 'search-button',
    RESULTS_GRID: 'results-grid',
    MESSAGE_AREA: 'message-area',
    MODAL: 'recipe-modal',
    MODAL_CONTENT: 'recipe-details-content',
    MODAL_CLOSE_BTN: 'modal-close-btn'
  }
};

// Make config available globally
window.CONFIG = CONFIG;
