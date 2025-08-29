/**
 * DOM Utilities
 * Helper functions for DOM manipulation
 */

class DOMUtils {
  /**
   * Get element by ID with error handling
   */
  static getElementById(id) {
    const element = document.getElementById(id);
    if (!element) {
      console.warn(`Element with ID '${id}' not found`);
    }
    return element;
  }

  /**
   * Show message in message area
   */
  static showMessage(message, isError = false, isLoading = false) {
    const messageArea = this.getElementById(CONFIG.ELEMENTS.MESSAGE_AREA);
    if (!messageArea) return;

    messageArea.textContent = message;
    messageArea.className = 'message';
    
    if (isError) messageArea.classList.add('error');
    if (isLoading) messageArea.classList.add('loading');
  }

  /**
   * Clear message area
   */
  static clearMessage() {
    const messageArea = this.getElementById(CONFIG.ELEMENTS.MESSAGE_AREA);
    if (!messageArea) return;

    messageArea.textContent = '';
    messageArea.className = 'message';
  }

  /**
   * Clear results grid
   */
  static clearResults() {
    const resultsGrid = this.getElementById(CONFIG.ELEMENTS.RESULTS_GRID);
    if (!resultsGrid) return;

    resultsGrid.innerHTML = '';
  }

  /**
   * Create element with attributes
   */
  static createElement(tag, attributes = {}, textContent = '') {
    const element = document.createElement(tag);
    
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'className') {
        element.className = value;
      } else if (key === 'innerHTML') {
        element.innerHTML = value;
      } else {
        element.setAttribute(key, value);
      }
    });

    if (textContent) {
      element.textContent = textContent;
    }

    return element;
  }

  /**
   * Add event listener with error handling
   */
  static addEventListenerSafe(element, event, handler) {
    if (!element) {
      console.warn('Cannot add event listener: element is null');
      return;
    }

    element.addEventListener(event, (e) => {
      try {
        handler(e);
      } catch (error) {
        console.error('Event handler error:', error);
      }
    });
  }

  /**
   * Sanitize HTML to prevent XSS
   */
  static sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
  }

  /**
   * Debounce function
   */
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// Make available globally
window.DOMUtils = DOMUtils;
