/**
 * VeilCipher - UI Components Module
 * Tactical UI components for the steganography suite
 */

class VeilCipherComponents {
  constructor() {
    this.components = new Map();
    this.init();
  }

  /**
   * Initialize UI components
   */
  init() {
    this.setupBurnBagModal();
    this.setupProgressOverlay();
    this.setupTooltips();
    this.setupKeyboardShortcuts();
  }

  /**
   * Setup Burn Bag modal functionality
   */
  setupBurnBagModal() {
    const modal = document.getElementById('burn-bag-modal');
    const confirmBurn = document.getElementById('confirm-burn');
    const executeBurn = document.getElementById('execute-burn');
    const cancelBurn = document.getElementById('cancel-burn');
    const closeBurnBag = document.getElementById('close-burn-bag');

    // Toggle execute button based on confirmation
    confirmBurn.addEventListener('change', () => {
      executeBurn.disabled = !confirmBurn.checked;
    });

    // Execute burn operation
    executeBurn.addEventListener('click', () => {
      this.executeBurnOperation();
      modal.style.display = 'none';
      confirmBurn.checked = false;
      executeBurn.disabled = true;
    });

    // Cancel burn operation
    cancelBurn.addEventListener('click', () => {
      modal.style.display = 'none';
      confirmBurn.checked = false;
      executeBurn.disabled = true;
    });

    // Close modal
    closeBurnBag.addEventListener('click', () => {
      modal.style.display = 'none';
      confirmBurn.checked = false;
      executeBurn.disabled = true;
    });

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
        confirmBurn.checked = false;
        executeBurn.disabled = true;
      }
    });
  }

  /**
   * Setup progress overlay functionality
   */
  setupProgressOverlay() {
    const overlay = document.getElementById('progress-overlay');
    const progressBar = document.getElementById('progress-fill');
    
    // Animate progress bar
    let progressInterval;
    
    overlay.addEventListener('show', () => {
      progressBar.style.width = '0%';
      progressInterval = setInterval(() => {
        const currentWidth = parseFloat(progressBar.style.width) || 0;
        if (currentWidth < 100) {
          progressBar.style.width = `${currentWidth + 5}%`;
        }
      }, 100);
    });

    overlay.addEventListener('hide', () => {
      clearInterval(progressInterval);
      progressBar.style.width = '100%';
      setTimeout(() => {
        progressBar.style.width = '0%';
      }, 500);
    });
  }

  /**
   * Setup tooltips for UI elements
   */
  setupTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
      element.addEventListener('mouseenter', (e) => {
        this.createTooltip(e.target, e.target.dataset.tooltip);
      });

      element.addEventListener('mouseleave', () => {
        this.removeTooltip();
      });
    });
  }

  /**
   * Create tooltip element
   * @param {HTMLElement} target - Target element
   * @param {string} text - Tooltip text
   */
  createTooltip(target, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    
    document.body.appendChild(tooltip);
    
    const rect = target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
    let top = rect.top - tooltipRect.height - 10;
    
    // Adjust position if tooltip would go off screen
    if (left < 10) left = 10;
    if (left + tooltipRect.width > window.innerWidth - 10) {
      left = window.innerWidth - tooltipRect.width - 10;
    }
    if (top < 10) top = rect.bottom + 10;
    
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    tooltip.style.opacity = '1';
    
    target._tooltip = tooltip;
  }

  /**
   * Remove tooltip element
   */
  removeTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
      tooltip.remove();
    }
  }

  /**
   * Setup keyboard shortcuts
   */
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + E: Encrypt
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        this.triggerEncryptOperation();
      }
      
      // Ctrl/Cmd + D: Decrypt
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        this.triggerDecryptOperation();
      }
      
      // Ctrl/Cmd + C: Copy
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        this.triggerCopyOperation();
      }
      
      // Ctrl/Cmd + B: Burn
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        this.triggerBurnOperation();
      }
      
      // Ctrl/Cmd + L: Clear
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        this.triggerClearOperation();
      }
      
      // Ctrl/Cmd + H: Help
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        this.toggleHelp();
      }
      
      // Escape: Close modals
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
    });
  }

  /**
   * Trigger encrypt operation based on current tab
   */
  triggerEncryptOperation() {
    const activeTab = document.querySelector('.tab-btn.active');
    if (activeTab) {
      const tabName = activeTab.dataset.tab;
      switch (tabName) {
        case 'image':
          document.getElementById('encrypt-image').click();
          break;
        case 'audio':
          document.getElementById('encrypt-audio').click();
          break;
        case 'text':
          // Handle text encryption
          break;
        case 'network':
          // Handle network simulation
          break;
      }
    }
  }

  /**
   * Trigger decrypt operation based on current tab
   */
  triggerDecryptOperation() {
    const activeTab = document.querySelector('.tab-btn.active');
    if (activeTab) {
      const tabName = activeTab.dataset.tab;
      switch (tabName) {
        case 'image':
          document.getElementById('extract-image').click();
          break;
        case 'audio':
          document.getElementById('extract-audio').click();
          break;
        case 'text':
          // Handle text extraction
          break;
        case 'network':
          // Handle network analysis
          break;
      }
    }
  }

  /**
   * Trigger copy operation
   */
  triggerCopyOperation() {
    document.getElementById('copy-output').click();
  }

  /**
   * Trigger burn operation
   */
  triggerBurnOperation() {
    document.getElementById('burn-output').click();
  }

  /**
   * Trigger clear operation
   */
  triggerClearOperation() {
    document.getElementById('clear-input').click();
  }

  /**
   * Toggle help
   */
  toggleHelp() {
    document.getElementById('help-toggle').click();
  }

  /**
   * Close all modals
   */
  closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      modal.style.display = 'none';
    });
  }

  /**
   * Create animated progress bar
   * @param {HTMLElement} container - Container element
   * @param {number} duration - Animation duration in ms
   */
  createAnimatedProgress(container, duration = 3000) {
    const progressBar = document.createElement('div');
    progressBar.className = 'animated-progress';
    
    const progressFill = document.createElement('div');
    progressFill.className = 'animated-progress-fill';
    
    progressBar.appendChild(progressFill);
    container.appendChild(progressBar);
    
    // Animate
    setTimeout(() => {
      progressFill.style.width = '100%';
    }, 100);
    
    // Remove after completion
    setTimeout(() => {
      progressBar.remove();
    }, duration + 1000);
  }

  /**
   * Create success notification
   * @param {string} message - Success message
   * @param {number} duration - Duration in ms
   */
  createSuccessNotification(message, duration = 3000) {
    this.createNotification(message, 'success', duration);
  }

  /**
   * Create error notification
   * @param {string} message - Error message
   * @param {number} duration - Duration in ms
   */
  createErrorNotification(message, duration = 5000) {
    this.createNotification(message, 'error', duration);
  }

  /**
   * Create general notification
   * @param {string} message - Notification message
   * @param {string} type - Notification type (success, error, info, warning)
   * @param {number} duration - Duration in ms
   */
  createNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <i class="notification-icon"></i>
      <span class="notification-message">${message}</span>
      <button class="notification-close">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    // Auto remove
    const removeNotification = () => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 300);
    };
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', removeNotification);
    
    // Auto remove after duration
    if (duration > 0) {
      setTimeout(removeNotification, duration);
    }
  }

  /**
   * Create loading spinner
   * @param {HTMLElement} container - Container element
   * @param {string} message - Loading message
   */
  createLoadingSpinner(container, message = 'Processing...') {
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    spinner.innerHTML = `
      <div class="spinner-icon"></div>
      <span class="spinner-text">${message}</span>
    `;
    
    container.appendChild(spinner);
    return spinner;
  }

  /**
   * Remove loading spinner
   * @param {HTMLElement} spinner - Spinner element
   */
  removeLoadingSpinner(spinner) {
    if (spinner && spinner.parentNode) {
      spinner.remove();
    }
  }

  /**
   * Create file upload preview
   * @param {File} file - File to preview
   * @returns {Promise<HTMLElement>} Preview element
   */
  async createFilePreview(file) {
    const preview = document.createElement('div');
    preview.className = 'file-preview';
    
    const fileName = document.createElement('div');
    fileName.className = 'file-name';
    fileName.textContent = file.name;
    
    const fileSize = document.createElement('div');
    fileSize.className = 'file-size';
    fileSize.textContent = this.formatFileSize(file.size);
    
    const fileType = document.createElement('div');
    fileType.className = 'file-type';
    fileType.textContent = file.type || 'Unknown type';
    
    preview.appendChild(fileName);
    preview.appendChild(fileSize);
    preview.appendChild(fileType);
    
    // Add file-specific preview
    if (file.type.startsWith('image/')) {
      await this.addImagePreview(preview, file);
    } else if (file.type.startsWith('audio/')) {
      await this.addAudioPreview(preview, file);
    }
    
    return preview;
  }

  /**
   * Add image preview to container
   * @param {HTMLElement} container - Container element
   * @param {File} file - Image file
   */
  async addImagePreview(container, file) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const dimensions = document.createElement('div');
        dimensions.className = 'file-dimensions';
        dimensions.textContent = `${img.width} × ${img.height}`;
        container.appendChild(dimensions);
        resolve();
      };
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Add audio preview to container
   * @param {HTMLElement} container - Container element
   * @param {File} file - Audio file
   */
  async addAudioPreview(container, file) {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const audioBuffer = await audioContext.decodeAudioData(e.target.result);
          const duration = document.createElement('div');
          duration.className = 'file-duration';
          duration.textContent = `${audioBuffer.duration.toFixed(2)} seconds`;
          container.appendChild(duration);
        } catch (error) {
          console.warn('Could not decode audio file for preview');
        }
      };
      
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.warn('Audio preview not available');
    }
  }

  /**
   * Format file size
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted file size
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Create security badge
   * @param {string} level - Security level
   * @param {string} message - Security message
   * @returns {HTMLElement} Security badge element
   */
  createSecurityBadge(level, message) {
    const badge = document.createElement('div');
    badge.className = `security-badge security-${level.toLowerCase()}`;
    
    const icon = document.createElement('i');
    icon.className = 'security-icon';
    
    const text = document.createElement('span');
    text.className = 'security-text';
    text.textContent = message;
    
    badge.appendChild(icon);
    badge.appendChild(text);
    
    return badge;
  }

  /**
   * Create operation log entry
   * @param {string} operation - Operation type
   * @param {string} status - Operation status
   * @param {string} details - Operation details
   * @returns {HTMLElement} Log entry element
   */
  createLogEntry(operation, status, details) {
    const entry = document.createElement('div');
    entry.className = `log-entry log-${status.toLowerCase()}`;
    
    const timestamp = document.createElement('span');
    timestamp.className = 'log-timestamp';
    timestamp.textContent = new Date().toLocaleTimeString();
    
    const op = document.createElement('span');
    op.className = 'log-operation';
    op.textContent = operation;
    
    const statusIcon = document.createElement('i');
    statusIcon.className = `log-status-icon log-status-${status.toLowerCase()}`;
    
    const detail = document.createElement('span');
    detail.className = 'log-details';
    detail.textContent = details;
    
    entry.appendChild(timestamp);
    entry.appendChild(op);
    entry.appendChild(statusIcon);
    entry.appendChild(detail);
    
    return entry;
  }
}

// Global instance
const veilCipherComponents = new VeilCipherComponents();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VeilCipherComponents;
} else if (typeof window !== 'undefined') {
  window.VeilCipherComponents = VeilCipherComponents;
  window.veilCipherComponents = veilCipherComponents;
}