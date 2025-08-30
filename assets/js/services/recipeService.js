/**
 * Recipe Service
 * Handles recipe-related business logic
 */

class RecipeService {
  constructor() {
    this.apiService = window.apiService;
    
    // Debug log
    console.log('🍳 Recipe Service initialized');
    console.log('API Service available:', !!this.apiService);
  }

  /**
   * Search recipes with Indian prioritization, multiword support, and filters
   */
  async searchRecipes(query, filters = null) {
    try {
      // Parse and clean the search query
      const searchTerms = this.parseSearchQuery(query);
      
      // Get results for each search approach
      const searchResults = await this.performMultiwordSearch(searchTerms);
      
      // Combine and deduplicate results
      let allRecipes = this.combineSearchResults(searchResults);

      // Apply filters if provided
      if (filters && window.filterComponent) {
        allRecipes = window.filterComponent.filterByDietType(allRecipes, filters.dietType || 'all');
      }

      // Get Indian recipes for prioritization
      const indianData = await Promise.allSettled([this.apiService.getIndianRecipes()]);
      const indianRecipesList = indianData[0].status === 'fulfilled' ? indianData[0].value.meals || [] : [];
      
      if (allRecipes.length > 0) {
        return {
          recipes: this.prioritizeIndianRecipes(allRecipes, indianRecipesList),
          hasResults: true,
          searchTerm: query
        };
      } else {
        // Return suggestions with search context
        const suggestions = await this.getIndianSuggestions();
        return {
          recipes: suggestions,
          hasResults: false,
          searchTerm: query,
          showSuggestions: suggestions.length > 0
        };
      }
    } catch (error) {
      console.error('Recipe search error:', error);
      return {
        recipes: [],
        hasResults: false,
        searchTerm: query,
        showSuggestions: false,
        error: true
      };
    }
  }

  /**
   * Parse search query into individual terms and phrases
   */
  parseSearchQuery(query) {
    // Clean and normalize the query
    const cleanQuery = query.trim().toLowerCase();
    
    // Split by spaces and filter out empty strings
    const terms = cleanQuery.split(/\s+/).filter(term => term.length > 0);
    
    return {
      original: query.trim(),
      terms: terms,
      fullQuery: cleanQuery,
      termCount: terms.length
    };
  }

  /**
   * Perform multiword search using different strategies
   */
  async performMultiwordSearch(searchTerms) {
    const { original, terms, fullQuery, termCount } = searchTerms;
    
    // Strategy 1: Search with full query (for exact phrase matches)
    const fullQueryPromises = [
      this.apiService.searchByIngredient(fullQuery),
      this.apiService.searchByName(fullQuery)
    ];

    // Strategy 2: Search with original query (handles spaces differently)
    const originalPromises = original !== fullQuery ? [
      this.apiService.searchByIngredient(original),
      this.apiService.searchByName(original)
    ] : [];

    // Strategy 3: Individual term searches (for multiword support)
    const individualTermPromises = [];
    if (termCount > 1) {
      terms.forEach(term => {
        if (term.length > 2) { // Skip very short terms
          individualTermPromises.push(
            this.apiService.searchByIngredient(term),
            this.apiService.searchByName(term)
          );
        }
      });
    }

    // Execute all searches in parallel
    const allPromises = [...fullQueryPromises, ...originalPromises, ...individualTermPromises];
    const results = await Promise.allSettled(allPromises);
    
    return {
      fullQuery: results.slice(0, fullQueryPromises.length),
      original: results.slice(fullQueryPromises.length, fullQueryPromises.length + originalPromises.length),
      individual: results.slice(fullQueryPromises.length + originalPromises.length),
      searchTerms
    };
  }

  /**
   * Combine and deduplicate search results with scoring
   */
  combineSearchResults(searchResults) {
    const { fullQuery, original, individual, searchTerms } = searchResults;
    const recipeMap = new Map();
    
    // Helper function to add recipes with scoring
    const addRecipes = (results, scoreMultiplier = 1) => {
      results.forEach(result => {
        if (result.status === 'fulfilled' && result.value.meals) {
          result.value.meals.forEach(meal => {
            const id = meal.idMeal;
            if (!recipeMap.has(id)) {
              // Calculate relevance score
              const score = this.calculateRelevanceScore(meal, searchTerms) * scoreMultiplier;
              recipeMap.set(id, { ...meal, relevanceScore: score });
            } else {
              // Update score if this match is better
              const existing = recipeMap.get(id);
              const newScore = this.calculateRelevanceScore(meal, searchTerms) * scoreMultiplier;
              if (newScore > existing.relevanceScore) {
                recipeMap.set(id, { ...existing, relevanceScore: newScore });
              }
            }
          });
        }
      });
    };

    // Add results with different weights
    addRecipes(fullQuery, 3.0);    // Full query matches get highest priority
    addRecipes(original, 2.5);     // Original query matches
    addRecipes(individual, 1.0);   // Individual term matches

    // Convert to array and sort by relevance score
    const recipes = Array.from(recipeMap.values());
    return recipes.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
  }

  /**
   * Calculate relevance score for a recipe based on search terms
   */
  calculateRelevanceScore(recipe, searchTerms) {
    const { terms, fullQuery } = searchTerms;
    let score = 0;
    
    const recipeName = recipe.strMeal.toLowerCase();
    const recipeArea = (recipe.strArea || '').toLowerCase();
    const recipeCategory = (recipe.strCategory || '').toLowerCase();
    
    // Exact phrase match in name (highest score)
    if (recipeName.includes(fullQuery)) {
      score += 10;
    }
    
    // Individual term matches in name
    terms.forEach(term => {
      if (recipeName.includes(term)) {
        score += 5;
      }
      if (recipeArea.includes(term)) {
        score += 2;
      }
      if (recipeCategory.includes(term)) {
        score += 2;
      }
    });
    
    // Name starts with search term (boost for better relevance)
    if (recipeName.startsWith(fullQuery) || terms.some(term => recipeName.startsWith(term))) {
      score += 3;
    }
    
    // Enhanced cuisine keyword bonus
    const cuisineKeywordMatches = CONFIG.CUISINE_KEYWORDS.filter(keyword => 
      recipeName.includes(keyword.toLowerCase())
    ).length;
    
    if (cuisineKeywordMatches > 0) {
      // Base cuisine bonus
      score += 2;
      
      // Additional bonus for multiple cuisine keywords
      if (cuisineKeywordMatches > 1) {
        score += cuisineKeywordMatches * 1.5;
      }
      
      // Extra bonus for authentic Indian dishes
      const authenticIndianTerms = [
        'masala', 'curry', 'dal', 'biryani', 'tandoori', 'paneer',
        'tikka', 'makhani', 'butter chicken', 'vindaloo', 'korma'
      ];
      
      const authenticMatches = authenticIndianTerms.filter(term => 
        recipeName.includes(term)
      ).length;
      
      if (authenticMatches > 0) {
        score += authenticMatches * 2;
      }
    }
    
    // Regional Indian cuisine bonus
    const regionalTerms = [
      'south indian', 'punjabi', 'bengali', 'gujarati', 'rajasthani',
      'hyderabadi', 'lucknowi', 'goan', 'mumbai', 'delhi'
    ];
    
    const regionalMatches = regionalTerms.filter(term => 
      recipeName.includes(term) || recipeArea.includes(term)
    ).length;
    
    if (regionalMatches > 0) {
      score += regionalMatches * 1.5;
    }
    
    return score;
  }

  /**
   * Prioritize Indian recipes in search results
   */
  prioritizeIndianRecipes(recipes, indianRecipes) {
    const indianRecipeIds = new Set(indianRecipes.map(recipe => recipe.idMeal));
    
    // Separate Indian and non-Indian recipes
    const indian = recipes.filter(recipe => indianRecipeIds.has(recipe.idMeal));
    const nonIndian = recipes.filter(recipe => !indianRecipeIds.has(recipe.idMeal));
    
    // Check for cuisine keywords in recipe names
    const likelyCuisineSpecific = nonIndian.filter(recipe => 
      CONFIG.CUISINE_KEYWORDS.some(keyword => 
        recipe.strMeal.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    
    const others = nonIndian.filter(recipe => 
      !CONFIG.CUISINE_KEYWORDS.some(keyword => 
        recipe.strMeal.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    
    // Return prioritized: Indian first, then likely cuisine-specific, then others
    return [...indian, ...likelyCuisineSpecific, ...others];
  }

  /**
   * Get Indian recipe suggestions with priority for popular dishes
   */
  async getIndianSuggestions() {
    try {
      const data = await this.apiService.getIndianRecipes();
      if (!data.meals) return [];
      
      // Popular Indian dishes to prioritize in suggestions
      const popularIndianDishes = [
        'butter chicken', 'chicken tikka masala', 'dal makhani', 'palak paneer',
        'biryani', 'tandoori chicken', 'masala dosa', 'samosa', 'chole bhature',
        'rajma', 'aloo gobi', 'vindaloo', 'korma', 'gulab jamun'
      ];
      
      // Sort suggestions to prioritize popular dishes
      const sortedMeals = data.meals.sort((a, b) => {
        const aName = a.strMeal.toLowerCase();
        const bName = b.strMeal.toLowerCase();
        
        const aIsPopular = popularIndianDishes.some(dish => aName.includes(dish));
        const bIsPopular = popularIndianDishes.some(dish => bName.includes(dish));
        
        if (aIsPopular && !bIsPopular) return -1;
        if (!aIsPopular && bIsPopular) return 1;
        
        // Secondary sort by number of cuisine keywords
        const aKeywords = CONFIG.CUISINE_KEYWORDS.filter(keyword => 
          aName.includes(keyword.toLowerCase())
        ).length;
        const bKeywords = CONFIG.CUISINE_KEYWORDS.filter(keyword => 
          bName.includes(keyword.toLowerCase())
        ).length;
        
        return bKeywords - aKeywords;
      });
      
      return sortedMeals.slice(0, 12); // Return more suggestions
    } catch (error) {
      console.error('Error getting Indian suggestions:', error);
      return [];
    }
  }

  /**
   * Get recipe details
   */
  async getRecipeDetails(id) {
    try {
      const data = await this.apiService.getRecipeDetails(id);
      return data.meals && data.meals.length > 0 ? data.meals[0] : null;
    } catch (error) {
      console.error('Recipe details error:', error);
      throw new Error('Failed to get recipe details');
    }
  }
}

// Create global instance
window.recipeService = new RecipeService();
