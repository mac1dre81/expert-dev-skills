/**
 * VeilCipher - Main Application Logic
 * Orchestrates all modules and handles UI interactions
 * Professional-grade steganography suite coordination
 */

class VeilCipherApp {
  constructor() {
    this.crypto = veilCipherCrypto;
    this.imageStego = imageSteganography;
    this.audioStego = audioSteganography;
    
    this.currentOperation = null;
    this.currentFile = null;
    this.currentKeyPair = null;
    this.sessionId = this.crypto.generateSessionId();
    
    this.init();
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      // Check browser compatibility
      this.checkBrowserSupport();
      
      // Initialize UI
      this.setupEventListeners();
      this.setupDragAndDrop();
      this.updateUI();
      
      // Initialize loading screen
      this.hideLoadingScreen();
      
      // Start operational security monitoring
      this.startOpSecMonitoring();
      
      console.log('VeilCipher v1.0.0 initialized successfully');
      this.showOpSecAlert('System initialized', 'success');
      
    } catch (error) {
      console.error('Initialization failed:', error);
      this.showError('Application initialization failed');
    }
  }

  /**
   * Check browser compatibility
   */
  checkBrowserSupport() {
    const features = {
      webCrypto: !!window.crypto && !!window.crypto.subtle,
      canvas: !!document.createElement('canvas').getContext,
      fileAPI: !!window.File && !!window.FileReader,
      webAudio: !!window.AudioContext || !!window.webkitAudioContext
    };

    const missingFeatures = Object.keys(features).filter(key => !features[key]);
    
    if (missingFeatures.length > 0) {
      this.showError(`Browser compatibility issue: ${missingFeatures.join(', ')}`);
      this.showOpSecAlert('Browser compatibility warning', 'warning');
    }

    // Update browser status indicator
    const browserStatus = document.getElementById('browser-status');
    if (features.webCrypto && features.canvas && features.fileAPI) {
      browserStatus.innerHTML = '<i class="fas fa-shield-check"></i><span>Browser: Secure</span>';
    } else {
      browserStatus.innerHTML = '<i class="fas fa-exclamation-triangle"></i><span>Browser: Limited</span>';
    }
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Message input events
    const messageInput = document.getElementById('message-input');
    messageInput.addEventListener('input', (e) => this.handleMessageInput(e.target.value));
    
    // Password input events
    const passwordInput = document.getElementById('password-input');
    passwordInput.addEventListener('input', (e) => this.handlePasswordInput(e.target.value));
    
    // Operation buttons
    document.getElementById('encrypt-image').addEventListener('click', () => this.handleImageEncryption());
    document.getElementById('extract-image').addEventListener('click', () => this.handleImageExtraction());
    document.getElementById('encrypt-audio').addEventListener('click', () => this.handleAudioEncryption());
    document.getElementById('extract-audio').addEventListener('click', () => this.handleAudioExtraction());
    
    // Output actions
    document.getElementById('copy-output').addEventListener('click', () => this.handleCopyOutput());
    document.getElementById('burn-output').addEventListener('click', () => this.handleBurnOutput());
    
    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());
    
    // Help toggle
    document.getElementById('help-toggle').addEventListener('click', () => this.toggleHelp());
    
    // Clear and sample buttons
    document.getElementById('clear-input').addEventListener('click', () => this.clearInput());
    document.getElementById('load-sample').addEventListener('click', () => this.loadSample());
    
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
    });
    
    document.querySelectorAll('.output-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.switchOutputTab(e.target.dataset.output));
    });
  }

  /**
   * Setup drag and drop functionality
   */
  setupDragAndDrop() {
    const imageDrop = document.getElementById('image-drop');
    const audioDrop = document.getElementById('audio-drop');

    [imageDrop, audioDrop].forEach(dropZone => {
      dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
      });

      dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
      });

      dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        
        const file = e.dataTransfer.files[0];
        if (file) {
          this.handleFileDrop(file, dropZone);
        }
      });
    });
  }

  /**
   * Handle file drop
   */
  async handleFileDrop(file, dropZone) {
    if (dropZone.id === 'image-drop') {
      document.getElementById('image-input').files = [file];
      await this.updateImageInfo(file);
    } else if (dropZone.id === 'audio-drop') {
      document.getElementById('audio-input').files = [file];
      await this.updateAudioInfo(file);
    }
  }

  /**
   * Handle message input changes
   */
  handleMessageInput(message) {
    const charCount = document.getElementById('char-count');
    const entropyScore = document.getElementById('entropy-score');
    
    charCount.textContent = message.length;
    
    if (message.length > 0) {
      const entropy = this.crypto.calculateEntropy(message);
      entropyScore.textContent = `Entropy: ${entropy}/8`;
      entropyScore.style.color = entropy > 4 ? '#00ff41' : '#ffb86b';
    } else {
      entropyScore.textContent = 'Entropy: N/A';
      entropyScore.style.color = '#6b7785';
    }
  }

  /**
   * Handle password input changes
   */
  handlePasswordInput(password) {
    const strength = this.crypto.calculatePasswordStrength(password);
    const strengthFill = document.getElementById('strength-fill');
    const strengthText = document.getElementById('strength-text');
    
    // Update strength bar
    strengthFill.style.width = `${(strength.score / 8) * 100}%`;
    strengthFill.style.backgroundColor = strength.color;
    strengthFill.style.boxShadow = `0 0 10px ${strength.color}`;
    
    // Update strength text
    strengthText.textContent = `Strength: ${strength.strength.toUpperCase()} (${strength.score}/8)`;
    strengthText.style.color = strength.color;
    
    // Update crack time
    const crackTime = document.createElement('div');
    crackTime.className = 'crack-time';
    crackTime.style.color = '#6b7785';
    crackTime.style.fontSize = '0.7rem';
    crackTime.style.marginTop = '4px';
    crackTime.textContent = `Estimated crack time: ${strength.crackTime}`;
    
    // Replace existing crack time if any
    const existingCrackTime = document.querySelector('.crack-time');
    if (existingCrackTime) {
      existingCrackTime.remove();
    }
    strengthText.parentNode.appendChild(crackTime);
  }

  /**
   * Handle image encryption
   */
  async handleImageEncryption() {
    const message = document.getElementById('message-input').value;
    const password = document.getElementById('password-input').value;
    const imageFile = document.getElementById('image-input').files[0];

    if (!message || !password || !imageFile) {
      this.showError('Please provide message, password, and select an image');
      return;
    }

    this.showProgress('Encrypting message...', 'Initializing encryption with AES-256-GCM');
    
    try {
      // Encrypt the message
      const encryptedResult = await this.crypto.encrypt(
        this.crypto.stringToBytes(message), 
        password
      );

      if (!encryptedResult.success) {
        this.showError(encryptedResult.error);
        this.hideProgress();
        return;
      }

      this.showProgress('Hiding message in image...', 'Using LSB steganography with EXIF metadata');
      
      // Hide in image
      const stegoResult = await this.imageStego.hideMessage(
        imageFile, 
        encryptedResult.data, 
        password
      );

      if (!stegoResult.success) {
        this.showError(stegoResult.error);
        this.hideProgress();
        return;
      }

      // Display result
      this.displayResult(stegoResult, 'image');
      this.showOpSecAlert('Image steganography completed', 'success');
      this.hideProgress();

    } catch (error) {
      this.showError('Image encryption failed: ' + error.message);
      this.hideProgress();
    }
  }

  /**
   * Handle image extraction
   */
  async handleImageExtraction() {
    const password = document.getElementById('password-input').value;
    const imageFile = document.getElementById('image-input').files[0];

    if (!password || !imageFile) {
      this.showError('Please provide password and select an image');
      return;
    }

    this.showProgress('Extracting message from image...', 'Scanning for hidden data using LSB analysis');
    
    try {
      // Extract from image
      const extractionResult = await this.imageStego.extractMessage(imageFile, password);

      if (!extractionResult.success) {
        this.showError(extractionResult.error);
        this.hideProgress();
        return;
      }

      // Decrypt the message
      this.showProgress('Decrypting message...', 'Using AES-256-GCM with provided password');
      
      const decryptedResult = await this.crypto.decrypt(
        extractionResult.message, 
        password
      );

      if (!decryptedResult.success) {
        this.showError(decryptedResult.error);
        this.hideProgress();
        return;
      }

      // Display result
      this.displayResult(decryptedResult, 'decrypted');
      this.showOpSecAlert('Message successfully extracted', 'success');
      this.hideProgress();

    } catch (error) {
      this.showError('Image extraction failed: ' + error.message);
      this.hideProgress();
    }
  }

  /**
   * Handle audio encryption
   */
  async handleAudioEncryption() {
    const message = document.getElementById('message-input').value;
    const password = document.getElementById('password-input').value;
    const audioFile = document.getElementById('audio-input').files[0];

    if (!message || !password || !audioFile) {
      this.showError('Please provide message, password, and select an audio file');
      return;
    }

    this.showProgress('Encrypting message...', 'Initializing encryption with AES-256-GCM');
    
    try {
      // Encrypt the message
      const encryptedResult = await this.crypto.encrypt(
        this.crypto.stringToBytes(message), 
        password
      );

      if (!encryptedResult.success) {
        this.showError(encryptedResult.error);
        this.hideProgress();
        return;
      }

      this.showProgress('Hiding message in audio...', 'Using audio spectrum steganography');
      
      // Hide in audio
      const stegoResult = await this.audioStego.hideMessage(
        audioFile, 
        encryptedResult.data, 
        password
      );

      if (!stegoResult.success) {
        this.showError(stegoResult.error);
        this.hideProgress();
        return;
      }

      // Display result
      this.displayResult(stegoResult, 'audio');
      this.showOpSecAlert('Audio steganography completed', 'success');
      this.hideProgress();

    } catch (error) {
      this.showError('Audio encryption failed: ' + error.message);
      this.hideProgress();
    }
  }

  /**
   * Handle audio extraction
   */
  async handleAudioExtraction() {
    const password = document.getElementById('password-input').value;
    const audioFile = document.getElementById('audio-input').files[0];

    if (!password || !audioFile) {
      this.showError('Please provide password and select an audio file');
      return;
    }

    this.showProgress('Extracting message from audio...', 'Analyzing audio spectrum for hidden data');
    
    try {
      // Extract from audio
      const extractionResult = await this.audioStego.extractMessage(audioFile, password);

      if (!extractionResult.success) {
        this.showError(extractionResult.error);
        this.hideProgress();
        return;
      }

      // Decrypt the message
      this.showProgress('Decrypting message...', 'Using AES-256-GCM with provided password');
      
      const decryptedResult = await this.crypto.decrypt(
        extractionResult.message, 
        password
      );

      if (!decryptedResult.success) {
        this.showError(decryptedResult.error);
        this.hideProgress();
        return;
      }

      // Display result
      this.displayResult(decryptedResult, 'decrypted');
      this.showOpSecAlert('Message successfully extracted from audio', 'success');
      this.hideProgress();

    } catch (error) {
      this.showError('Audio extraction failed: ' + error.message);
      this.hideProgress();
    }
  }

  /**
   * Display operation result
   */
  displayResult(result, type) {
    const resultDisplay = document.getElementById('result-display');
    const resultSize = document.getElementById('result-size');
    const downloadBtn = document.getElementById('download-result');

    if (type === 'image') {
      // Create download link for modified image
      const url = result.modifiedImage.toDataURL('image/png');
      downloadBtn.href = url;
      downloadBtn.download = 'veilcipher_secret.png';
      downloadBtn.disabled = false;
      
      resultDisplay.innerHTML = `
        <div class="result-success">
          <i class="fas fa-check-circle"></i>
          <h3>Operation Successful</h3>
          <p>Message hidden in image using LSB steganography</p>
          <div class="result-stats">
            <div>Original Size: ${this.formatBytes(result.originalSize)}</div>
            <div>Message Size: ${this.formatBytes(result.messageSize)}</div>
            <div>Capacity Used: ${result.efficiency}%</div>
            <div>Checksum: ${result.checksum}</div>
          </div>
        </div>
      `;
      resultSize.textContent = `Size: ${this.formatBytes(result.modifiedSize)}`;

    } else if (type === 'audio') {
      // Create download link for modified audio
      downloadBtn.href = URL.createObjectURL(result.modifiedAudio);
      downloadBtn.download = 'veilcipher_secret.wav';
      downloadBtn.disabled = false;
      
      resultDisplay.innerHTML = `
        <div class="result-success">
          <i class="fas fa-check-circle"></i>
          <h3>Operation Successful</h3>
          <p>Message hidden in audio using spectrum steganography</p>
          <div class="result-stats">
            <div>Original Size: ${this.formatBytes(result.originalSize)}</div>
            <div>Message Size: ${this.formatBytes(result.messageSize)}</div>
            <div>Sample Rate: ${result.sampleRate} Hz</div>
            <div>Duration: ${result.duration.toFixed(2)} seconds</div>
          </div>
        </div>
      `;
      resultSize.textContent = `Size: ${this.formatBytes(result.modifiedAudio.size)}`;

    } else if (type === 'decrypted') {
      // Display decrypted message
      resultDisplay.innerHTML = `
        <div class="result-success">
          <i class="fas fa-unlock"></i>
          <h3>Message Decrypted</h3>
          <div class="decrypted-message">
            <pre>${result.message}</pre>
          </div>
          <div class="result-stats">
            <div>Decryption Algorithm: AES-256-GCM</div>
            <div>Timestamp: ${result.timestamp}</div>
            <div>Integrity: Verified</div>
          </div>
        </div>
      `;
      resultSize.textContent = `Size: ${this.formatBytes(result.message.length)}`;
      downloadBtn.disabled = true;
    }
  }

  /**
   * Handle copy output
   */
  handleCopyOutput() {
    const resultDisplay = document.getElementById('result-display');
    const text = resultDisplay.innerText || resultDisplay.textContent;
    
    if (text && text.trim()) {
      navigator.clipboard.writeText(text).then(() => {
        this.showOpSecAlert('Output copied to clipboard', 'success');
      }).catch(err => {
        this.showError('Failed to copy to clipboard');
      });
    }
  }

  /**
   * Handle burn output
   */
  handleBurnOutput() {
    const burnModal = document.getElementById('burn-bag-modal');
    burnModal.style.display = 'flex';
  }

  /**
   * Toggle theme
   */
  toggleTheme() {
    const themeLink = document.getElementById('theme-stylesheet');
    const currentTheme = themeLink.getAttribute('href');
    
    if (currentTheme.includes('dark-theme.css')) {
      themeLink.href = 'css/light-theme.css';
      this.showOpSecAlert('Switched to light theme', 'info');
    } else {
      themeLink.href = 'css/dark-theme.css';
      this.showOpSecAlert('Switched to dark theme', 'info');
    }
  }

  /**
   * Toggle help
   */
  toggleHelp() {
    const tutorialPanel = document.getElementById('tutorial-panel');
    const isVisible = tutorialPanel.style.display !== 'none';
    
    tutorialPanel.style.display = isVisible ? 'none' : 'block';
    
    if (!isVisible) {
      this.loadTutorialContent();
    }
  }

  /**
   * Clear input
   */
  clearInput() {
    document.getElementById('message-input').value = '';
    document.getElementById('password-input').value = '';
    document.getElementById('image-input').value = '';
    document.getElementById('audio-input').value = '';
    document.getElementById('carrier-text').value = '';
    
    // Clear file info displays
    document.getElementById('image-info').style.display = 'none';
    document.getElementById('audio-info').style.display = 'none';
    
    // Clear result display
    const resultDisplay = document.getElementById('result-display');
    resultDisplay.innerHTML = `
      <div class="placeholder-text">
        <i class="fas fa-info-circle"></i>
        <p>Execute an operation to see results here</p>
      </div>
    `;
    document.getElementById('result-size').textContent = 'Size: 0 bytes';
    document.getElementById('download-result').disabled = true;
    
    this.showOpSecAlert('Input cleared', 'info');
  }

  /**
   * Load sample data
   */
  loadSample() {
    const sampleMessage = `CLASSIFIED: Operation Shadow Veil
Target: Enemy Command Center Alpha
Coordinates: 34.0522° N, 118.2437° W
Time: 2024-03-15 23:00:00 UTC
Assets: 3 operatives, 2 extraction points
Status: Ready for deployment

// This is a sample encrypted message for demonstration purposes only.
// In a real operation, this would contain actual classified intelligence.`;

    document.getElementById('message-input').value = sampleMessage;
    this.handleMessageInput(sampleMessage);
    this.showOpSecAlert('Sample data loaded', 'info');
  }

  /**
   * Switch operation tab
   */
  switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Update operation panels
    document.querySelectorAll('.operation-panel').forEach(panel => {
      panel.classList.remove('active');
    });
    document.getElementById(tabName + '-panel').classList.add('active');
  }

  /**
   * Switch output tab
   */
  switchOutputTab(outputName) {
    // Update output tab buttons
    document.querySelectorAll('.output-tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Update output panels
    document.querySelectorAll('.output-panel').forEach(panel => {
      panel.classList.remove('active');
    });
    document.getElementById(outputName + '-output').classList.add('active');
  }

  /**
   * Update image info display
   */
  async updateImageInfo(file) {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      const info = document.getElementById('image-info');
      const filename = document.getElementById('image-filename');
      const size = document.getElementById('image-size');
      const dimensions = document.getElementById('image-dimensions');
      const format = document.getElementById('image-format');
      const capacity = document.getElementById('image-capacity');
      
      filename.textContent = file.name;
      size.textContent = this.formatBytes(file.size);
      dimensions.textContent = `${img.width} x ${img.height}`;
      format.textContent = file.type;
      
      const stego = new ImageSteganography();
      const cap = stego.calculateCapacity(img.width, img.height);
      capacity.textContent = this.formatBytes(cap);
      
      info.style.display = 'block';
      
      URL.revokeObjectURL(url);
    };
    
    img.src = url;
  }

  /**
   * Update audio info display
   */
  async updateAudioInfo(file) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const audioBuffer = await audioContext.decodeAudioData(e.target.result);
        
        const info = document.getElementById('audio-info');
        const filename = document.getElementById('audio-filename');
        const size = document.getElementById('audio-size');
        const duration = document.getElementById('audio-duration');
        const samplerate = document.getElementById('audio-samplerate');
        const capacity = document.getElementById('audio-capacity');
        
        filename.textContent = file.name;
        size.textContent = this.formatBytes(file.size);
        duration.textContent = `${audioBuffer.duration.toFixed(2)} seconds`;
        samplerate.textContent = `${audioBuffer.sampleRate} Hz`;
        
        const stego = new AudioSteganography();
        const cap = stego.calculateCapacity(audioBuffer);
        capacity.textContent = this.formatBytes(cap);
        
        info.style.display = 'block';
        
      } catch (error) {
        console.error('Failed to decode audio:', error);
      }
    };
    
    reader.readAsArrayBuffer(file);
  }

  /**
   * Show progress overlay
   */
  showProgress(title, details) {
    const overlay = document.getElementById('progress-overlay');
    const text = document.getElementById('progress-text');
    const detailsText = document.getElementById('progress-details');
    
    text.textContent = title;
    detailsText.textContent = details;
    overlay.style.display = 'flex';
  }

  /**
   * Hide progress overlay
   */
  hideProgress() {
    const overlay = document.getElementById('progress-overlay');
    overlay.style.display = 'none';
  }

  /**
   * Show operational security alert
   */
  showOpSecAlert(message, type = 'info') {
    const alertsContainer = document.getElementById('opsec-alerts');
    const alert = document.createElement('div');
    alert.className = `opsec-alert ${type}`;
    
    const icon = document.createElement('i');
    icon.className = this.getAlertIcon(type);
    
    const text = document.createElement('span');
    text.textContent = message;
    
    alert.appendChild(icon);
    alert.appendChild(text);
    
    alertsContainer.appendChild(alert);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      alert.remove();
    }, 5000);
  }

  /**
   * Get alert icon based on type
   */
  getAlertIcon(type) {
    switch (type) {
      case 'success': return 'fas fa-check-circle';
      case 'warning': return 'fas fa-exclamation-triangle';
      case 'danger': return 'fas fa-exclamation-circle';
      case 'info': return 'fas fa-info-circle';
      default: return 'fas fa-shield-alt';
    }
  }

  /**
   * Show error message
   */
  showError(message) {
    this.showOpSecAlert(message, 'danger');
    console.error('VeilCipher Error:', message);
  }

  /**
   * Start operational security monitoring
   */
  startOpSecMonitoring() {
    let sessionTime = 0;
    let operationCount = 0;
    
    setInterval(() => {
      sessionTime++;
      document.getElementById('session-time').textContent = this.formatTime(sessionTime);
      document.getElementById('operation-count').textContent = operationCount;
    }, 1000);

    // Monitor for potential security issues
    document.addEventListener('copy', () => {
      this.showOpSecAlert('Clipboard access detected', 'warning');
    });

    document.addEventListener('paste', () => {
      this.showOpSecAlert('Paste operation detected', 'info');
    });

    window.addEventListener('beforeunload', (e) => {
      e.preventDefault();
      e.returnValue = '';
      this.showOpSecAlert('Session termination detected', 'warning');
    });
  }

  /**
   * Update UI state
   */
  updateUI() {
    // Update crypto status
    const cryptoStatus = document.getElementById('crypto-status');
    if (window.crypto && window.crypto.subtle) {
      cryptoStatus.innerHTML = '<i class="fas fa-shield-check"></i><span>Crypto: Ready</span>';
    } else {
      cryptoStatus.innerHTML = '<i class="fas fa-exclamation-triangle"></i><span>Crypto: Limited</span>';
    }
  }

  /**
   * Load tutorial content
   */
  loadTutorialContent() {
    const content = document.getElementById('tutorial-content');
    content.innerHTML = `
      <div class="tutorial-section">
        <h4><i class="fas fa-graduation-cap"></i> Welcome to VeilCipher</h4>
        <p>Professional-grade steganography suite for secure communications.</p>
      </div>
      
      <div class="tutorial-section">
        <h4><i class="fas fa-lock"></i> Encryption Process</h4>
        <ol>
          <li>Enter your secret message in the input field</li>
          <li>Set a strong encryption password (12+ characters recommended)</li>
          <li>Select your carrier medium (image, audio, or text)</li>
          <li>Click "Encrypt & Hide" to conceal your message</li>
          <li>Download the modified carrier file</li>
        </ol>
      </div>
      
      <div class="tutorial-section">
        <h4><i class="fas fa-unlock"></i> Decryption Process</h4>
        <ol>
          <li>Upload the carrier file containing hidden data</li>
          <li>Enter the correct password</li>
          <li>Click "Extract" to retrieve the hidden message</li>
          <li>The message will be automatically decrypted</li>
        </ol>
      </div>
      
      <div class="tutorial-section">
        <h4><i class="fas fa-shield-alt"></i> Security Features</h4>
        <ul>
          <li><strong>AES-256-GCM:</strong> Military-grade encryption</li>
          <li><strong>LSB Steganography:</strong> Hide data in image pixels</li>
          <li><strong>Audio Spectrum:</strong> Hide data in sound frequencies</li>
          <li><strong>Zero Server Calls:</strong> Complete client-side operation</li>
          <li><strong>Burn After Reading:</strong> Self-destruct capabilities</li>
        </ul>
      </div>
      
      <div class="tutorial-section">
        <h4><i class="fas fa-exclamation-triangle"></i> Operational Security</h4>
        <ul>
          <li>Use strong, unique passwords for each operation</li>
          <li>Never share carrier files over unsecured channels</li>
          <li>Enable "Burn After Reading" for sensitive operations</li>
          <li>Monitor the OpSec sidebar for security alerts</li>
          <li>Clear browser history after completing operations</li>
        </ul>
      </div>
    `;
  }

  /**
   * Utility functions
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s].map(v => v < 10 ? '0' + v : v).join(':');
  }

  /**
   * Hide loading screen
   */
  hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const app = document.getElementById('app');
    
    // Animate loading fill to 100%
    const fill = document.getElementById('loading-fill');
    fill.style.width = '100%';
    
    setTimeout(() => {
      loadingScreen.style.opacity = '0';
      setTimeout(() => {
        loadingScreen.style.display = 'none';
        app.classList.remove('hidden');
      }, 500);
    }, 500);
  }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.veilCipherApp = new VeilCipherApp();
});