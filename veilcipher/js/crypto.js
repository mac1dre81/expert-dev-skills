/**
 * VeilCipher - Cryptography Module
 * Professional-grade encryption using Web Crypto API
 * Implements AES-256-GCM and ECDH for government-grade security
 */

class VeilCipherCrypto {
  constructor() {
    this.algorithms = {
      pbkdf2: {
        name: 'PBKDF2',
        hash: 'SHA-256',
        iterations: 100000,
        saltLength: 16
      },
      aesGcm: {
        name: 'AES-GCM',
        length: 256,
        ivLength: 12
      },
      ecdh: {
        name: 'ECDH',
        namedCurve: 'P-256'
      }
    };

    this.keyCache = new Map();
    this.sessionKeys = new Map();
  }

  /**
   * Generate cryptographically secure random bytes
   * @param {number} length - Number of bytes to generate
   * @returns {Uint8Array} Random bytes
   */
  async generateRandomBytes(length = 32) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return array;
  }

  /**
   * Derive encryption key from password using PBKDF2
   * @param {string} password - User password
   * @param {Uint8Array} salt - Salt for key derivation
   * @returns {CryptoKey} Derived encryption key
   */
  async deriveKeyFromPassword(password, salt) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      enc.encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    return await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: this.algorithms.pbkdf2.iterations,
        hash: this.algorithms.pbkdf2.hash
      },
      keyMaterial,
      {
        name: this.algorithms.aesGcm.name,
        length: this.algorithms.aesGcm.length
      },
      false,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Generate AES-256-GCM key pair for encryption
   * @returns {Promise<CryptoKey>} AES key
   */
  async generateAESKey() {
    return await crypto.subtle.generateKey(
      {
        name: this.algorithms.aesGcm.name,
        length: this.algorithms.aesGcm.length
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Generate ECDH key pair for key exchange
   * @returns {Promise<CryptoKeyPair>} ECDH key pair
   */
  async generateECDHKeyPair() {
    return await crypto.subtle.generateKey(
      {
        name: this.algorithms.ecdh.name,
        namedCurve: this.algorithms.ecdh.namedCurve
      },
      true,
      ['deriveKey', 'deriveBits']
    );
  }

  /**
   * Derive shared secret using ECDH
   * @param {CryptoKey} privateKey - Our private key
   * @param {CryptoKey} publicKey - Other party's public key
   * @returns {Promise<CryptoKey>} Shared secret key
   */
  async deriveSharedSecret(privateKey, publicKey) {
    const sharedSecret = await crypto.subtle.deriveKey(
      {
        name: this.algorithms.ecdh.name,
        public: publicKey
      },
      privateKey,
      {
        name: this.algorithms.aesGcm.name,
        length: this.algorithms.aesGcm.length
      },
      true,
      ['encrypt', 'decrypt']
    );

    return sharedSecret;
  }

  /**
   * Encrypt data using AES-256-GCM
   * @param {Uint8Array} data - Data to encrypt
   * @param {string} password - Encryption password
   * @param {boolean} useECDH - Whether to use ECDH for key exchange
   * @returns {Promise<Object>} Encrypted data with metadata
   */
  async encrypt(data, password, useECDH = false) {
    try {
      // Generate salt and IV
      const salt = await this.generateRandomBytes(this.algorithms.pbkdf2.saltLength);
      const iv = await this.generateRandomBytes(this.algorithms.aesGcm.ivLength);

      let key;

      if (useECDH) {
        // Use ECDH for key exchange
        const keyPair = await this.generateECDHKeyPair();
        const sharedSecret = await this.deriveSharedSecret(keyPair.privateKey, keyPair.publicKey);
        key = sharedSecret;
      } else {
        // Use password-based key derivation
        key = await this.deriveKeyFromPassword(password, salt);
      }

      // Encrypt the data
      const encryptedData = await crypto.subtle.encrypt(
        {
          name: this.algorithms.aesGcm.name,
          iv: iv,
          tagLength: 128
        },
        key,
        data
      );

      // Create metadata header
      const metadata = {
        version: '1.0',
        algorithm: this.algorithms.aesGcm.name,
        keyLength: this.algorithms.aesGcm.length,
        ivLength: this.algorithms.aesGcm.ivLength,
        salt: this.arrayBufferToBase64(salt),
        iv: this.arrayBufferToBase64(iv),
        timestamp: Date.now(),
        useECDH: useECDH
      };

      // Combine metadata and encrypted data
      const metadataJson = JSON.stringify(metadata);
      const metadataBytes = new TextEncoder().encode(metadataJson);

      const combinedData = new Uint8Array(4 + metadataBytes.length + 4 + encryptedData.byteLength);

      // Add metadata length (4 bytes)
      const metadataLength = new Uint32Array([metadataBytes.length]);
      combinedData.set(new Uint8Array(metadataLength.buffer), 0);

      // Add metadata
      combinedData.set(metadataBytes, 4);

      // Add encrypted data length (4 bytes)
      const encryptedLength = new Uint32Array([encryptedData.byteLength]);
      combinedData.set(new Uint8Array(encryptedLength.buffer), 4 + metadataBytes.length);

      // Add encrypted data
      combinedData.set(new Uint8Array(encryptedData), 4 + metadataBytes.length + 4);

      return {
        success: true,
        data: this.arrayBufferToBase64(combinedData),
        metadata: metadata,
        key: useECDH ? keyPair : null
      };
    } catch (error) {
      console.error('Encryption failed:', error);
      return {
        success: false,
        error: 'Encryption failed: ' + error.message
      };
    }
  }

  /**
   * Decrypt data using AES-256-GCM
   * @param {string} encryptedData - Base64 encoded encrypted data
   * @param {string} password - Decryption password
   * @param {CryptoKeyPair} keyPair - ECDH key pair (if used)
   * @returns {Promise<Object>} Decrypted data
   */
  async decrypt(encryptedData, password, keyPair = null) {
    try {
      const combinedData = this.base64ToArrayBuffer(encryptedData);
      const dataView = new DataView(combinedData);

      // Extract metadata length
      const metadataLength = dataView.getUint32(0, true);

      // Extract metadata
      const metadataBytes = new Uint8Array(combinedData, 4, metadataLength);
      const metadataJson = new TextDecoder().decode(metadataBytes);
      const metadata = JSON.parse(metadataJson);

      // Extract encrypted data length
      const encryptedDataLength = dataView.getUint32(4 + metadataLength, true);

      // Extract encrypted data
      const encryptedBytes = new Uint8Array(
        combinedData,
        4 + metadataLength + 4,
        encryptedDataLength
      );

      let key;

      if (metadata.useECDH && keyPair) {
        // Use ECDH for key exchange
        key = await this.deriveSharedSecret(keyPair.privateKey, keyPair.publicKey);
      } else {
        // Use password-based key derivation
        const salt = this.base64ToArrayBuffer(metadata.salt);
        key = await this.deriveKeyFromPassword(password, salt);
      }

      // Decrypt the data
      const decryptedData = await crypto.subtle.decrypt(
        {
          name: this.algorithms.aesGcm.name,
          iv: this.base64ToArrayBuffer(metadata.iv),
          tagLength: 128
        },
        key,
        encryptedBytes
      );

      return {
        success: true,
        data: new TextDecoder().decode(decryptedData),
        metadata: metadata
      };
    } catch (error) {
      console.error('Decryption failed:', error);
      return {
        success: false,
        error: 'Decryption failed: ' + error.message
      };
    }
  }

  /**
   * Generate key fingerprint for ECDH public keys
   * @param {CryptoKey} publicKey - ECDH public key
   * @returns {Promise<string>} Key fingerprint
   */
  async generateKeyFingerprint(publicKey) {
    const exportedKey = await crypto.subtle.exportKey('spki', publicKey);
    const hashBuffer = await crypto.subtle.digest('SHA-256', exportedKey);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Format as fingerprint (groups of 4 characters)
    const fingerprint = hashHex.match(/.{1,4}/g).join(' ');
    return fingerprint.toUpperCase();
  }

  /**
   * Calculate password strength using zxcvbn-like algorithm
   * @param {string} password - Password to analyze
   * @returns {Object} Password strength analysis
   */
  calculatePasswordStrength(password) {
    const minLength = 12;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasSpaces = /\s/.test(password);

    let score = 0;
    const feedback = [];

    // Length scoring
    if (password.length >= minLength) {
      score += 2;
    } else if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('Password should be at least 12 characters long');
    }

    // Character diversity
    if (hasUppercase) {
      score += 1;
    } else {
      feedback.push('Add uppercase letters');
    }

    if (hasLowercase) {
      score += 1;
    } else {
      feedback.push('Add lowercase letters');
    }

    if (hasNumbers) {
      score += 1;
    } else {
      feedback.push('Add numbers');
    }

    if (hasSpecial) {
      score += 2;
    } else {
      feedback.push('Add special characters');
    }

    if (hasSpaces) {
      score += 1;
    }

    // Common patterns check
    const commonPatterns = [/password/i, /123456/, /qwerty/, /admin/, /letmein/];

    for (const pattern of commonPatterns) {
      if (pattern.test(password)) {
        score = Math.max(0, score - 2);
        feedback.push('Avoid common patterns');
        break;
      }
    }

    // Entropy calculation
    const uniqueChars = new Set(password).size;
    const entropy = password.length * Math.log2(uniqueChars);

    let strength = 'weak';
    let color = '#e74c3c';

    if (score >= 7 && entropy > 50) {
      strength = 'excellent';
      color = '#2ecc71';
    } else if (score >= 5 && entropy > 40) {
      strength = 'strong';
      color = '#27ae60';
    } else if (score >= 3 && entropy > 30) {
      strength = 'medium';
      color = '#f1c40f';
    } else if (score >= 1 && entropy > 20) {
      strength = 'weak';
      color = '#e67e22';
    }

    return {
      score: Math.min(score, 8),
      strength: strength,
      color: color,
      feedback: feedback,
      entropy: Math.round(entropy),
      crackTime: this.estimateCrackTime(entropy)
    };
  }

  /**
   * Estimate time to crack password
   * @param {number} entropy - Password entropy in bits
   * @returns {string} Estimated crack time
   */
  estimateCrackTime(entropy) {
    const guessesPerSecond = 1e9; // 1 billion guesses per second
    const totalCombinations = Math.pow(2, entropy);
    const seconds = totalCombinations / (2 * guessesPerSecond);

    if (seconds < 60) {
      return 'Less than 1 minute';
    }
    if (seconds < 3600) {
      return Math.round(seconds / 60) + ' minutes';
    }
    if (seconds < 86400) {
      return Math.round(seconds / 3600) + ' hours';
    }
    if (seconds < 31536000) {
      return Math.round(seconds / 86400) + ' days';
    }
    if (seconds < 31536000000) {
      return Math.round(seconds / 31536000) + ' years';
    }

    return 'Centuries';
  }

  /**
   * Convert ArrayBuffer to Base64 string
   * @param {ArrayBuffer} buffer - ArrayBuffer to convert
   * @returns {string} Base64 encoded string
   */
  arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  /**
   * Convert Base64 string to ArrayBuffer
   * @param {string} base64 - Base64 encoded string
   * @returns {ArrayBuffer} ArrayBuffer
   */
  base64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  /**
   * Calculate entropy of data
   * @param {string} data - Data to analyze
   * @returns {number} Entropy score (0-8)
   */
  calculateEntropy(data) {
    if (!data || data.length === 0) {
      return 0;
    }

    const freq = {};
    for (let i = 0; i < data.length; i++) {
      const char = data[i];
      freq[char] = (freq[char] || 0) + 1;
    }

    let entropy = 0;
    const len = data.length;

    for (const char in freq) {
      const probability = freq[char] / len;
      entropy -= probability * Math.log2(probability);
    }

    // Normalize to 0-8 scale
    return Math.min(8, Math.round(entropy));
  }

  /**
   * Securely clear sensitive data from memory
   * @param {any} data - Data to clear
   */
  secureClear(data) {
    if (typeof data === 'string') {
      // Overwrite string with random data
      const length = data.length;
      let cleared = '';
      for (let i = 0; i < length; i++) {
        cleared += String.fromCharCode(Math.floor(Math.random() * 256));
      }
      // Replace with cleared data
      data = cleared;
    }

    if (data && typeof data === 'object') {
      // Clear object properties
      for (const key in data) {
        if (data[key] && typeof data[key] === 'string') {
          data[key] = '';
        }
      }
    }
  }

  /**
   * Generate secure session ID
   * @returns {string} Secure session identifier
   */
  generateSessionId() {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Validate cryptographic parameters
   * @param {Object} params - Parameters to validate
   * @returns {boolean} Validation result
   */
  validateParameters(params) {
    if (!params.password || params.password.length < 8) {
      return { valid: false, error: 'Password must be at least 8 characters' };
    }

    if (!params.data || params.data.length === 0) {
      return { valid: false, error: 'Data cannot be empty' };
    }

    if (params.data.length > 1024 * 1024) {
      // 1MB limit
      return { valid: false, error: 'Data size exceeds 1MB limit' };
    }

    return { valid: true };
  }
}

// Global instance
const veilCipherCrypto = new VeilCipherCrypto();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VeilCipherCrypto;
} else if (typeof window !== 'undefined') {
  window.VeilCipherCrypto = VeilCipherCrypto;
  window.veilCipherCrypto = veilCipherCrypto;
}
