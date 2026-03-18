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
    this.textStego = textSteganography;
    this.tools = veilCipherTools;

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
      browserStatus.innerHTML =
        '<i class="fas fa-exclamation-triangle"></i><span>Browser: Limited</span>';
    }
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Message input events
    const messageInput = document.getElementById('message-input');
    if (messageInput) {
      messageInput.addEventListener('input', e => this.handleMessageInput(e.target.value));
    }

    // Password input events
    const passwordInput = document.getElementById('password-input');
    if (passwordInput) {
      passwordInput.addEventListener('input', e => this.handlePasswordInput(e.target.value));
    }

    // Operation buttons
    const encryptImageBtn = document.getElementById('encrypt-image');
    if (encryptImageBtn) {
      encryptImageBtn.addEventListener('click', () => this.handleImageEncryption());
    }

    const extractImageBtn = document.getElementById('extract-image');
    if (extractImageBtn) {
      extractImageBtn.addEventListener('click', () => this.handleImageExtraction());
    }

    const encryptAudioBtn = document.getElementById('encrypt-audio');
    if (encryptAudioBtn) {
      encryptAudioBtn.addEventListener('click', () => this.handleAudioEncryption());
    }

    const extractAudioBtn = document.getElementById('extract-audio');
    if (extractAudioBtn) {
      extractAudioBtn.addEventListener('click', () => this.handleAudioExtraction());
    }

    // Text steganography
    const encryptTextBtn = document.getElementById('encrypt-text');
    if (encryptTextBtn) {
      encryptTextBtn.addEventListener('click', () => this.handleTextEncryption());
    }

    const extractTextBtn = document.getElementById('extract-text');
    if (extractTextBtn) {
      extractTextBtn.addEventListener('click', () => this.handleTextExtraction());
    }

    // URL Decoder
    const decodeUrlBtn = document.getElementById('decode-url');
    if (decodeUrlBtn) {
      decodeUrlBtn.addEventListener('click', () => this.handleURLDecode());
    }

    const copyUrlBtn = document.getElementById('copy-url');
    if (copyUrlBtn) {
      copyUrlBtn.addEventListener('click', () => this.handleCopyURL());
    }

    // QR Code
    const downloadQrBtn = document.getElementById('download-qr');
    if (downloadQrBtn) {
      downloadQrBtn.addEventListener('click', () => this.handleDownloadQR());
    }

    const scanQrBtn = document.getElementById('scan-qr');
    if (scanQrBtn) {
      scanQrBtn.addEventListener('click', () => this.handleScanQR());
    }

    // File Encryption
    const encryptFileBtn = document.getElementById('encrypt-file');
    if (encryptFileBtn) {
      encryptFileBtn.addEventListener('click', () => this.handleFileEncryption());
    }

    const decryptFileBtn = document.getElementById('decrypt-file');
    if (decryptFileBtn) {
      decryptFileBtn.addEventListener('click', () => this.handleFileDecryption());
    }

    // Password Generator
    const generatePasswordBtn = document.getElementById('generate-password');
    if (generatePasswordBtn) {
      generatePasswordBtn.addEventListener('click', () => this.handleGeneratePassword());
    }

    const copyPasswordBtn = document.getElementById('copy-password');
    if (copyPasswordBtn) {
      copyPasswordBtn.addEventListener('click', () => this.handleCopyPassword());
    }

    // Hash Calculator
    const calculateHashBtn = document.getElementById('calculate-hash');
    if (calculateHashBtn) {
      calculateHashBtn.addEventListener('click', () => this.handleCalculateHash());
    }

    // Classic Ciphers
    const cipherEncryptBtn = document.getElementById('cipher-encrypt');
    if (cipherEncryptBtn) {
      cipherEncryptBtn.addEventListener('click', () => this.handleCipherEncrypt());
    }

    const cipherDecryptBtn = document.getElementById('cipher-decrypt');
    if (cipherDecryptBtn) {
      cipherDecryptBtn.addEventListener('click', () => this.handleCipherDecrypt());
    }

    // Cipher type change
    const cipherTypeSelect = document.getElementById('cipher-type');
    if (cipherTypeSelect) {
      cipherTypeSelect.addEventListener('change', () => this.handleCipherTypeChange());
    }

    // Password length slider
    const pwdLengthSlider = document.getElementById('pwd-length');
    const pwdLengthValue = document.getElementById('pwd-length-value');
    if (pwdLengthSlider && pwdLengthValue) {
      pwdLengthSlider.addEventListener('input', () => {
        pwdLengthValue.textContent = pwdLengthSlider.value;
      });
    }

    // Output actions
    const copyOutputBtn = document.getElementById('copy-output');
    if (copyOutputBtn) {
      copyOutputBtn.addEventListener('click', () => this.handleCopyOutput());
    }

    const burnOutputBtn = document.getElementById('burn-output');
    if (burnOutputBtn) {
      burnOutputBtn.addEventListener('click', () => this.handleBurnOutput());
    }

    // Theme toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => this.toggleTheme());
    }

    // Help toggle
    const helpToggleBtn = document.getElementById('help-toggle');
    if (helpToggleBtn) {
      helpToggleBtn.addEventListener('click', () => this.toggleHelp());
    }

    // Close tutorial sidebar button
    const closeTutorialSidebarBtn = document.getElementById('close-tutorial-sidebar');
    if (closeTutorialSidebarBtn) {
      closeTutorialSidebarBtn.addEventListener('click', () => this.toggleHelp());
    }

    // Clear and sample buttons
    const clearInputBtn = document.getElementById('clear-input');
    if (clearInputBtn) {
      clearInputBtn.addEventListener('click', () => this.clearInput());
    }

    const loadSampleBtn = document.getElementById('load-sample');
    if (loadSampleBtn) {
      loadSampleBtn.addEventListener('click', () => this.loadSample());
    }

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const tabBtn = e.currentTarget;
        this.switchTab(tabBtn.dataset.tab);
      });
    });

    document.querySelectorAll('.output-tab-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const tabBtn = e.currentTarget;
        this.switchOutputTab(tabBtn.dataset.output);
      });
    });
  }

  /**
   * Setup drag and drop functionality
   */
  setupDragAndDrop() {
    const imageDrop = document.getElementById('image-drop');
    const audioDrop = document.getElementById('audio-drop');

    if (!imageDrop || !audioDrop) {
      console.warn('Drag and drop zones not found');
      return;
    }

    [imageDrop, audioDrop].forEach(dropZone => {
      dropZone.addEventListener('dragover', e => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
      });

      dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
      });

      dropZone.addEventListener('drop', e => {
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

    this.showProgress(
      'Extracting message from image...',
      'Scanning for hidden data using LSB analysis'
    );

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

      const decryptedResult = await this.crypto.decrypt(extractionResult.message, password);

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

    this.showProgress(
      'Extracting message from audio...',
      'Analyzing audio spectrum for hidden data'
    );

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

      const decryptedResult = await this.crypto.decrypt(extractionResult.message, password);

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
      navigator.clipboard
        .writeText(text)
        .then(() => {
          this.showOpSecAlert('Output copied to clipboard', 'success');
        })
        .catch(err => {
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
    const tutorialSidebar = document.getElementById('tutorial-sidebar');
    const isVisible = tutorialSidebar.style.display !== 'none';

    if (isVisible) {
      tutorialSidebar.style.display = 'none';
      tutorialSidebar.classList.remove('visible');
    } else {
      tutorialSidebar.style.display = 'flex';
      tutorialSidebar.classList.add('visible');
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
   * Handle text encryption
   */
  async handleTextEncryption() {
    const message = document.getElementById('message-input').value;
    const password = document.getElementById('password-input').value;
    const carrierText = document.getElementById('carrier-text').value;

    const useZeroWidth = document.getElementById('use-zero-width')?.checked;
    const useHomoglyphs = document.getElementById('use-homoglyphs')?.checked;
    const useWhitespace = document.getElementById('use-whitespace')?.checked;

    if (!message || !password || !carrierText) {
      this.showError('Please provide message, password, and carrier text');
      return;
    }

    this.showProgress('Encrypting message...', 'Initializing AES-256-GCM encryption');

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

      this.showProgress(
        'Hiding message in text...',
        `Using ${useHomoglyphs ? 'homoglyph' : useWhitespace ? 'whitespace' : 'zero-width'} steganography`
      );

      // Get encoding options
      const options = {
        useZeroWidth: useZeroWidth !== false,
        useHomoglyphs: useHomoglyphs || false,
        useWhitespace: useWhitespace || false
      };

      // Hide in text
      const stegoResult = await this.textStego.hideMessage(
        carrierText,
        encryptedResult.data,
        password,
        options
      );

      if (!stegoResult.success) {
        this.showError(stegoResult.error);
        this.hideProgress();
        return;
      }

      // Display result
      this.displayTextResult(stegoResult);
      this.showOpSecAlert('Text steganography completed', 'success');
      this.hideProgress();
    } catch (error) {
      this.showError('Text encryption failed: ' + error.message);
      this.hideProgress();
    }
  }

  /**
   * Handle text extraction
   */
  async handleTextExtraction() {
    const password = document.getElementById('password-input').value;
    const carrierText = document.getElementById('carrier-text').value;

    if (!password || !carrierText) {
      this.showError('Please provide password and carrier text');
      return;
    }

    this.showProgress('Extracting message from text...', 'Analyzing text for hidden data');

    try {
      // Extract from text
      const extractionResult = await this.textStego.extractMessage(carrierText, password);

      if (!extractionResult.success) {
        this.showError(extractionResult.error);
        this.hideProgress();
        return;
      }

      // Decrypt the message
      this.showProgress('Decrypting message...', 'Using AES-256-GCM with provided password');

      const decryptedResult = await this.crypto.decrypt(extractionResult.message, password);

      if (!decryptedResult.success) {
        this.showError(decryptedResult.error);
        this.hideProgress();
        return;
      }

      // Display result
      this.displayResult(decryptedResult, 'decrypted');
      this.showOpSecAlert('Message successfully extracted from text', 'success');
      this.hideProgress();
    } catch (error) {
      this.showError('Text extraction failed: ' + error.message);
      this.hideProgress();
    }
  }

  /**
   * Handle URL decoding
   */
  handleURLDecode() {
    const urlInput = document.getElementById('url-input');
    const urlDisplay = document.getElementById('url-display');
    const urlSize = document.getElementById('url-size');

    if (!urlInput || !urlInput.value) {
      this.showError('Please enter URL-encoded text to decode');
      return;
    }

    try {
      const decoded = decodeURIComponent(urlInput.value);

      urlDisplay.innerHTML = `
        <div class="decoded-result">
          <pre style="white-space: pre-wrap; word-break: break-all;">${this.escapeHtml(decoded)}</pre>
        </div>
      `;

      urlSize.textContent = `Size: ${decoded.length} characters`;

      this.showOpSecAlert('URL decoded successfully', 'success');
    } catch (error) {
      this.showError('URL decoding failed: ' + error.message);
      urlDisplay.innerHTML = `
        <div class="placeholder-text">
          <i class="fas fa-exclamation-triangle"></i>
          <p>Invalid URL encoding</p>
        </div>
      `;
    }
  }

  /**
   * Display text steganography result
   */
  displayTextResult(result) {
    const resultDisplay = document.getElementById('result-display');
    const resultSize = document.getElementById('result-size');
    const downloadBtn = document.getElementById('download-result');

    resultDisplay.innerHTML = `
      <div class="result-success">
        <i class="fas fa-check-circle"></i>
        <h3>Operation Successful</h3>
        <p>Message hidden in text using ${result.encodingMethod} steganography</p>
        <div class="result-stats">
          <div>Original Length: ${result.originalSize} characters</div>
          <div>Modified Length: ${result.modifiedSize} characters</div>
          <div>Message Size: ${this.formatBytes(result.messageSize)}</div>
          <div>Capacity Used: ${result.efficiency}%</div>
          <div>Checksum: ${result.checksum}</div>
        </div>
      </div>
    `;

    resultSize.textContent = `Size: ${result.modifiedSize} characters`;

    // Store modified text for copying/downloading
    this.currentTextResult = result.modifiedText;

    downloadBtn.disabled = false;
    downloadBtn.onclick = () => this.downloadTextResult(result.modifiedText);
  }

  /**
   * Download text result
   */
  downloadTextResult(text) {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'veilcipher_secret.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.showOpSecAlert('Text file downloaded', 'success');
  }

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Handle file encryption
   */
  async handleFileEncryption() {
    const fileInput = document.getElementById('file-input');
    const password = document.getElementById('password-input').value;

    if (!fileInput.files[0]) {
      this.showError('Please select a file to encrypt');
      return;
    }

    if (!password) {
      this.showError('Please enter an encryption password');
      return;
    }

    this.showProgress('Encrypting file...', 'Using AES-256-GCM military-grade encryption');

    try {
      const result = await this.tools.encryptFile(fileInput.files[0], password);

      if (!result.success) {
        this.showError(result.error);
        this.hideProgress();
        return;
      }

      // Create download
      const blob = new Blob([result.data], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileInput.files[0].name + '.venc';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      this.showOpSecAlert('File encrypted successfully', 'success');
      this.hideProgress();
    } catch (error) {
      this.showError('File encryption failed: ' + error.message);
      this.hideProgress();
    }
  }

  /**
   * Handle file decryption
   */
  async handleFileDecryption() {
    const fileInput = document.getElementById('file-input');
    const password = document.getElementById('password-input').value;

    if (!fileInput.files[0]) {
      this.showError('Please select a file to decrypt');
      return;
    }

    if (!password) {
      this.showError('Please enter the decryption password');
      return;
    }

    this.showProgress('Decrypting file...', 'Using AES-256-GCM decryption');

    try {
      const arrayBuffer = await fileInput.files[0].arrayBuffer();
      const result = await this.tools.decryptFile(arrayBuffer, password);

      if (!result.success) {
        this.showError(result.error);
        this.hideProgress();
        return;
      }

      // Create download
      const blob = new Blob([result.data], {
        type: result.metadata.originalType || 'application/octet-stream'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.metadata.originalName || 'decrypted_file';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      this.showOpSecAlert('File decrypted successfully', 'success');
      this.hideProgress();
    } catch (error) {
      this.showError('File decryption failed: ' + error.message);
      this.hideProgress();
    }
  }

  /**
   * Handle password generation
   */
  async handleGeneratePassword() {
    const length = parseInt(document.getElementById('pwd-length').value);
    const options = {
      uppercase: document.getElementById('pwd-uppercase')?.checked || true,
      lowercase: document.getElementById('pwd-lowercase')?.checked || true,
      numbers: document.getElementById('pwd-numbers')?.checked || true,
      symbols: document.getElementById('pwd-symbols')?.checked || true,
      excludeAmbiguous: document.getElementById('pwd-ambiguous')?.checked || false
    };

    try {
      const password = await this.tools.generatePassword(length, options);

      // Display in result panel
      const resultDisplay = document.getElementById('result-display');
      const resultSize = document.getElementById('result-size');

      resultDisplay.innerHTML = `
        <div class="result-success">
          <i class="fas fa-key"></i>
          <h3>Password Generated</h3>
          <div class="generated-password" style="font-family: var(--font-mono); font-size: 1.1rem; padding: var(--spacing-md); background: var(--bg-tertiary); border-radius: 4px; margin: var(--spacing-md) 0; word-break: break-all;">
            ${password}
          </div>
          <div class="result-stats">
            <div>Length: ${password.length} characters</div>
            <div>Entropy: ~${Math.round(password.length * Math.log2(94))} bits</div>
            <div>Strength: Military Grade</div>
          </div>
        </div>
      `;

      resultSize.textContent = `Size: ${password.length} characters`;

      // Store for copying
      this.currentPassword = password;

      this.showOpSecAlert('Password generated successfully', 'success');
    } catch (error) {
      this.showError('Password generation failed: ' + error.message);
    }
  }

  /**
   * Handle copy password
   */
  handleCopyPassword() {
    if (this.currentPassword) {
      navigator.clipboard.writeText(this.currentPassword).then(() => {
        this.showOpSecAlert('Password copied to clipboard', 'success');
      });
    } else {
      this.showError('Generate a password first');
    }
  }

  /**
   * Handle copy URL result
   */
  handleCopyURL() {
    const urlDisplay = document.getElementById('url-display');
    const pre = urlDisplay?.querySelector('pre');

    if (pre && pre.textContent) {
      navigator.clipboard.writeText(pre.textContent).then(() => {
        this.showOpSecAlert('URL decoded text copied to clipboard', 'success');
      });
    } else {
      this.showError('No decoded URL to copy');
    }
  }

  /**
   * Handle download QR code
   */
  handleDownloadQR() {
    const resultDisplay = document.getElementById('result-display');
    const result = resultDisplay?.querySelector('.generated-password, .decoded-result');

    if (result && result.textContent) {
      // Generate QR code using a simple canvas-based approach
      this.generateAndDownloadQR(result.textContent);
    } else {
      this.showError('No content to generate QR code from. Run an operation first.');
    }
  }

  /**
   * Generate and download QR code
   */
  generateAndDownloadQR(text) {
    // Use Google Charts API to generate QR code
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`;

    // Create download link
    fetch(qrUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'veilcipher-qrcode.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.showOpSecAlert('QR code downloaded', 'success');
      })
      .catch(error => {
        this.showError('QR code generation failed: ' + error.message);
      });
  }

  /**
   * Handle scan QR code
   */
  handleScanQR() {
    this.showOpSecAlert('QR scanning requires camera access. Feature coming soon.', 'info');
    // Future: Implement camera-based QR scanning
  }

  /**
   * Handle hash calculation
   */
  async handleCalculateHash() {
    const hashInput = document.getElementById('hash-input');
    const hashFileInput = document.getElementById('hash-file-input');

    let text = hashInput?.value || '';

    // If file is selected, read it
    if (hashFileInput && hashFileInput.files[0]) {
      this.showProgress('Calculating hash...', 'Reading file and computing hashes');
      try {
        const arrayBuffer = await hashFileInput.files[0].arrayBuffer();
        text = new TextDecoder().decode(arrayBuffer);
      } catch (error) {
        this.showError('Failed to read file: ' + error.message);
        this.hideProgress();
        return;
      }
    }

    if (!text) {
      this.showError('Please enter text or select a file');
      return;
    }

    this.showProgress('Calculating hashes...', 'Computing SHA-256, SHA-512, and MD5');

    try {
      const [sha256, sha512, md5] = await Promise.all([
        this.tools.sha256(text),
        this.tools.sha512(text),
        this.tools.md5(text)
      ]);

      const resultDisplay = document.getElementById('result-display');
      const resultSize = document.getElementById('result-size');

      resultDisplay.innerHTML = `
        <div class="result-success">
          <i class="fas fa-fingerprint"></i>
          <h3>Hash Calculated</h3>
          <div class="hash-results" style="margin: var(--spacing-md) 0;">
            <div style="margin-bottom: var(--spacing-md);">
              <strong style="color: var(--accent-primary);">SHA-256:</strong>
              <div style="font-family: var(--font-mono); font-size: 0.75rem; word-break: break-all; padding: var(--spacing-sm); background: var(--bg-tertiary); border-radius: 4px; margin-top: var(--spacing-xs);">
                ${sha256}
              </div>
            </div>
            <div style="margin-bottom: var(--spacing-md);">
              <strong style="color: var(--accent-primary);">SHA-512:</strong>
              <div style="font-family: var(--font-mono); font-size: 0.75rem; word-break: break-all; padding: var(--spacing-sm); background: var(--bg-tertiary); border-radius: 4px; margin-top: var(--spacing-xs);">
                ${sha512}
              </div>
            </div>
            <div>
              <strong style="color: var(--accent-primary);">MD5:</strong>
              <div style="font-family: var(--font-mono); font-size: 0.75rem; word-break: break-all; padding: var(--spacing-sm); background: var(--bg-tertiary); border-radius: 4px; margin-top: var(--spacing-xs);">
                ${md5}
              </div>
            </div>
          </div>
        </div>
      `;

      resultSize.textContent = `Input: ${text.length} characters`;
      this.showOpSecAlert('Hashes calculated successfully', 'success');
      this.hideProgress();
    } catch (error) {
      this.showError('Hash calculation failed: ' + error.message);
      this.hideProgress();
    }
  }

  /**
   * Handle cipher type change
   */
  handleCipherTypeChange() {
    const cipherType = document.getElementById('cipher-type')?.value;
    const keyInput = document.getElementById('cipher-key-input');
    const keyLabel = document.querySelector('#cipher-key-input label');

    if (keyInput) {
      // Show key input for ciphers that need it
      const needsKey = ['caesar', 'vigenere', 'affine', 'railfence', 'xor', 'rc4'].includes(
        cipherType
      );
      keyInput.style.display = needsKey ? 'block' : 'none';

      // Update label based on cipher type
      if (keyLabel) {
        const labels = {
          caesar: 'SHIFT VALUE',
          vigenere: 'KEYWORD',
          affine: 'KEYS (a, b)',
          railfence: 'NUMBER OF RAILS',
          xor: 'KEY',
          rc4: 'KEY'
        };
        keyLabel.innerHTML = `<i class="fas fa-key"></i> ${labels[cipherType] || 'KEY'}`;
      }
    }
  }

  /**
   * Handle cipher encryption
   */
  handleCipherEncrypt() {
    const cipherType = document.getElementById('cipher-type')?.value;
    const cipherInput = document.getElementById('cipher-input')?.value;
    const cipherKey = document.getElementById('cipher-key')?.value;

    if (!cipherInput) {
      this.showError('Please enter text to encrypt');
      return;
    }

    try {
      let result = '';

      switch (cipherType) {
        case 'caesar': {
          const shift = parseInt(cipherKey) || 3;
          result = this.tools.caesarEncrypt(cipherInput, shift);
          break;
        }
        case 'rot13': {
          result = this.tools.rot13(cipherInput);
          break;
        }
        case 'affine': {
          const [a, b] = cipherKey.split(',').map(n => parseInt(n.trim()));
          if (!a || b === undefined) {
            this.showError('Please enter keys as "a, b" (e.g., "5, 8")');
            return;
          }
          result = this.tools.affineEncrypt(cipherInput, a, b);
          break;
        }
        case 'vigenere': {
          if (!cipherKey) {
            this.showError('Please enter a key for Vigenère cipher');
            return;
          }
          result = this.tools.vigenereEncrypt(cipherInput, cipherKey);
          break;
        }
        case 'railfence': {
          const rails = parseInt(cipherKey) || 3;
          result = this.tools.railFenceEncrypt(cipherInput, rails);
          break;
        }
        case 'atbash': {
          result = this.tools.atbash(cipherInput);
          break;
        }
        case 'a1z26': {
          result = this.tools.a1z26Encode(cipherInput);
          break;
        }
        case 'polybius': {
          result = this.tools.polybiusEncrypt(cipherInput);
          break;
        }
        case 'nato': {
          result = this.tools.natoEncode(cipherInput);
          break;
        }
        case 'xor': {
          if (!cipherKey) {
            this.showError('Please enter a key for XOR cipher');
            return;
          }
          result = this.tools.xorEncrypt(cipherInput, cipherKey);
          break;
        }
        case 'rc4': {
          if (!cipherKey) {
            this.showError('Please enter a key for RC4 cipher');
            return;
          }
          result = this.tools.rc4(cipherInput, cipherKey);
          break;
        }
        case 'base64': {
          result = this.tools.base64Encode(cipherInput);
          break;
        }
        case 'binary': {
          result = this.tools.binaryEncode(cipherInput);
          break;
        }
        case 'hex': {
          result = this.tools.hexEncode(cipherInput);
          break;
        }
        case 'morse': {
          result = this.tools.morseEncode(cipherInput);
          break;
        }
        default: {
          this.showError('Unknown cipher type');
          return;
        }
      }

      const resultDisplay = document.getElementById('result-display');
      const resultSize = document.getElementById('result-size');

      resultDisplay.innerHTML = `
        <div class="result-success">
          <i class="fas fa-lock"></i>
          <h3>Encrypted</h3>
          <div style="font-family: var(--font-mono); font-size: 0.9rem; padding: var(--spacing-md); background: var(--bg-tertiary); border-radius: 4px; margin: var(--spacing-md) 0; word-break: break-all; white-space: pre-wrap;">
            ${result}
          </div>
          <div class="result-stats">
            <div>Cipher: ${cipherType.toUpperCase()}</div>
            <div>Output Length: ${result.length} characters</div>
          </div>
        </div>
      `;

      resultSize.textContent = `Size: ${result.length} characters`;
      this.currentCipherResult = result;
      this.showOpSecAlert('Text encrypted successfully', 'success');
    } catch (error) {
      this.showError('Encryption failed: ' + error.message);
    }
  }

  /**
   * Handle cipher decryption
   */
  handleCipherDecrypt() {
    const cipherType = document.getElementById('cipher-type')?.value;
    const cipherInput = document.getElementById('cipher-input')?.value;
    const cipherKey = document.getElementById('cipher-key')?.value;

    if (!cipherInput) {
      this.showError('Please enter text to decrypt');
      return;
    }

    try {
      let result = '';

      switch (cipherType) {
        case 'caesar': {
          const shift = parseInt(cipherKey) || 3;
          result = this.tools.caesarDecrypt(cipherInput, shift);
          break;
        }
        case 'rot13': {
          result = this.tools.rot13(cipherInput);
          break;
        }
        case 'affine': {
          const [a, b] = cipherKey.split(',').map(n => parseInt(n.trim()));
          if (!a || b === undefined) {
            this.showError('Please enter keys as "a, b" (e.g., "5, 8")');
            return;
          }
          result = this.tools.affineDecrypt(cipherInput, a, b);
          break;
        }
        case 'vigenere': {
          if (!cipherKey) {
            this.showError('Please enter a key for Vigenère cipher');
            return;
          }
          result = this.tools.vigenereDecrypt(cipherInput, cipherKey);
          break;
        }
        case 'railfence': {
          const rails = parseInt(cipherKey) || 3;
          result = this.tools.railFenceDecrypt(cipherInput, rails);
          break;
        }
        case 'atbash': {
          result = this.tools.atbash(cipherInput);
          break;
        }
        case 'a1z26': {
          result = this.tools.a1z26Decode(cipherInput);
          break;
        }
        case 'polybius': {
          result = this.tools.polybiusDecrypt(cipherInput);
          break;
        }
        case 'nato': {
          result = this.tools.natoDecode(cipherInput);
          break;
        }
        case 'xor': {
          if (!cipherKey) {
            this.showError('Please enter a key for XOR cipher');
            return;
          }
          result = this.tools.xorDecrypt(cipherInput, cipherKey);
          break;
        }
        case 'rc4': {
          if (!cipherKey) {
            this.showError('Please enter a key for RC4 cipher');
            return;
          }
          result = this.tools.rc4Decrypt(cipherInput, cipherKey);
          break;
        }
        case 'base64': {
          result = this.tools.base64Decode(cipherInput);
          break;
        }
        case 'binary': {
          result = this.tools.binaryDecode(cipherInput);
          break;
        }
        case 'hex': {
          result = this.tools.hexDecode(cipherInput);
          break;
        }
        case 'morse': {
          result = this.tools.morseDecode(cipherInput);
          break;
        }
        default: {
          this.showError('Unknown cipher type');
          return;
        }
      }

      const resultDisplay = document.getElementById('result-display');
      const resultSize = document.getElementById('result-size');

      resultDisplay.innerHTML = `
        <div class="result-success">
          <i class="fas fa-unlock"></i>
          <h3>Decrypted</h3>
          <div style="font-family: var(--font-mono); font-size: 0.9rem; padding: var(--spacing-md); background: var(--bg-tertiary); border-radius: 4px; margin: var(--spacing-md) 0; word-break: break-all; white-space: pre-wrap;">
            ${result}
          </div>
          <div class="result-stats">
            <div>Cipher: ${cipherType.toUpperCase()}</div>
            <div>Output Length: ${result.length} characters</div>
          </div>
        </div>
      `;

      resultSize.textContent = `Size: ${result.length} characters`;
      this.currentCipherResult = result;
      this.showOpSecAlert('Text decrypted successfully', 'success');
    } catch (error) {
      this.showError('Decryption failed: ' + error.message);
    }
  }

  /**
   * Handle network simulation (removed - placeholder)
   */
  handleNetworkSimulation() {
    this.showError('Network simulation has been replaced with Text Steganography');
  }

  /**
   * Handle traffic analysis (removed - placeholder)
   */
  handleAnalyzeTraffic() {
    this.showError('Traffic analysis has been replaced with Text Steganography');
  }

  /**
   * Switch operation tab
   */
  switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`.tab-btn[data-tab="${tabName}"]`).classList.add('active');

    // Update operation panels
    document.querySelectorAll('.operation-panel').forEach(panel => {
      panel.classList.remove('active');
    });
    document.getElementById(tabName + '-panel').classList.add('active');

    // Close tutorial sidebar when switching tabs
    const tutorialSidebar = document.getElementById('tutorial-sidebar');
    if (tutorialSidebar && tutorialSidebar.style.display !== 'none') {
      tutorialSidebar.style.display = 'none';
      tutorialSidebar.classList.remove('visible');
    }
  }

  /**
   * Switch output tab
   */
  switchOutputTab(outputName) {
    // Update output tab buttons
    document.querySelectorAll('.output-tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`.output-tab-btn[data-output="${outputName}"]`).classList.add('active');

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

    reader.onload = async e => {
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
      case 'success':
        return 'fas fa-check-circle';
      case 'warning':
        return 'fas fa-exclamation-triangle';
      case 'danger':
        return 'fas fa-exclamation-circle';
      case 'info':
        return 'fas fa-info-circle';
      default:
        return 'fas fa-shield-alt';
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
    const operationCount = 0;

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

    window.addEventListener('beforeunload', e => {
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
      cryptoStatus.innerHTML =
        '<i class="fas fa-exclamation-triangle"></i><span>Crypto: Limited</span>';
    }
  }

  /**
   * Load tutorial content based on active tab
   */
  loadTutorialContent() {
    const activeTab = document.querySelector('.tab-btn.active');
    const tabName = activeTab ? activeTab.dataset.tab : 'image';
    const content = document.getElementById('tutorial-sidebar-content');

    const tutorials = {
      image: `
        <div class="tutorial-section">
          <h4><i class="fas fa-image"></i> Image Steganography</h4>
          <p>Hide encrypted messages within image files using LSB (Least Significant Bit) steganography. This technique modifies the least significant bits of pixel colors, making changes imperceptible to the human eye.</p>
        </div>
        <div class="tutorial-section">
          <h4><i class="fas fa-history"></i> Historical Context</h4>
          <p>Steganography dates back to ancient Greece where messages were tattooed on shaved heads and hidden under regrown hair. Digital steganography emerged in the 1980s with the rise of computers.</p>
        </div>
        <div class="tutorial-section">
          <h4><i class="fas fa-upload"></i> Step 1: Select Image</h4>
          <ul>
            <li>Drag & drop or click to browse</li>
            <li>Formats: PNG, JPG, JPEG</li>
            <li><strong>Recommended:</strong> PNG for lossless quality</li>
            <li>Larger images = more hiding capacity</li>
          </ul>
        </div>
        <div class="tutorial-section">
          <h4><i class="fas fa-lock"></i> Step 2: Encrypt & Hide</h4>
          <ol>
            <li>Enter secret message (left panel)</li>
            <li>Set strong password (12+ characters)</li>
            <li>Message is encrypted with AES-256-GCM</li>
            <li>Click "Encrypt & Hide in Image"</li>
          </ol>
        </div>
        <div class="tutorial-section">
          <h4><i class="fas fa-download"></i> Step 3: Download</h4>
          <ul>
            <li>Download modified image</li>
            <li>Image appears identical to original</li>
            <li>Share through normal channels</li>
          </ul>
        </div>
        <div class="tutorial-section">
          <h4><i class="fas fa-info-circle"></i> Technical Details</h4>
          <ul>
            <li><strong>Method:</strong> LSB embedding in RGB channels</li>
            <li><strong>Capacity:</strong> ~3 bits per pixel</li>
            <li><strong>Encryption:</strong> AES-256-GCM authenticated encryption</li>
            <li><strong>Security:</strong> 100,000 PBKDF2 iterations</li>
            <li><strong>Detection:</strong> Extremely difficult without knowing the algorithm</li>
          </ul>
        </div>
      `,

      audio: `
        <div class="tutorial-section">
          <h4><i class="fas fa-music"></i> Audio Steganography</h4>
          <p>Conceal encrypted messages within audio files using spectrum-based steganography. Data is hidden in audio samples above the human hearing threshold.</p>
        </div>
        <div class="tutorial-section">
          <h4><i class="fas fa-history"></i> Historical Context</h4>
          <p>Audio steganography was used during the Cold War. Modern techniques can hide data in MP3, WAV, and other audio formats without affecting perceived quality.</p>
        </div>
        <div class="tutorial-section">
          <h4><i class="fas fa-upload"></i> Step 1: Select Audio</h4>
          <ul>
            <li>Drag & drop or click to browse</li>
            <li>Formats: WAV, MP3</li>
            <li><strong>Recommended:</strong> WAV for best quality</li>
            <li>Longer audio = more capacity</li>
          </ul>
        </div>
        <div class="tutorial-section">
          <h4><i class="fas fa-lock"></i> Step 2: Encrypt & Hide</h4>
          <ol>
            <li>Enter secret message</li>
            <li>Set encryption password</li>
            <li>Click "Encrypt & Hide in Audio"</li>
          </ol>
        </div>
        <div class="tutorial-section">
          <h4><i class="fas fa-info-circle"></i> Technical Details</h4>
          <ul>
            <li><strong>Method:</strong> LSB manipulation of audio samples</li>
            <li><strong>Sample Rate:</strong> 44.1kHz standard</li>
            <li><strong>Threshold:</strong> Only modifies samples above 0.01 amplitude</li>
            <li><strong>Quality:</strong> Inaudible changes</li>
          </ul>
        </div>
      `,

      text: `
        <div class="tutorial-section">
          <h4><i class="fas fa-font"></i> Text Steganography</h4>
          <p>Hide messages within innocent-looking text using Unicode techniques. Three methods available: zero-width characters, homoglyph substitution, and whitespace encoding.</p>
        </div>
        <div class="tutorial-section">
          <h4><i class="fas fa-history"></i> Historical Context</h4>
          <p>Text steganography includes historical methods like null ciphers (hidden messages in apparent text) and modern Unicode-based techniques that exploit character encoding.</p>
        </div>
        <div class="tutorial-section">
          <h4><i class="fas fa-cog"></i> Encoding Methods</h4>
          <ul>
            <li><strong>Zero-Width Characters:</strong> Uses invisible Unicode characters (U+200B, U+200C, U+200D, U+FEFF) - 2 bits per character</li>
            <li><strong>Homoglyphs:</strong> Replaces Latin letters with visually similar Cyrillic/Greek characters</li>
            <li><strong>Whitespace:</strong> Encodes data in trailing spaces and tabs</li>
          </ul>
        </div>
        <div class="tutorial-section">
          <h4><i class="fas fa-lock"></i> How to Use</h4>
          <ol>
            <li>Enter carrier text or select encoding method</li>
            <li>Enter secret message and password</li>
            <li>Click "Encrypt & Hide in Text"</li>
            <li>Download modified text file</li>
          </ol>
        </div>
        <div class="tutorial-section">
          <h4><i class="fas fa-shield-alt"></i> Security</h4>
          <ul>
            <li><strong>Zero-Width:</strong> Completely invisible, undetectable visually</li>
            <li><strong>Homoglyphs:</strong> Nearly identical appearance</li>
            <li><strong>Whitespace:</strong> Hidden at line endings</li>
          </ul>
        </div>
      `,

      file: `
        <div class="tutorial-section">
          <h4><i class="fas fa-file-shield"></i> File Encryption</h4>
          <p>Military-grade AES-256-GCM file encryption. Any file type can be encrypted and later decrypted with the correct password.</p>
        </div>
        <div class="tutorial-section">
          <h4><i class="fas fa-history"></i> About AES-256-GCM</h4>
          <p>AES (Advanced Encryption Standard) is used by governments and militaries worldwide. GCM (Galois/Counter Mode) provides both confidentiality and authentication.</p>
        </div>
        <div class="tutorial-section">
          <h4><i class="fas fa-lock"></i> Encrypt Files</h4>
          <ol>
            <li>Select any file to encrypt</li>
            <li>Enter strong password</li>
            <li>Click "Encrypt File"</li>
            <li>Download .venc encrypted file</li>
          </ol>
        </div>
        <div class="tutorial-section">
          <h4><i class="fas fa-unlock"></i> Decrypt Files</h4>
          <ol>
            <li>Select .venc file</li>
            <li>Enter decryption password</li>
            <li>Click "Decrypt File"</li>
            <li>Original file is restored</li>
          </ol>
        </div>
        <div class="tutorial-section">
          <h4><i class="fas fa-shield-alt"></i> Security Features</h4>
          <ul>
            <li><strong>Algorithm:</strong> AES-256-GCM (256-bit key)</li>
            <li><strong>Key Derivation:</strong> PBKDF2 with 100,000 iterations</li>
            <li><strong>Authentication:</strong> 128-bit authentication tag</li>
            <li><strong>Salt:</strong> 16 bytes random data per encryption</li>
            <li><strong>IV:</strong> 12 bytes random initialization vector</li>
          </ul>
        </div>
      `,

      password: `
        <div class="tutorial-section">
          <h4><i class="fas fa-key"></i> Password Generator</h4>
          <p>Generate cryptographically secure passwords using hardware-based random number generation.</p>
        </div>
        <div class="tutorial-section">
          <h4><i class="fas fa-history"></i> Password Security</h4>
          <p>Weak passwords cause 81% of data breaches. A 32-character password with mixed character types provides ~208 bits of entropy, making brute-force attacks computationally infeasible.</p>
        </div>
        <div class="tutorial-section">
          <h4><i class="fas fa-cog"></i> Options</h4>
          <ul>
            <li><strong>Length:</strong> 8-128 characters</li>
            <li><strong>Uppercase:</strong> A-Z (26 characters)</li>
            <li><strong>Lowercase:</strong> a-z (26 characters)</li>
            <li><strong>Numbers:</strong> 0-9 (10 characters)</li>
            <li><strong>Symbols:</strong> !@#$%^&* etc. (varies)</li>
            <li><strong>Exclude Ambiguous:</strong> Remove 0,O,1,l,I</li>
          </ul>
        </div>
        <div class="tutorial-section">
          <h4><i class="fas fa-random"></i> Generate</h4>
          <ol>
            <li>Set desired length</li>
            <li>Choose character types</li>
            <li>Click "Generate Password"</li>
            <li>Click "Copy" to copy</li>
          </ol>
        </div>
        <div class="tutorial-section">
          <h4><i class="fas fa-shield-alt"></i> Security</h4>
          <ul>
            <li><strong>Source:</strong> crypto.getRandomValues() (CSPRNG)</li>
            <li><strong>Entropy:</strong> ~6.5 bits per character</li>
            <li><strong>32 chars:</strong> ~208 bits entropy</li>
            <li><strong>Crack Time:</strong> Centuries with current technology</li>
          </ul>
        </div>
      `,

      hash: `
        <div class="tutorial-section">
          <h4><i class="fas fa-fingerprint"></i> Hash Calculator</h4>
          <p>Calculate cryptographic hash functions for data integrity verification and digital fingerprints.</p>
        </div>
        <div class="tutorial-section">
          <h4><i class="fas fa-history"></i> Hash Functions</h4>
          <p>Cryptographic hash functions are one-way functions that produce fixed-size outputs. They're used in digital signatures, password storage, and blockchain technology.</p>
        </div>
        <div class="tutorial-section">
          <h4><i class="fas fa-calculator"></i> Supported Hashes</h4>
          <ul>
            <li><strong>SHA-256:</strong> 256-bit output (64 hex characters). Part of SHA-2 family, used in Bitcoin and TLS.</li>
            <li><strong>SHA-512:</strong> 512-bit output (128 hex characters). More secure variant of SHA-2.</li>
            <li><strong>MD5:</strong> 128-bit output (32 hex characters). Legacy hash, fast but not collision-resistant.</li>
          </ul>
        </div>
        <div class="tutorial-section">
          <h4><i class="fas fa-keyboard"></i> How to Use</h4>
          <ol>
            <li>Enter text or select file</li>
            <li>Click "Calculate Hash"</li>
            <li>View all hash values</li>
          </ol>
        </div>
        <div class="tutorial-section">
          <h4><i class="fas fa-info-circle"></i> Use Cases</h4>
          <ul>
            <li>File integrity verification</li>
            <li>Password hashing (with salt)</li>
            <li>Digital signatures</li>
            <li>Data fingerprinting</li>
            <li>Blockchain and cryptocurrencies</li>
          </ul>
        </div>
      `,

      cipher: `
        <div class="tutorial-section">
          <h4><i class="fas fa-lock"></i> Classic Ciphers Encyclopedia</h4>
          <p>Comprehensive collection of historical and modern encryption algorithms. Learn about cryptography through hands-on experimentation.</p>
        </div>
        <div class="tutorial-section">
          <h4><i class="fas fa-history"></i> Cryptography History</h4>
          <p>From Caesar's shift cipher (58 BC) to modern AES encryption, cryptography has shaped military and diplomatic history. The word comes from Greek "kryptos" (hidden) and "graphein" (writing).</p>
        </div>
        <div class="tutorial-section">
          <h4><i class="fas fa-key"></i> Substitution Ciphers</h4>
          <ul>
            <li><strong>Caesar:</strong> Shift each letter by fixed positions. Used by Julius Caesar.</li>
            <li><strong>ROT13:</strong> Special case with shift=13. Self-inverse (encrypt = decrypt).</li>
            <li><strong>Atbash:</strong> Reverse alphabet (A↔Z, B↔Y). Ancient Hebrew cipher.</li>
            <li><strong>Affine:</strong> Mathematical function (ax + b) mod 26. Requires coprime 'a'.</li>
            <li><strong>Vigenère:</strong> Polyalphabetic cipher using keyword. "Indecipherable" for 300 years.</li>
          </ul>
        </div>
        <div class="tutorial-section">
          <h4><i class="fas fa-th"></i> Transposition & Other Ciphers</h4>
          <ul>
            <li><strong>Rail Fence:</strong> Write in zigzag pattern, read by rows.</li>
            <li><strong>A1Z26:</strong> Simple number substitution (A=1, B=2...Z=26).</li>
            <li><strong>Polybius Square:</strong> 5×5 grid converts letters to coordinate pairs.</li>
            <li><strong>NATO Phonetic:</strong> Military spelling alphabet (Alpha, Bravo, Charlie...).</li>
          </ul>
        </div>
        <div class="tutorial-section">
          <h4><i class="fas fa-shield-alt"></i> Modern Stream Ciphers</h4>
          <ul>
            <li><strong>XOR Cipher:</strong> Bitwise XOR with repeating key. Simple but effective with long keys.</li>
            <li><strong>RC4:</strong> Rivest Cipher 4 (1987). Fast stream cipher, used in SSL/TLS and WEP.</li>
          </ul>
        </div>
        <div class="tutorial-section">
          <h4><i class="fas fa-code"></i> Encodings (Not Encryption)</h4>
          <ul>
            <li><strong>Base64:</strong> Binary-to-text encoding. 33% size increase.</li>
            <li><strong>Binary:</strong> Text to 8-bit binary representation.</li>
            <li><strong>Hexadecimal:</strong> Text to base-16 (0-9, A-F).</li>
            <li><strong>Morse Code:</strong> Dots and dashes for telegraphy.</li>
          </ul>
        </div>
        <div class="tutorial-section">
          <h4><i class="fas fa-cog"></i> How to Use</h4>
          <ol>
            <li>Select cipher type from dropdown</li>
            <li>Enter text to encrypt/decrypt</li>
            <li>Enter key if required (shift, keyword, etc.)</li>
            <li>Click Encrypt or Decrypt</li>
          </ol>
        </div>
      `,

      url: `
        <div class="tutorial-section">
          <h4><i class="fas fa-link"></i> URL Decoder</h4>
          <p>Decode URL-encoded (percent-encoded) text to reveal hidden messages or analyze suspicious links.</p>
        </div>
        <div class="tutorial-section">
          <h4><i class="fas fa-history"></i> URL Encoding</h4>
          <p>URL encoding converts special characters to %XX format where XX is the hex ASCII value. Used to transmit data in URLs safely.</p>
        </div>
        <div class="tutorial-section">
          <h4><i class="fas fa-keyboard"></i> How to Use</h4>
          <ol>
            <li>Paste URL-encoded text</li>
            <li>Click "Decode URL"</li>
            <li>View decoded result</li>
          </ol>
        </div>
        <div class="tutorial-section">
          <h4><i class="fas fa-shield-alt"></i> Use Cases</h4>
          <ul>
            <li><strong>Security Analysis:</strong> Decode obfuscated malicious URLs</li>
            <li><strong>Hidden Messages:</strong> Reveal steganographic content</li>
            <li><strong>Web Development:</strong> Debug form data and query strings</li>
            <li><strong>CTF Challenges:</strong> Solve capture-the-flag puzzles</li>
          </ul>
        </div>
        <div class="tutorial-section">
          <h4><i class="fas fa-info-circle"></i> Examples</h4>
          <ul>
            <li><code>%48%65%6C%6C%6F</code> → <strong>Hello</strong></li>
            <li><code>%3Cscript%3E</code> → <strong>&lt;script&gt;</strong></li>
            <li><code>https%3A%2F%2F</code> → <strong>https://</strong></li>
          </ul>
        </div>
      `
    };

    content.innerHTML = tutorials[tabName] || tutorials.image;
  }

  /**
   * Utility functions
   */
  formatBytes(bytes) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s].map(v => (v < 10 ? '0' + v : v)).join(':');
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

  /**
   * Apply password preset
   */
  static applyPasswordPreset(preset) {
    const presets = {
      basic: {
        length: 8,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: false,
        excludeAmbiguous: false
      },
      standard: {
        length: 12,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
        excludeAmbiguous: false
      },
      strong: {
        length: 16,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
        excludeAmbiguous: false
      },
      maximum: {
        length: 32,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
        excludeAmbiguous: false
      },
      nosymbols: {
        length: 16,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: false,
        excludeAmbiguous: false
      },
      easyread: {
        length: 12,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: false,
        excludeAmbiguous: true
      }
    };

    const config = presets[preset];
    if (!config) return;

    document.getElementById('pwd-length').value = config.length;
    document.getElementById('pwd-length-value').textContent = config.length;
    document.getElementById('pwd-uppercase').checked = config.uppercase;
    document.getElementById('pwd-lowercase').checked = config.lowercase;
    document.getElementById('pwd-numbers').checked = config.numbers;
    document.getElementById('pwd-symbols').checked = config.symbols;
    document.getElementById('pwd-ambiguous').checked = config.excludeAmbiguous;

    if (window.veilCipherApp) {
      window.veilCipherApp.showOpSecAlert(`Password preset: ${preset}`, 'info');
    }
  }

  /**
   * Apply hash sample
   */
  static applyHashSample(sample) {
    const samples = {
      hello: 'Hello, World!',
      fox: 'The quick brown fox jumps over the lazy dog',
      veilcipher: 'VeilCipher - Professional Steganography Suite',
      alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };

    const hashInput = document.getElementById('hash-input');
    if (hashInput && samples[sample]) {
      hashInput.value = samples[sample];
      if (window.veilCipherApp) {
        window.veilCipherApp.showOpSecAlert('Hash sample loaded', 'info');
      }
    }
  }

  /**
   * Apply cipher sample text
   */
  static applyCipherSample(sample) {
    const samples = {
      hello: 'HELLO WORLD',
      fox: 'THE QUICK BROWN FOX',
      secret: 'SECRET MESSAGE',
      attack: 'ATTACK AT DAWN',
      meet: 'MEET ME AT NOON'
    };

    const cipherInput = document.getElementById('cipher-input');
    if (cipherInput && samples[sample]) {
      cipherInput.value = samples[sample];
      if (window.veilCipherApp) {
        window.veilCipherApp.showOpSecAlert('Cipher sample loaded', 'info');
      }
    }
  }

  /**
   * Apply cipher key preset
   */
  static applyCipherKey(type, value) {
    const cipherTypeSelect = document.getElementById('cipher-type');
    const cipherKeyInput = document.getElementById('cipher-key');

    if (!cipherTypeSelect || !cipherKeyInput) return;

    // Set cipher type if needed
    if (type === 'caesar' && cipherTypeSelect.value !== 'caesar') {
      cipherTypeSelect.value = 'caesar';
      if (window.veilCipherApp) {
        window.veilCipherApp.handleCipherTypeChange();
      }
    } else if (type === 'vigenere' && cipherTypeSelect.value !== 'vigenere') {
      cipherTypeSelect.value = 'vigenere';
      if (window.veilCipherApp) {
        window.veilCipherApp.handleCipherTypeChange();
      }
    } else if (type === 'railfence' && cipherTypeSelect.value !== 'railfence') {
      cipherTypeSelect.value = 'railfence';
      if (window.veilCipherApp) {
        window.veilCipherApp.handleCipherTypeChange();
      }
    } else if (type === 'affine' && cipherTypeSelect.value !== 'affine') {
      cipherTypeSelect.value = 'affine';
      if (window.veilCipherApp) {
        window.veilCipherApp.handleCipherTypeChange();
      }
    }

    // Set key value
    cipherKeyInput.value = value;

    if (window.veilCipherApp) {
      window.veilCipherApp.showOpSecAlert(`Key preset: ${value}`, 'info');
    }
  }

  /**
   * Load carrier text samples into dropdown
   */
  loadCarrierTextSamples() {
    const categorySelect = document.getElementById('carrier-text-category');
    const sampleSelect = document.getElementById('carrier-text-sample');

    if (!categorySelect || !sampleSelect || !window.VeilCipherSamples) return;

    // Populate samples based on category
    categorySelect.addEventListener('change', () => {
      const category = categorySelect.value;
      sampleSelect.innerHTML = '<option value="">-- Select Sample Text --</option>';

      if (category && VeilCipherSamples.carrierTexts) {
        const categoryData = VeilCipherSamples.carrierTexts.find(c => c.category === category);
        if (categoryData) {
          categoryData.samples.forEach((sample, index) => {
            const option = document.createElement('option');
            option.value = sample;
            option.textContent = `Sample ${index + 1} (${sample.substring(0, 50)}...)`;
            sampleSelect.appendChild(option);
          });
        }
      }
    });

    // Load sample into textarea when selected
    sampleSelect.addEventListener('change', () => {
      const carrierText = document.getElementById('carrier-text');
      if (carrierText && sampleSelect.value) {
        carrierText.value = sampleSelect.value;
      }
    });
  }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.veilCipherApp = new VeilCipherApp();

  // Load carrier text samples
  if (window.veilCipherApp && window.VeilCipherSamples) {
    window.veilCipherApp.loadCarrierTextSamples();
  }
});
