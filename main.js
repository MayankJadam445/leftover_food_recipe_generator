const SEARCH_API_URL = "https://www.themealdb.com/api/json/v1/1/filter.php?i=";
const RANDOM_API_URL = "https://www.themealdb.com/api/json/v1/1/random.php";
const LOOKUP_API_URL = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
const INDIAN_AREA_API_URL = "https://www.themealdb.com/api/json/v1/1/filter.php?a=Indian";
const CATEGORY_SEARCH_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const resultsGrid = document.getElementById("results-grid");
const messageArea = document.getElementById("message-area");
const randomButton = document.getElementById("random-button");
const modal = document.getElementById("recipe-modal");
const modalContent = document.getElementById("recipe-details-content");
const modalCloseBtn = document.getElementById("modal-close-btn");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = searchInput.value.trim();

  if (searchTerm) {
    searchRecipes(searchTerm);
  } else {
    showMessage("Please enter a search term", true);
  }
});

async function searchRecipes(query) {
  showMessage(`Searching for "${query}"...`, false, true);
  resultsGrid.innerHTML = "";

  try {
    // Search for recipes with the ingredient
    const ingredientResponse = await fetch(`${SEARCH_API_URL}${query}`);
    if (!ingredientResponse.ok) throw new Error("Network error");
    const ingredientData = await ingredientResponse.json();

    // Also search by recipe name to catch Indian dishes
    const nameResponse = await fetch(`${CATEGORY_SEARCH_URL}${query}`);
    const nameData = await nameResponse.json();

    // Get all Indian recipes to prioritize them
    const indianResponse = await fetch(INDIAN_AREA_API_URL);
    const indianData = await indianResponse.json();

    clearMessage();

    // Combine and prioritize results
    let allRecipes = [];
    
    // Add recipes from ingredient search
    if (ingredientData.meals) {
      allRecipes = [...ingredientData.meals];
    }
    
    // Add recipes from name search (avoid duplicates)
    if (nameData.meals) {
      nameData.meals.forEach(meal => {
        if (!allRecipes.find(recipe => recipe.idMeal === meal.idMeal)) {
          allRecipes.push(meal);
        }
      });
    }

    if (allRecipes.length > 0) {
      // Prioritize Indian recipes
      const prioritizedRecipes = prioritizeIndianRecipes(allRecipes, indianData.meals || []);
      displayRecipes(prioritizedRecipes);
    } else {
      // If no recipes found, show some Indian suggestions
      showIndianSuggestions(query);
    }
  } catch (error) {
    showMessage("Something went wrong, Please try again.", true);
  }
}

function prioritizeIndianRecipes(recipes, indianRecipes) {
  const indianRecipeIds = new Set(indianRecipes.map(recipe => recipe.idMeal));
  
  // Separate Indian and non-Indian recipes
  const indian = recipes.filter(recipe => indianRecipeIds.has(recipe.idMeal));
  const nonIndian = recipes.filter(recipe => !indianRecipeIds.has(recipe.idMeal));
  
  // Also check for Indian keywords in recipe names
  const indianKeywords = ['curry', 'dal', 'biryani', 'tandoori', 'masala', 'naan', 'chapati', 'roti', 'samosa', 'dosa', 'idli', 'paratha', 'pulao', 'kebab', 'paneer', 'tikka', 'vindaloo', 'korma', 'jalfrezi', 'bhaji', 'raita', 'lassi', 'chai'];
  
  const likelyIndian = nonIndian.filter(recipe => 
    indianKeywords.some(keyword => 
      recipe.strMeal.toLowerCase().includes(keyword)
    )
  );
  
  const others = nonIndian.filter(recipe => 
    !indianKeywords.some(keyword => 
      recipe.strMeal.toLowerCase().includes(keyword)
    )
  );
  
  // Return prioritized: Indian first, then likely Indian, then others
  return [...indian, ...likelyIndian, ...others];
}

async function showIndianSuggestions(query) {
  try {
    // Show some popular Indian recipes as suggestions
    const response = await fetch(INDIAN_AREA_API_URL);
    const data = await response.json();
    
    if (data.meals && data.meals.length > 0) {
      // Show first 8 Indian recipes as suggestions
      const suggestions = data.meals.slice(0, 8);
      displayRecipes(suggestions);
      showMessage(`No exact matches for "${query}". Here are some popular Indian recipes:`, false);
    } else {
      showMessage(`No recipes found for "${query}". Try searching for ingredients like "chicken", "rice", "potato", or "onion".`);
    }
  } catch (error) {
    showMessage(`No recipes found for "${query}". Try searching for ingredients like "chicken", "rice", "potato", or "onion".`);
  }
}

function showMessage(message, isError = false, isLoading = false) {
  messageArea.textContent = message;
  if (isError) messageArea.classList.add("error");
  if (isLoading) messageArea.classList.add("loading");
}

function clearMessage() {
  messageArea.textContent = "";
  messageArea.className = "message";
}

function displayRecipes(recipes) {
  if (!recipes || recipes.length === 0) {
    showMessage("No recipes to display");
    return;
  }

  recipes.forEach((recipe) => {
    const recipeDiv = document.createElement("div");
    recipeDiv.classList.add("recipe-item");
    recipeDiv.dataset.id = recipe.idMeal;

    recipeDiv.innerHTML = `
        <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" loading="lazy">
        <h3>${recipe.strMeal}</h3>
    `;

    resultsGrid.appendChild(recipeDiv);
  });
}

randomButton.addEventListener("click", getRandomRecipe);

async function getRandomRecipe() {
  showMessage("Fetching a random Indian recipe...", false, true);
  resultsGrid.innerHTML = "";

  try {
    // 70% chance to get Indian recipe, 30% chance for any random recipe
    const shouldGetIndian = Math.random() < 0.7;
    
    if (shouldGetIndian) {
      // Get a random Indian recipe
      const indianResponse = await fetch(INDIAN_AREA_API_URL);
      const indianData = await indianResponse.json();
      
      if (indianData.meals && indianData.meals.length > 0) {
        // Pick a random Indian recipe
        const randomIndex = Math.floor(Math.random() * indianData.meals.length);
        const randomIndianRecipe = [indianData.meals[randomIndex]];
        clearMessage();
        displayRecipes(randomIndianRecipe);
        return;
      }
    }
    
    // Fallback to any random recipe
    const response = await fetch(RANDOM_API_URL);
    if (!response.ok) throw new Error("Something went wrong.");
    const data = await response.json();

    clearMessage();

    if (data.meals && data.meals.length > 0) {
      displayRecipes(data.meals);
    } else {
      showMessage("Could not fetch a random recipe. Please try again.", true);
    }
  } catch (error) {
    showMessage(
      "Failed to fetch a random recipe. Please check your connection and try again.",
      true
    );
  }
}

function showModal() {
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.add("hidden");
  document.body.style.overflow = "";
}

resultsGrid.addEventListener("click", (e) => {
  const card = e.target.closest(".recipe-item");

  if (card) {
    const recipeId = card.dataset.id;
    getRecipeDetails(recipeId);
  }
});

async function getRecipeDetails(id) {
  modalContent.innerHTML = '<p class="message loading">Loading details...</p>';
  showModal();

  try {
    const response = await fetch(`${LOOKUP_API_URL}${id}`);
    if (!response.ok) throw new Error("Failed to fetch recipe details.");
    const data = await response.json();

    console.log("details: ", data);
    if (data.meals && data.meals.length > 0) {
      displayRecipeDetails(data.meals[0]);
    } else {
      modalContent.innerHTML =
        '<p class="message error">Could not load recipe details.</p>';
    }
  } catch (error) {
    modalContent.innerHTML =
      '<p class="message error">Failed to load recipe details. Check your connection or try again.</p>';
  }
}

modalCloseBtn.addEventListener("click", closeModal);

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

function displayRecipeDetails(recipe) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`]?.trim();
    const measure = recipe[`strMeasure${i}`]?.trim();

    if (ingredient) {
      ingredients.push(`<li>${measure ? `${measure} ` : ""}${ingredient}</li>`);
    } else {
      break;
    }
  }

  const categoryHTML = recipe.strCategory
    ? `<h3>Category: ${recipe.strCategory}</h3>`
    : "";
  const areaHTML = recipe.strArea ? `<h3>Area: ${recipe.strArea}</h3>` : "";
  const ingredientsHTML = ingredients.length
    ? `<h3>Ingredients</h3><ul>${ingredients.join("")}</ul>`
    : "";
  const instructionsHTML = `<h3>Instructions</h3><p>${
    recipe.strInstructions
      ? recipe.strInstructions.replace(/\r?\n/g, "<br>")
      : "Instructions not available."
  }</p>`;
  const youtubeHTML = recipe.strYoutube
    ? `<h3>Video Recipe</h3><div class="video-wrapper"><a href="${recipe.strYoutube}" target="_blank">Watch on YouTube</a><div>`
    : "";
  const sourcHTML = recipe.strSource
    ? `<div class="source-wrapper"><a href="${recipe.strSource}" target="_blank">View Original Source</a></div>`
    : "";

  modalContent.innerHTML = `
  <h2>${recipe.strMeal}</h2>
  <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
  ${categoryHTML}
  ${areaHTML}
  ${ingredientsHTML}
  ${instructionsHTML}
  ${youtubeHTML}
  ${sourcHTML}
  `;
}
