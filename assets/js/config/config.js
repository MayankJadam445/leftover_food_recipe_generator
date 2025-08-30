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
      AREAS: '/list.php?a=list',
      FILTER_BY_AREA: '/filter.php?a=',
      FILTER_BY_CATEGORY: '/filter.php?c='
    }
  },

  // Application Settings
  APP: {
    NAME: 'Leftover Food Recipe Generator',
    VERSION: '2.0.0',
    MAX_SEARCH_RESULTS: 20,
    CACHE_DURATION: 300000, // 5 minutes in milliseconds
  },

  // Cuisine keywords for recipe prioritization and detection
  CUISINE_KEYWORDS: [
    // Main Dishes & Curries
    'curry', 'dal', 'biryani', 'tandoori', 'masala', 'tikka', 'vindaloo', 
    'korma', 'jalfrezi', 'bhaji', 'butter chicken', 'palak', 'saag',
    'makhani', 'madras', 'chettinad', 'goan', 'hyderabadi', 'lucknowi',
    'mughlai', 'punjabi', 'south indian', 'bengali', 'gujarati', 'rajasthani',
    
    // Bread & Rice
    'naan', 'chapati', 'roti', 'paratha', 'kulcha', 'bhatura', 'puri',
    'dosa', 'idli', 'uttapam', 'appam', 'puttu', 'biryani', 'pulao',
    'jeera rice', 'coconut rice', 'lemon rice', 'tamarind rice',
    
    // Vegetables & Proteins
    'paneer', 'aloo', 'gobi', 'matar', 'chana', 'rajma', 'chole',
    'palak', 'bhindi', 'baingan', 'karela', 'lauki', 'turai', 'kaddu',
    'chicken', 'mutton', 'lamb', 'fish', 'prawn', 'crab', 'egg',
    
    // Snacks & Appetizers
    'samosa', 'pakora', 'bhajia', 'vada', 'cutlet', 'tikki', 'chaat',
    'papdi', 'sev', 'bhel', 'pani puri', 'dahi puri', 'aloo tikki',
    'kachori', 'dhokla', 'handvo', 'thepla', 'farsan', 'namkeen',
    
    // Sweets & Desserts - Comprehensive Indian Collection
    'kheer', 'gulab jamun', 'halwa', 'laddu', 'barfi', 'rasgulla',
    'rasmalai', 'jalebi', 'kulfi', 'falooda', 'payasam', 'sheera',
    'modak', 'peda', 'kaju katli', 'mysore pak', 'sandesh', 'mishti',
    
    // Milk-based Desserts
    'rabri', 'basundi', 'shrikhand', 'amrakhand', 'kalakand', 'chhana',
    'paneer kheer', 'ras malai', 'malai kulfi', 'doodh pak', 'phirni',
    'sevaiyan', 'vermicelli kheer', 'rice pudding', 'sabudana kheer',
    
    // Halwa Varieties
    'gajar halwa', 'carrot halwa', 'sooji halwa', 'semolina halwa',
    'moong dal halwa', 'wheat halwa', 'atta halwa', 'badam halwa',
    'almond halwa', 'coconut halwa', 'bottle gourd halwa', 'lauki halwa',
    'beetroot halwa', 'pumpkin halwa', 'kaddu halwa', 'aate ka halwa',
    
    // Bengali Sweets
    'rasgulla', 'sandesh', 'mishti doi', 'roshogolla', 'chomchom',
    'rajbhog', 'malai chop', 'langcha', 'pantua', 'khaja', 'gur sandesh',
    'nolen gur sandesh', 'kamalabhog', 'mihidana', 'sitabhog',
    
    // South Indian Desserts
    'payasam', 'kheer', 'ada pradhaman', 'pal payasam', 'semiya payasam',
    'carrot payasam', 'parippu payasam', 'gothambu payasam', 'mysore pak',
    'chiroti', 'obbattu', 'holige', 'boorelu', 'ariselu', 'poornam boorelu',
    'unniyappam', 'nei appam', 'pathiri', 'kozhukatta', 'modakam',
    
    // Gujarati & Maharashtrian Sweets
    'mohanthal', 'shakkarpara', 'gur para', 'puran poli', 'anarase',
    'karanji', 'gujiya', 'chirote', 'shankarpali', 'malpua', 'ghevar',
    'dhoodh peda', 'milk peda', 'coconut laddu', 'besan laddu',
    'motichoor laddu', 'boondi laddu', 'rava laddu', 'til laddu',
    
    // North Indian Specialties
    'kulfi falooda', 'malai kulfi', 'pista kulfi', 'kesar kulfi',
    'kulfi matka', 'rabri kulfi', 'ice cream kulfi', 'kulcha kulfi',
    'balushahi', 'gulab jamun', 'kala jamun', 'dry jamun', 'rasgulla',
    'cham cham', 'kalakand', 'milk cake', 'pista barfi', 'coconut barfi',
    
    // Festival Sweets
    'gujiya', 'karanji', 'nevri', 'modak', 'ukadiche modak', 'fried modak',
    'steamed modak', 'chocolate modak', 'coconut modak', 'jaggery modak',
    'adhirasam', 'seedai', 'murukku', 'thattai', 'ribbon pakoda sweet',
    'chakli sweet', 'diamond cuts', 'maida biscuits', 'nan khatai',
    
    // Jaggery-based Sweets
    'gud ke laddu', 'jaggery laddu', 'gur ki kheer', 'gud halwa',
    'gud para', 'til gud laddu', 'sesame jaggery balls', 'chikki',
    'groundnut chikki', 'til chikki', 'sesame brittle', 'peanut brittle',
    
    // Dry Fruit Sweets
    'kaju katli', 'cashew fudge', 'badam katli', 'almond fudge',
    'pista roll', 'pistachio roll', 'anjeer rolls', 'fig rolls',
    'khajur pak', 'date fudge', 'dry fruit laddu', 'mixed nuts laddu',
    'walnut halwa', 'akhroti halwa', 'badam pak', 'kaju roll',
    
    // Modern Fusion Desserts
    'chocolate barfi', 'oreo laddu', 'chocolate modak', 'fruit kulfi',
    'mango kulfi', 'strawberry kulfi', 'chocolate kulfi', 'vanilla kulfi',
    'rose kulfi', 'kesar pista kulfi', 'malai kulfi', 'kulfi ice cream',
    'fusion sweets', 'modern mithai', 'designer sweets', 'cake mithai',
    
    // Beverages
    'chai', 'lassi', 'nimbu pani', 'aam panna', 'thandai', 'kahwa',
    'solkadhi', 'chaas', 'buttermilk', 'masala tea', 'filter coffee',
    
    // Cooking Methods & Spices
    'tandoor', 'dum', 'bhuna', 'tempering', 'tadka', 'masala',
    'garam masala', 'turmeric', 'cumin', 'coriander', 'cardamom',
    'cinnamon', 'cloves', 'bay leaves', 'mustard seeds', 'curry leaves',
    'asafoetida', 'hing', 'jeera', 'dhania', 'haldi', 'mirch',
    
    // Regional Specialties
    'sambar', 'rasam', 'upma', 'poha', 'misal', 'vada pav', 'pav bhaji',
    'dabeli', 'khandvi', 'undhiyu', 'khichdi', 'bisi bele bath',
    'curd rice', 'pickle', 'achaar', 'chutney', 'raita', 'papad',
    
    // Lentils & Legumes
    'moong', 'masoor', 'urad', 'chana dal', 'toor dal', 'black gram',
    'green gram', 'red lentils', 'split peas', 'black eyed peas',
    
    // Street Food
    'chaat masala', 'sev puri', 'ragda pattice', 'chole bhature',
    'raj kachori', 'aloo chaat', 'fruit chaat', 'bhel puri', 'jhal muri',
    
    // Festive Foods
    'modak', 'puran poli', 'gujiya', 'karanji', 'chiroti', 'obbattu',
    'patholi', 'nevri', 'shankarpali', 'chakli', 'murukku', 'adhirasam',
    
    // International Cuisines
    // Italian
    'pasta', 'pizza', 'lasagna', 'risotto', 'gnocchi', 'carbonara',
    'bolognese', 'marinara', 'pesto', 'parmesan', 'mozzarella', 'tiramisu',
    'gelato', 'cannoli', 'focaccia', 'bruschetta', 'minestrone', 'osso buco',
    
    // Chinese/Asian
    'stir fry', 'fried rice', 'chow mein', 'lo mein', 'dim sum', 'wonton',
    'spring roll', 'kung pao', 'sweet and sour', 'orange chicken', 'sesame',
    'szechuan', 'teriyaki', 'tempura', 'sushi', 'ramen', 'miso', 'soy sauce',
    
    // Mexican/Latin
    'tacos', 'burritos', 'quesadilla', 'enchiladas', 'nachos', 'guacamole',
    'salsa', 'chimichanga', 'fajitas', 'tortilla', 'cilantro', 'jalapeño',
    'chipotle', 'queso', 'carne asada', 'carnitas', 'chorizo', 'tamales',
    
    // American/Continental
    'burger', 'sandwich', 'barbecue', 'bbq', 'wings', 'mac and cheese',
    'meatloaf', 'pot roast', 'fried chicken', 'apple pie', 'cheesecake',
    'brownies', 'cookies', 'pancakes', 'waffles', 'french toast', 'bacon',
    
    // French
    'croissant', 'baguette', 'quiche', 'crepe', 'souffle', 'ratatouille',
    'coq au vin', 'beef bourguignon', 'bouillabaisse', 'escargot', 'foie gras',
    'creme brulee', 'macaron', 'eclair', 'profiterole', 'mousse', 'brie',
    
    // Mediterranean/Greek
    'hummus', 'falafel', 'gyros', 'souvlaki', 'moussaka', 'tzatziki',
    'baklava', 'spanakopita', 'dolmades', 'olive oil', 'feta', 'oregano',
    'mediterranean', 'greek salad', 'pita', 'kabab', 'shawarma', 'tabbouleh'
  ],

  // UI Messages
  MESSAGES: {
    SEARCHING: 'Searching for recipes...',
    NO_RESULTS: 'No recipes found. Try searching for ingredients like "chicken", "pasta", "vegetables", or "chocolate".',
    NO_RESULTS_WITH_SUGGESTIONS: 'No recipes found for "{query}". Here are some popular recipes you might like:',
    NETWORK_ERROR: 'Something went wrong. Please check your connection and try again.',
    LOADING_DETAILS: 'Loading recipe details...',
    RECIPE_SUGGESTIONS: 'No exact matches found. Here are some popular recipes:',
    TRY_DIFFERENT_SEARCH: 'No recipes found for "{query}". Try searching for:',
    MULTIWORD_SEARCH_TIP: 'Pro tip: You can search with multiple words like "grilled chicken", "chocolate cake", or "vegetable soup"!',
    SEARCH_SUGGESTIONS: [
      'Popular dishes: chicken parmesan, beef stir fry, pasta carbonara, fish tacos',
      'International cuisines: Italian pasta, Chinese stir fry, Mexican tacos, Indian curry',
      'Indian favorites: biryani, dal, paneer curry, tandoori chicken, dosa, samosa',
      'Indian desserts: gulab jamun, kheer, kulfi, jalebi, halwa, rasgulla, barfi',
      'Quick meals: salad, soup, sandwich, rice bowl, pasta',
      'Comfort food: mac and cheese, grilled cheese, fried chicken, pizza',
      'Healthy options: grilled fish, vegetable stir fry, quinoa salad, smoothie bowl',
      'Sweet treats: chocolate cake, cookies, ice cream, fruit pie, pudding',
      'Breakfast ideas: pancakes, eggs, oatmeal, french toast, smoothie',
      'Dinner favorites: roast chicken, beef stew, salmon, pork chops',
      'Vegetarian meals: veggie burger, bean salad, mushroom risotto, tofu stir fry',
      'Baking & desserts: bread, muffins, brownies, cheesecake, apple pie',
      'Multiple words: "spicy chicken", "creamy pasta", "fresh salad"',
      'Cooking methods: grilled, baked, fried, steamed, roasted',
      'Meal types: breakfast, lunch, dinner, snack, dessert'
    ]
  },

  // Filter Configuration
  FILTERS: {
    VEGETARIAN_KEYWORDS: [
      'paneer', 'dal', 'aloo', 'gobi', 'palak', 'matar', 'bhindi', 'baingan',
      'vegetarian', 'vegan', 'veggie', 'tofu', 'cheese', 'mushroom', 'spinach'
    ],
    NON_VEGETARIAN_KEYWORDS: [
      'chicken', 'beef', 'lamb', 'mutton', 'fish', 'prawn', 'seafood', 'meat',
      'pork', 'turkey', 'duck', 'egg', 'bacon', 'sausage', 'ham'
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
    MODAL_CLOSE_BTN: 'modal-close-btn',
    FILTER_CONTAINER: 'filter-container',
    CUISINE_FILTER: 'cuisine-filter',
    CATEGORY_FILTER: 'category-filter',
    APPLY_FILTERS: 'apply-filters',
    CLEAR_FILTERS: 'clear-filters'
  }
};

// Make config available globally
window.CONFIG = CONFIG;
