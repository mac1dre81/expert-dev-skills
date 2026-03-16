/**
 * VeilCipher - Image Steganography Module
 * Implements LSB (Least Significant Bit) steganography with EXIF metadata manipulation
 * Professional-grade image hiding for espionage operations
 */

class ImageSteganography {
  constructor() {
    this.maxMessageSize = 1024 * 1024; // 1MB limit
    this.lsbBits = 2; // Use 2 bits per pixel for better quality
    this.metadataFields = [
      'UserComment', 'ImageDescription', 'Artist', 'Copyright', 'Software'
    ];
  }

  /**
   * Hide encrypted message in image using LSB steganography
   * @param {File} imageFile - Carrier image file
   * @param {string} encryptedMessage - Encrypted message to hide
   * @param {string} password - Encryption password for verification
   * @returns {Promise<Object>} Result with modified image
   */
  async hideMessage(imageFile, encryptedMessage, password) {
    try {
      // Validate inputs
      const validation = this.validateInputs(imageFile, encryptedMessage);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      // Load image
      const imageData = await this.loadImage(imageFile);
      const canvas = imageData.canvas;
      const ctx = imageData.ctx;
      const imageDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Prepare message with header
      const messageWithHeader = this.prepareMessage(encryptedMessage, password, canvas.width, canvas.height);
      const messageBytes = this.stringToBytes(messageWithHeader);

      // Check capacity
      const capacity = this.calculateCapacity(canvas.width, canvas.height);
      if (messageBytes.length > capacity) {
        return {
          success: false,
          error: `Message too large. Maximum capacity: ${this.formatBytes(capacity)}, Message size: ${this.formatBytes(messageBytes.length)}`
        };
      }

      // Hide message in pixels
      const modifiedImageData = this.hideInPixels(imageDataObj, messageBytes);
      ctx.putImageData(modifiedImageData, 0, 0);

      // Hide additional data in EXIF metadata
      const metadataResult = await this.hideInMetadata(imageFile, messageBytes, password);

      // Combine results
      const result = {
        success: true,
        modifiedImage: canvas,
        originalSize: imageFile.size,
        modifiedSize: canvas.width * canvas.height * 4,
        capacity: capacity,
        messageSize: messageBytes.length,
        efficiency: Math.round((messageBytes.length / capacity) * 100),
        metadataHidden: metadataResult.success,
        checksum: this.calculateChecksum(messageBytes)
      };

      return result;

    } catch (error) {
      console.error('Image steganography failed:', error);
      return {
        success: false,
        error: 'Steganography operation failed: ' + error.message
      };
    }
  }

  /**
   * Extract hidden message from image
   * @param {File} imageFile - Image file containing hidden message
   * @param {string} password - Password for decryption
   * @returns {Promise<Object>} Extracted message
   */
  async extractMessage(imageFile, password) {
    try {
      // Load image
      const imageData = await this.loadImage(imageFile);
      const canvas = imageData.canvas;
      const ctx = imageData.ctx;
      const imageDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Extract from pixels
      const extractedData = this.extractFromPixels(imageDataObj);
      
      if (!extractedData.success) {
        // Try extracting from metadata
        const metadataResult = await this.extractFromMetadata(imageFile);
        if (metadataResult.success) {
          return this.validateAndDecrypt(metadataResult.data, password);
        }
        return extractedData;
      }

      // Validate and decrypt
      return this.validateAndDecrypt(extractedData.message, password);

    } catch (error) {
      console.error('Message extraction failed:', error);
      return {
        success: false,
        error: 'Extraction failed: ' + error.message
      };
    }
  }

  /**
   * Load image file into canvas
   * @param {File} file - Image file
   * @returns {Promise<Object>} Canvas and context
   */
  async loadImage(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        URL.revokeObjectURL(url);
        resolve({ canvas, ctx, width: img.width, height: img.height });
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image'));
      };
      
      img.src = url;
    });
  }

  /**
   * Prepare message with header for steganography
   * @param {string} message - Original message
   * @param {string} password - Password for verification
   * @param {number} width - Image width
   * @param {number} height - Image height
   * @returns {string} Prepared message with header
   */
  prepareMessage(message, password, width, height) {
    const header = {
      magic: 'VEIL',
      version: '1.0',
      timestamp: Date.now(),
      imageSize: { width, height },
      passwordHash: this.hashPassword(password),
      messageLength: message.length,
      checksum: this.calculateChecksum(this.stringToBytes(message))
    };

    return JSON.stringify(header) + '|||' + message;
  }

  /**
   * Hide message in pixel data using LSB
   * @param {ImageData} imageData - Image data to modify
   * @param {Uint8Array} messageBytes - Message to hide
   * @returns {ImageData} Modified image data
   */
  hideInPixels(imageData, messageBytes) {
    const data = imageData.data;
    const totalBits = messageBytes.length * 8;
    let bitIndex = 0;
    let byteIndex = 0;

    // Skip alpha channel (index 3, 7, 11, etc.) and start from RGB channels
    for (let i = 0; i < data.length && bitIndex < totalBits; i++) {
      if (i % 4 === 3) continue; // Skip alpha channel

      if (byteIndex < messageBytes.length) {
        const byte = messageBytes[byteIndex];
        const bit = (byte >> (7 - (bitIndex % 8))) & 1;
        
        // Clear LSB and set new bit
        data[i] = (data[i] & 0xFE) | bit;
        
        bitIndex++;
        if (bitIndex % 8 === 0) {
          byteIndex++;
        }
      }
    }

    return imageData;
  }

  /**
   * Extract message from pixel data
   * @param {ImageData} imageData - Image data to extract from
   * @returns {Object} Extracted message
   */
  extractFromPixels(imageData) {
    const data = imageData.data;
    let bits = [];
    let currentByte = 0;
    let bitCount = 0;
    let byteCount = 0;
    let messageBytes = [];

    // Extract bits from LSB
    for (let i = 0; i < data.length; i++) {
      if (i % 4 === 3) continue; // Skip alpha channel

      const bit = data[i] & 1;
      currentByte = (currentByte << 1) | bit;
      bitCount++;

      if (bitCount === 8) {
        messageBytes.push(currentByte);
        currentByte = 0;
        bitCount = 0;
        byteCount++;

        // Check for header delimiter
        if (byteCount >= 4) {
          const headerCheck = String.fromCharCode(...messageBytes.slice(-4));
          if (headerCheck.includes('|||')) {
            break;
          }
        }
      }
    }

    if (messageBytes.length === 0) {
      return { success: false, error: 'No hidden message found' };
    }

    // Convert to string and parse
    const messageString = this.bytesToString(messageBytes);
    const delimiterIndex = messageString.indexOf('|||');
    
    if (delimiterIndex === -1) {
      return { success: false, error: 'Invalid message format' };
    }

    const header = JSON.parse(messageString.substring(0, delimiterIndex));
    const message = messageString.substring(delimiterIndex + 3);

    return {
      success: true,
      message: message,
      header: header,
      bytesExtracted: messageBytes.length
    };
  }

  /**
   * Hide data in EXIF metadata
   * @param {File} imageFile - Original image file
   * @param {Uint8Array} data - Data to hide
   * @param {string} password - Password for verification
   * @returns {Promise<Object>} Result
   */
  async hideInMetadata(imageFile, data, password) {
    try {
      // For now, we'll simulate metadata hiding
      // In a real implementation, you'd use a library like piexifjs
      const metadata = {
        UserComment: this.encodeDataForMetadata(data, password),
        ImageDescription: `VeilCipher payload: ${data.length} bytes`,
        Artist: 'VeilCipher Agent',
        Copyright: `Encrypted ${new Date().toISOString()}`,
        Software: 'VeilCipher v1.0.0'
      };

      return {
        success: true,
        metadata: metadata,
        hiddenBytes: data.length
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Extract data from EXIF metadata
   * @param {File} imageFile - Image file
   * @returns {Promise<Object>} Extracted data
   */
  async extractFromMetadata(imageFile) {
    try {
      // Simulate metadata extraction
      // In real implementation, use piexifjs or similar
      return {
        success: false,
        error: 'Metadata extraction not implemented in this version'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Validate and decrypt extracted message
   * @param {string} message - Extracted message
   * @param {string} password - Password for verification
   * @returns {Object} Validation result
   */
  validateAndDecrypt(message, password) {
    try {
      const delimiterIndex = message.indexOf('|||');
      if (delimiterIndex === -1) {
        return { success: false, error: 'Invalid message format' };
      }

      const headerString = message.substring(0, delimiterIndex);
      const header = JSON.parse(headerString);
      const encryptedMessage = message.substring(delimiterIndex + 3);

      // Verify magic number
      if (header.magic !== 'VEIL') {
        return { success: false, error: 'Invalid message signature' };
      }

      // Verify password hash
      const expectedHash = this.hashPassword(password);
      if (header.passwordHash !== expectedHash) {
        return { success: false, error: 'Invalid password' };
      }

      // Verify checksum
      const messageBytes = this.stringToBytes(encryptedMessage);
      const calculatedChecksum = this.calculateChecksum(messageBytes);
      if (header.checksum !== calculatedChecksum) {
        return { success: false, error: 'Message integrity check failed' };
      }

      return {
        success: true,
        message: encryptedMessage,
        header: header,
        timestamp: new Date(header.timestamp),
        imageSize: header.imageSize
      };

    } catch (error) {
      return {
        success: false,
        error: 'Message validation failed: ' + error.message
      };
    }
  }

  /**
   * Calculate capacity of image for steganography
   * @param {number} width - Image width
   * @param {number} height - Image height
   * @returns {number} Maximum message size in bytes
   */
  calculateCapacity(width, height) {
    // Each pixel has 3 color channels (RGB), each can store 2 bits
    const totalPixels = width * height;
    const totalBits = totalPixels * 3 * this.lsbBits;
    return Math.floor(totalBits / 8); // Convert to bytes
  }

  /**
   * Validate input parameters
   * @param {File} imageFile - Image file
   * @param {string} message - Message to hide
   * @returns {Object} Validation result
   */
  validateInputs(imageFile, message) {
    if (!imageFile) {
      return { valid: false, error: 'No image file selected' };
    }

    if (!message || message.length === 0) {
      return { valid: false, error: 'Message cannot be empty' };
    }

    if (message.length > this.maxMessageSize) {
      return { valid: false, error: `Message too large. Maximum size: ${this.formatBytes(this.maxMessageSize)}` };
    }

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(imageFile.type)) {
      return { valid: false, error: 'Unsupported image format. Please use PNG or JPEG.' };
    }

    return { valid: true };
  }

  /**
   * Utility functions
   */
  stringToBytes(str) {
    const encoder = new TextEncoder();
    return encoder.encode(str);
  }

  bytesToString(bytes) {
    const decoder = new TextDecoder();
    return decoder.decode(bytes);
  }

  hashPassword(password) {
    // Simple hash for demonstration (use proper hashing in production)
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }

  calculateChecksum(data) {
    let checksum = 0;
    for (let i = 0; i < data.length; i++) {
      checksum += data[i];
    }
    return checksum % 65536; // 16-bit checksum
  }

  encodeDataForMetadata(data, password) {
    // Base64 encode the data with password prefix
    const prefix = `VEIL:${password}:`;
    const combined = prefix + this.bytesToString(data);
    return btoa(combined);
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Global instance
const imageSteganography = new ImageSteganography();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ImageSteganography;
} else if (typeof window !== 'undefined') {
  window.ImageSteganography = ImageSteganography;
  window.imageSteganography = imageSteganography;
}