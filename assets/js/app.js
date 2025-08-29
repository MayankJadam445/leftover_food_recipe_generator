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
      // Initialize components
      await this.initializeComponents();
      
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
    DOMUtils.showMessage('Search for Indian recipes or get a random one! 🍛');
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
