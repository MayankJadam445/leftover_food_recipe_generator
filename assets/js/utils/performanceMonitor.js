/**
 * Performance Monitor
 * Simple performance tracking for the Recipe Finder app
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.startTimes = {};
    this.enabled = true; // Set to false in production for better performance
  }

  /**
   * Start timing an operation
   */
  startTimer(name) {
    if (!this.enabled) return;
    this.startTimes[name] = performance.now();
  }

  /**
   * End timing an operation
   */
  endTimer(name) {
    if (!this.enabled || !this.startTimes[name]) return;
    
    const duration = performance.now() - this.startTimes[name];
    
    if (!this.metrics[name]) {
      this.metrics[name] = [];
    }
    
    this.metrics[name].push(duration);
    delete this.startTimes[name];
    
    console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
  }

  /**
   * Get average time for an operation
   */
  getAverage(name) {
    if (!this.metrics[name] || this.metrics[name].length === 0) return 0;
    
    const sum = this.metrics[name].reduce((a, b) => a + b, 0);
    return sum / this.metrics[name].length;
  }

  /**
   * Get performance report
   */
  getReport() {
    const report = {};
    
    Object.keys(this.metrics).forEach(name => {
      const times = this.metrics[name];
      report[name] = {
        count: times.length,
        average: this.getAverage(name).toFixed(2) + 'ms',
        min: Math.min(...times).toFixed(2) + 'ms',
        max: Math.max(...times).toFixed(2) + 'ms'
      };
    });
    
    return report;
  }

  /**
   * Log performance report to console
   */
  logReport() {
    console.table(this.getReport());
  }

  /**
   * Monitor API calls
   */
  monitorApiCall(url, startTime) {
    const duration = performance.now() - startTime;
    const operationName = `API: ${url.split('/').pop()}`;
    
    if (!this.metrics[operationName]) {
      this.metrics[operationName] = [];
    }
    
    this.metrics[operationName].push(duration);
    console.log(`🌐 ${operationName}: ${duration.toFixed(2)}ms`);
  }

  /**
   * Monitor page load performance
   */
  monitorPageLoad() {
    if (!this.enabled) return;

    window.addEventListener('load', () => {
      const timing = performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
      
      console.log(`📄 Page Load Time: ${loadTime}ms`);
      console.log(`🏗️ DOM Ready Time: ${domReady}ms`);
      
      // Store page load metrics
      this.metrics['Page Load'] = [loadTime];
      this.metrics['DOM Ready'] = [domReady];
    });
  }

  /**
   * Enable performance monitoring
   */
  enable() {
    this.enabled = true;
  }

  /**
   * Disable performance monitoring
   */
  disable() {
    this.enabled = false;
  }

  /**
   * Clear all metrics
   */
  clear() {
    this.metrics = {};
    this.startTimes = {};
  }
}

// Create global instance
window.perfMonitor = new PerformanceMonitor();

// Auto-monitor page load
window.perfMonitor.monitorPageLoad();

// Add to window for debugging
window.debugPerformance = () => {
  window.perfMonitor.logReport();
};
