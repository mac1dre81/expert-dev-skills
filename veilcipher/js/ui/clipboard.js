/**
 * VeilCipher - Clipboard Operations Module
 * Secure clipboard operations with operational security monitoring
 */

class VeilCipherClipboard {
  constructor() {
    this.copyHistory = [];
    this.maxHistory = 10;
    this.secureMode = true;
  }

  /**
   * Securely copy text to clipboard
   * @param {string} text - Text to copy
   * @param {string} context - Context of the operation
   * @returns {Promise<boolean>} Copy success status
   */
  async copyToClipboard(text, context = 'operation') {
    try {
      // Log the operation for security monitoring
      this.logClipboardOperation('copy', context, text.length);
      
      // Use modern Clipboard API
      await navigator.clipboard.writeText(text);
      
      // Clear sensitive data from memory
      this.secureClear(text);
      
      // Monitor for paste operations
      this.startPasteMonitoring();
      
      return true;
    } catch (error) {
      console.error('Clipboard copy failed:', error);
      return false;
    }
  }

  /**
   * Securely read from clipboard
   * @param {string} context - Context of the operation
   * @returns {Promise<string>} Clipboard content
   */
  async readFromClipboard(context = 'operation') {
    try {
      // Log the operation for security monitoring
      this.logClipboardOperation('read', context, 0);
      
      // Use modern Clipboard API
      const text = await navigator.clipboard.readText();
      
      // Monitor for potential data leaks
      this.startLeakMonitoring(text);
      
      return text;
    } catch (error) {
      console.error('Clipboard read failed:', error);
      return '';
    }
  }

  /**
   * Securely clear clipboard
   * @returns {Promise<boolean>} Clear success status
   */
  async clearClipboard() {
    try {
      await navigator.clipboard.writeText('');
      this.logClipboardOperation('clear', 'security', 0);
      return true;
    } catch (error) {
      console.error('Clipboard clear failed:', error);
      return false;
    }
  }

  /**
   * Copy encrypted data with security features
   * @param {string} encryptedData - Encrypted data to copy
   * @param {string} dataType - Type of data (message, key, etc.)
   * @returns {Promise<boolean>} Copy success status
   */
  async copyEncryptedData(encryptedData, dataType = 'message') {
    if (!encryptedData || encryptedData.length === 0) {
      return false;
    }

    // Add security header
    const secureData = this.addSecurityHeader(encryptedData, dataType);
    
    // Copy with security monitoring
    const success = await this.copyToClipboard(secureData, `encrypted-${dataType}`);
    
    if (success) {
      // Schedule automatic clearing
      this.scheduleAutoClear(encryptedData, 30000); // Clear after 30 seconds
    }
    
    return success;
  }

  /**
   * Copy emoji sequence with security features
   * @param {string} emojiSequence - Emoji-encoded data
   * @returns {Promise<boolean>} Copy success status
   */
  async copyEmojiSequence(emojiSequence) {
    if (!emojiSequence || emojiSequence.length === 0) {
      return false;
    }

    // Add decoy text to make it look like spam
    const decoyText = this.addDecoyText(emojiSequence);
    
    return await this.copyToClipboard(decoyText, 'emoji-sequence');
  }

  /**
   * Copy URL with security features
   * @param {string} url - URL to copy
   * @returns {Promise<boolean>} Copy success status
   */
  async copySecureURL(url) {
    if (!url || url.length === 0) {
      return false;
    }

    // Add tracking parameters to make it look legitimate
    const trackedURL = this.addTrackingParameters(url);
    
    return await this.copyToClipboard(trackedURL, 'secure-url');
  }

  /**
   * Add security header to data
   * @param {string} data - Original data
   * @param {string} dataType - Type of data
   * @returns {string} Data with security header
   */
  addSecurityHeader(data, dataType) {
    const timestamp = new Date().toISOString();
    const header = `VEILCIPHER-SECURE:${dataType}:${timestamp}`;
    return `${header}\n${data}`;
  }

  /**
   * Add decoy text to emoji sequence
   * @param {string} emojiSequence - Original emoji sequence
   * @returns {string} Emoji sequence with decoy text
   */
  addDecoyText(emojiSequence) {
    const decoyMessages = [
      "Win a FREE iPhone! Click here: 📱💎🔥",
      "Amazing deals just for you! 🛒💰🎉",
      "You've won $1000! Claim now: 💵🎁✨",
      "Exclusive offer inside! 🎁💝🎊",
      "Limited time only! ⏰⚡💥"
    ];
    
    const randomDecoy = decoyMessages[Math.floor(Math.random() * decoyMessages.length)];
    return `${randomDecoy}\n${emojiSequence}\n${randomDecoy}`;
  }

  /**
   * Add tracking parameters to URL
   * @param {string} url - Original URL
   * @returns {string} URL with tracking parameters
   */
  addTrackingParameters(url) {
    const params = new URLSearchParams({
      utm_source: 'veilcipher',
      utm_medium: 'secure',
      utm_campaign: 'encrypted_data',
      session_id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now().toString()
    });
    
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${params.toString()}`;
  }

  /**
   * Schedule automatic clipboard clearing
   * @param {string} data - Data that was copied
   * @param {number} delay - Delay in milliseconds
   */
  scheduleAutoClear(data, delay) {
    setTimeout(async () => {
      // Verify the clipboard still contains our data
      const currentClipboard = await this.readFromClipboard('auto-clear-check');
      
      if (currentClipboard.includes(data.substring(0, 50))) {
        await this.clearClipboard();
        this.logClipboardOperation('auto-clear', 'security', 0);
      }
    }, delay);
  }

  /**
   * Start monitoring for paste operations
   */
  startPasteMonitoring() {
    // Monitor paste events
    document.addEventListener('paste', (e) => {
      this.logClipboardOperation('paste-detected', 'monitoring', 0);
      
      // Check if paste is happening in a secure context
      const target = e.target;
      if (target && target.tagName === 'INPUT') {
        this.logClipboardOperation('paste-in-input', 'security-check', 0);
      }
    }, { once: true });
  }

  /**
   * Start monitoring for potential data leaks
   * @param {string} data - Data that was copied
   */
  startLeakMonitoring(data) {
    // Monitor for potential leaks in console
    const originalLog = console.log;
    const originalError = console.error;
    
    console.log = (...args) => {
      if (args.some(arg => typeof arg === 'string' && arg.includes(data.substring(0, 10)))) {
        this.logClipboardOperation('potential-leak-console', 'security-alert', 0);
      }
      originalLog.apply(console, args);
    };
    
    console.error = (...args) => {
      if (args.some(arg => typeof arg === 'string' && arg.includes(data.substring(0, 10)))) {
        this.logClipboardOperation('potential-leak-error', 'security-alert', 0);
      }
      originalError.apply(console, args);
    };
  }

  /**
   * Log clipboard operation for security monitoring
   * @param {string} operation - Type of operation
   * @param {string} context - Context of operation
   * @param {number} dataSize - Size of data involved
   */
  logClipboardOperation(operation, context, dataSize) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      operation: operation,
      context: context,
      dataSize: dataSize,
      userAgent: navigator.userAgent,
      sessionId: window.veilCipherApp ? window.veilCipherApp.sessionId : 'unknown'
    };
    
    this.copyHistory.push(logEntry);
    
    // Keep only last N entries
    if (this.copyHistory.length > this.maxHistory) {
      this.copyHistory.shift();
    }
    
    // Notify security monitoring
    if (window.veilCipherApp) {
      window.veilCipherApp.showOpSecAlert(
        `Clipboard ${operation} detected`, 
        this.getAlertType(operation)
      );
    }
  }

  /**
   * Get alert type based on operation
   * @param {string} operation - Operation type
   * @returns {string} Alert type
   */
  getAlertType(operation) {
    switch (operation) {
      case 'copy':
      case 'read':
        return 'info';
      case 'paste-detected':
        return 'warning';
      case 'potential-leak-console':
      case 'potential-leak-error':
        return 'danger';
      default:
        return 'info';
    }
  }

  /**
   * Securely clear sensitive data from memory
   * @param {string} data - Data to clear
   */
  secureClear(data) {
    if (!data || typeof data !== 'string') return;
    
    // Overwrite string with random data
    let cleared = '';
    for (let i = 0; i < data.length; i++) {
      cleared += String.fromCharCode(Math.floor(Math.random() * 256));
    }
    
    // Replace original data
    data = cleared;
  }

  /**
   * Get clipboard operation history
   * @returns {Array} Operation history
   */
  getHistory() {
    return [...this.copyHistory];
  }

  /**
   * Clear clipboard history
   */
  clearHistory() {
    this.copyHistory = [];
  }

  /**
   * Enable/disable secure mode
   * @param {boolean} enabled - Secure mode enabled
   */
  setSecureMode(enabled) {
    this.secureMode = enabled;
    if (enabled) {
      this.logClipboardOperation('secure-mode-enabled', 'security', 0);
    } else {
      this.logClipboardOperation('secure-mode-disabled', 'security-warning', 0);
    }
  }
}

// Global instance
const veilCipherClipboard = new VeilCipherClipboard();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VeilCipherClipboard;
} else if (typeof window !== 'undefined') {
  window.VeilCipherClipboard = VeilCipherClipboard;
  window.veilCipherClipboard = veilCipherClipboard;
}