/**
 * Recipe Display Component
 * Handles rendering of recipe cards and details
 */

class RecipeDisplayComponent {
  constructor() {
    this.resultsGrid = DOMUtils.getElementById(CONFIG.ELEMENTS.RESULTS_GRID);
  }

  /**
   * Display recipes in grid
   */
  displayRecipes(recipes) {
    if (!this.resultsGrid) return;

    if (!recipes || recipes.length === 0) {
      DOMUtils.showMessage('No recipes to display');
      return;
    }

    this.resultsGrid.innerHTML = '';

    recipes.forEach(recipe => {
      const recipeCard = this.createRecipeCard(recipe);
      this.resultsGrid.appendChild(recipeCard);
    });
  }

  /**
   * Create individual recipe card
   */
  createRecipeCard(recipe) {
    const recipeDiv = DOMUtils.createElement('div', {
      className: 'recipe-item',
      'data-id': recipe.idMeal
    });

    const imageUrl = recipe.strMealThumb || 'assets/images/recipe-placeholder.jpg';
    const recipeName = DOMUtils.sanitizeHTML(recipe.strMeal);

    recipeDiv.innerHTML = `
      <img src="${imageUrl}" alt="${recipeName}" loading="lazy" onerror="this.src='assets/images/recipe-placeholder.jpg'">
      <h3>${recipeName}</h3>
      ${this.getRecipeMetaInfo(recipe)}
    `;

    // Add click event for modal
    DOMUtils.addEventListenerSafe(recipeDiv, 'click', () => {
      this.showRecipeModal(recipe.idMeal);
    });

    return recipeDiv;
  }

  /**
   * Get recipe meta information
   */
  getRecipeMetaInfo(recipe) {
    // Check if it's likely an Indian recipe
    const isIndian = CONFIG.INDIAN_KEYWORDS.some(keyword => 
      recipe.strMeal.toLowerCase().includes(keyword.toLowerCase())
    );

    const indianBadge = isIndian ? '<span class="indian-badge">🇮🇳 Indian</span>' : '';
    
    return `
      <div class="recipe-meta">
        ${indianBadge}
        <span class="recipe-category">${recipe.strCategory || 'Recipe'}</span>
      </div>
    `;
  }

  /**
   * Show recipe modal with details
   */
  async showRecipeModal(recipeId) {
    try {
      const modal = DOMUtils.getElementById(CONFIG.ELEMENTS.MODAL);
      const modalContent = DOMUtils.getElementById(CONFIG.ELEMENTS.MODAL_CONTENT);
      
      if (!modal || !modalContent) return;

      // Show loading state
      modalContent.innerHTML = '<p class="message loading">Loading recipe details...</p>';
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';

      // Fetch recipe details
      const recipe = await window.recipeService.getRecipeDetails(recipeId);
      
      if (recipe) {
        modalContent.innerHTML = this.createRecipeDetailsHTML(recipe);
      } else {
        modalContent.innerHTML = '<p class="message error">Could not load recipe details.</p>';
      }
    } catch (error) {
      console.error('Error showing recipe modal:', error);
      const modalContent = DOMUtils.getElementById(CONFIG.ELEMENTS.MODAL_CONTENT);
      if (modalContent) {
        modalContent.innerHTML = '<p class="message error">Failed to load recipe details.</p>';
      }
    }
  }

  /**
   * Create recipe details HTML
   */
  createRecipeDetailsHTML(recipe) {
    const ingredients = this.extractIngredients(recipe);
    const recipeName = DOMUtils.sanitizeHTML(recipe.strMeal);
    const instructions = this.formatInstructions(recipe.strInstructions);

    return `
      <h2>${recipeName}</h2>
      <img src="${recipe.strMealThumb}" alt="${recipeName}" onerror="this.src='assets/images/recipe-placeholder.jpg'">
      
      ${recipe.strCategory ? `<h3>Category: ${DOMUtils.sanitizeHTML(recipe.strCategory)}</h3>` : ''}
      ${recipe.strArea ? `<h3>Cuisine: ${DOMUtils.sanitizeHTML(recipe.strArea)}</h3>` : ''}
      
      ${ingredients.length ? `
        <h3>Ingredients</h3>
        <ul class="ingredients-list">
          ${ingredients.map(ing => `<li>${DOMUtils.sanitizeHTML(ing)}</li>`).join('')}
        </ul>
      ` : ''}
      
      <h3>Instructions</h3>
      <div class="instructions">
        ${instructions}
      </div>
      
      ${recipe.strYoutube ? `
        <h3>Video Recipe</h3>
        <div class="video-wrapper">
          <a href="${recipe.strYoutube}" target="_blank" rel="noopener noreferrer">Watch on YouTube</a>
        </div>
      ` : ''}
      
      ${recipe.strSource ? `
        <div class="source-wrapper">
          <a href="${recipe.strSource}" target="_blank" rel="noopener noreferrer">View Original Source</a>
        </div>
      ` : ''}
    `;
  }

  /**
   * Extract ingredients from recipe
   */
  extractIngredients(recipe) {
    const ingredients = [];
    
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`]?.trim();
      const measure = recipe[`strMeasure${i}`]?.trim();
      
      if (ingredient) {
        const fullIngredient = measure ? `${measure} ${ingredient}` : ingredient;
        ingredients.push(fullIngredient);
      } else {
        break;
      }
    }
    
    return ingredients;
  }

  /**
   * Format instructions with proper line breaks
   */
  formatInstructions(instructions) {
    if (!instructions) return 'Instructions not available.';
    
    return DOMUtils.sanitizeHTML(instructions)
      .replace(/\r?\n/g, '<br>')
      .replace(/(\d+\.)/g, '<strong>$1</strong>'); // Bold step numbers
  }

  /**
   * Close modal
   */
  closeModal() {
    const modal = DOMUtils.getElementById(CONFIG.ELEMENTS.MODAL);
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }
}

// Create global instance
window.recipeDisplayComponent = new RecipeDisplayComponent();
