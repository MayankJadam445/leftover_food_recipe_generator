/**
 * Recipe Service
 * Handles recipe-related business logic
 */

class RecipeService {
  constructor() {
    this.apiService = window.apiService;
  }

  /**
   * Search recipes with Indian prioritization
   */
  async searchRecipes(query) {
    try {
      // Parallel API calls for better performance
      const [ingredientData, nameData, indianData] = await Promise.allSettled([
        this.apiService.searchByIngredient(query),
        this.apiService.searchByName(query),
        this.apiService.getIndianRecipes()
      ]);

      // Combine results
      let allRecipes = [];

      // Add ingredient-based results
      if (ingredientData.status === 'fulfilled' && ingredientData.value.meals) {
        allRecipes = [...ingredientData.value.meals];
      }

      // Add name-based results (avoid duplicates)
      if (nameData.status === 'fulfilled' && nameData.value.meals) {
        nameData.value.meals.forEach(meal => {
          if (!allRecipes.find(recipe => recipe.idMeal === meal.idMeal)) {
            allRecipes.push(meal);
          }
        });
      }

      // Prioritize Indian recipes
      const indianRecipes = indianData.status === 'fulfilled' ? indianData.value.meals || [] : [];
      
      if (allRecipes.length > 0) {
        return {
          recipes: this.prioritizeIndianRecipes(allRecipes, indianRecipes),
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
   * Prioritize Indian recipes in search results
   */
  prioritizeIndianRecipes(recipes, indianRecipes) {
    const indianRecipeIds = new Set(indianRecipes.map(recipe => recipe.idMeal));
    
    // Separate Indian and non-Indian recipes
    const indian = recipes.filter(recipe => indianRecipeIds.has(recipe.idMeal));
    const nonIndian = recipes.filter(recipe => !indianRecipeIds.has(recipe.idMeal));
    
    // Check for Indian keywords in recipe names
    const likelyIndian = nonIndian.filter(recipe => 
      CONFIG.INDIAN_KEYWORDS.some(keyword => 
        recipe.strMeal.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    
    const others = nonIndian.filter(recipe => 
      !CONFIG.INDIAN_KEYWORDS.some(keyword => 
        recipe.strMeal.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    
    // Return prioritized: Indian first, then likely Indian, then others
    return [...indian, ...likelyIndian, ...others];
  }

  /**
   * Get Indian recipe suggestions
   */
  async getIndianSuggestions() {
    try {
      const data = await this.apiService.getIndianRecipes();
      return data.meals ? data.meals.slice(0, 8) : [];
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
