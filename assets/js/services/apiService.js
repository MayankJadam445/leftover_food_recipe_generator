/**
 * API Service
 * Handles all API calls to TheMealDB
 */

class ApiService {
  constructor() {
    this.baseUrl = CONFIG.API.BASE_URL;
    this.endpoints = CONFIG.API.ENDPOINTS;
    this.cache = new Map();
    
    // Debug log
    console.log('🔗 API Service initialized');
    console.log('Base URL:', this.baseUrl);
    console.log('Endpoints:', this.endpoints);
  }

  /**
   * Generic fetch method with error handling
   */
  async fetchData(url, cacheKey = null) {
    try {
      // Check cache first
      if (cacheKey && this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (Date.now() - cached.timestamp < CONFIG.APP.CACHE_DURATION) {
          return cached.data;
        }
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Cache the result
      if (cacheKey) {
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now()
        });
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error('Failed to fetch data from server');
    }
  }

  /**
   * Search recipes by ingredient
   */
  async searchByIngredient(ingredient) {
    const url = `${this.baseUrl}${this.endpoints.SEARCH_BY_INGREDIENT}${ingredient}`;
    const cacheKey = `ingredient_${ingredient}`;
    return this.fetchData(url, cacheKey);
  }

  /**
   * Search recipes by name
   */
  async searchByName(name) {
    const url = `${this.baseUrl}${this.endpoints.SEARCH_BY_NAME}${name}`;
    const cacheKey = `name_${name}`;
    return this.fetchData(url, cacheKey);
  }

  /**
   * Get recipe details by ID
   */
  async getRecipeDetails(id) {
    const url = `${this.baseUrl}${this.endpoints.RECIPE_DETAILS}${id}`;
    const cacheKey = `recipe_${id}`;
    return this.fetchData(url, cacheKey);
  }

  /**
   * Get all Indian recipes
   */
  async getIndianRecipes() {
    const url = `${this.baseUrl}${this.endpoints.INDIAN_RECIPES}`;
    const cacheKey = 'indian_recipes';
    return this.fetchData(url, cacheKey);
  }

  /**
   * Get categories
   */
  async getCategories() {
    const url = `${this.baseUrl}${this.endpoints.CATEGORIES}`;
    const cacheKey = 'categories';
    return this.fetchData(url, cacheKey);
  }

  /**
   * Filter recipes by area/cuisine
   */
  async filterByArea(area) {
    const url = `${this.baseUrl}${this.endpoints.FILTER_BY_AREA}${area}`;
    const cacheKey = `area_${area}`;
    return this.fetchData(url, cacheKey);
  }

  /**
   * Filter recipes by category
   */
  async filterByCategory(category) {
    const url = `${this.baseUrl}${this.endpoints.FILTER_BY_CATEGORY}${category}`;
    const cacheKey = `category_${category}`;
    return this.fetchData(url, cacheKey);
  }

  /**
   * Get random recipe
   */
  async getRandomRecipe() {
    const url = `${this.baseUrl}${this.endpoints.RANDOM_RECIPE}`;
    // Don't cache random recipes as they should be different each time
    return this.fetchData(url);
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }
}

// Create global instance
window.apiService = new ApiService();
