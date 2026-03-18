/**
 * VeilCipher - Text Steganography Module
 * Implements Unicode-based text steganography techniques
 * Professional-grade text hiding using zero-width characters and homoglyphs
 */

class TextSteganography {
  constructor() {
    this.maxMessageSize = 10 * 1024; // 10KB limit for text

    // Zero-width characters for encoding (2 bits per character)
    this.zeroWidthChars = {
      '00': '\u200B', // Zero Width Space
      '01': '\u200C', // Zero Width Non-Joiner
      10: '\u200D', // Zero Width Joiner
      11: '\uFEFF' // Zero Width No-Break Space
    };

    // Reverse mapping for decoding
    this.zeroWidthDecode = {
      '\u200B': '00',
      '\u200C': '01',
      '\u200D': '10',
      '\uFEFF': '11'
    };

    // Homoglyph mapping (Latin to similar Unicode characters)
    this.homoglyphs = {
      a: 'а', // Cyrillic 'а'
      e: 'е', // Cyrillic 'е'
      o: 'о', // Cyrillic 'о'
      p: 'р', // Cyrillic 'р'
      c: 'с', // Cyrillic 'с'
      x: 'х', // Cyrillic 'х'
      y: 'у', // Cyrillic 'у'
      A: 'А', // Cyrillic 'А'
      E: 'Е', // Cyrillic 'Е'
      O: 'О', // Cyrillic 'О'
      P: 'Р', // Cyrillic 'Р'
      C: 'С', // Cyrillic 'С'
      H: 'Н', // Cyrillic 'Н'
      K: 'К', // Cyrillic 'К'
      M: 'М', // Cyrillic 'М'
      T: 'Т', // Cyrillic 'Т'
      B: 'В', // Cyrillic 'В'
      i: 'і', // Ukrainian 'і'
      j: 'ј', // Cyrillic 'ј'
      s: 'ѕ' // Cyrillic 'ѕ'
    };

    // Reverse homoglyph mapping
    this.homoglyphDecode = {};
    for (const [key, value] of Object.entries(this.homoglyphs)) {
      this.homoglyphDecode[value] = key;
    }
  }

  /**
   * Hide encrypted message in text using zero-width characters
   * @param {string} carrierText - Innocent-looking carrier text
   * @param {string} encryptedMessage - Encrypted message to hide
   * @param {string} password - Encryption password for verification
   * @param {Object} options - Encoding options
   * @returns {Promise<Object>} Result with modified text
   */
  async hideMessage(carrierText, encryptedMessage, password, options = {}) {
    try {
      // Validate inputs
      const validation = this.validateInputs(carrierText, encryptedMessage);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      // Prepare message with header
      const messageWithHeader = this.prepareMessage(encryptedMessage, password);
      const messageBytes = this.stringToBytes(messageWithHeader);

      // Check capacity
      const capacity = this.calculateCapacity(carrierText, options);
      if (messageBytes.length > capacity) {
        return {
          success: false,
          error: `Message too large. Maximum capacity: ${capacity} bytes, Message size: ${messageBytes.length} bytes`
        };
      }

      let resultText = '';

      // Use zero-width encoding (default)
      if (options.useZeroWidth !== false) {
        resultText = this.encodeWithZeroWidth(carrierText, messageBytes);
      }
      // Use homoglyph substitution
      else if (options.useHomoglyphs) {
        resultText = this.encodeWithHomoglyphs(carrierText, messageBytes);
      }
      // Use whitespace encoding
      else if (options.useWhitespace) {
        resultText = this.encodeWithWhitespace(carrierText, messageBytes);
      }
      // Default: zero-width
      else {
        resultText = this.encodeWithZeroWidth(carrierText, messageBytes);
      }

      return {
        success: true,
        modifiedText: resultText,
        originalSize: carrierText.length,
        modifiedSize: resultText.length,
        capacity: capacity,
        messageSize: messageBytes.length,
        efficiency: Math.round((messageBytes.length / capacity) * 100),
        encodingMethod: options.useHomoglyphs
          ? 'homoglyphs'
          : options.useWhitespace
            ? 'whitespace'
            : 'zero-width',
        checksum: this.calculateChecksum(messageBytes)
      };
    } catch (error) {
      console.error('Text steganography failed:', error);
      return {
        success: false,
        error: 'Text steganography operation failed: ' + error.message
      };
    }
  }

  /**
   * Extract hidden message from text
   * @param {string} text - Text file containing hidden message
   * @param {string} password - Password for decryption
   * @returns {Promise<Object>} Extracted message
   */
  async extractMessage(text, password) {
    try {
      // Try to extract using zero-width decoding
      let extractedData = this.decodeZeroWidth(text);

      if (!extractedData.success) {
        // Try homoglyph decoding
        extractedData = this.decodeHomoglyphs(text);
      }

      if (!extractedData.success) {
        // Try whitespace decoding
        extractedData = this.decodeWhitespace(text);
      }

      if (!extractedData.success) {
        return extractedData;
      }

      // Validate and decrypt
      return this.validateAndDecrypt(extractedData.message, password);
    } catch (error) {
      console.error('Text message extraction failed:', error);
      return {
        success: false,
        error: 'Text extraction failed: ' + error.message
      };
    }
  }

  /**
   * Prepare message with header for text steganography
   * @param {string} message - Original message
   * @param {string} password - Password for verification
   * @returns {string} Prepared message with header
   */
  prepareMessage(message, password) {
    const header = {
      magic: 'VEIL-TEXT',
      version: '1.0',
      timestamp: Date.now(),
      passwordHash: this.hashPassword(password),
      messageLength: message.length,
      checksum: this.calculateChecksum(this.stringToBytes(message))
    };

    return JSON.stringify(header) + '|||' + message;
  }

  /**
   * Encode message using zero-width characters
   * @param {string} carrierText - Carrier text
   * @param {Uint8Array} messageBytes - Message to hide
   * @returns {string} Encoded text
   */
  encodeWithZeroWidth(carrierText, messageBytes) {
    let binaryString = '';

    // Convert bytes to binary string
    for (let i = 0; i < messageBytes.length; i++) {
      binaryString += messageBytes[i].toString(2).padStart(8, '1');
    }

    // Convert binary to zero-width characters (2 bits per character)
    let zeroWidthString = '';
    for (let i = 0; i < binaryString.length; i += 2) {
      const bits = binaryString.substr(i, 2);
      zeroWidthString += this.zeroWidthChars[bits] || this.zeroWidthChars['00'];
    }

    // Insert zero-width string after first character of carrier
    if (carrierText.length > 0) {
      return carrierText[0] + zeroWidthString + carrierText.slice(1);
    }
    return zeroWidthString;
  }

  /**
   * Decode zero-width characters
   * @param {string} text - Text with hidden message
   * @returns {Object} Decoded message
   */
  decodeZeroWidth(text) {
    let binaryString = '';

    // Extract zero-width characters
    for (const char of text) {
      if (this.zeroWidthDecode[char]) {
        binaryString += this.zeroWidthDecode[char];
      }
    }

    if (binaryString.length === 0) {
      return { success: false, error: 'No zero-width encoded message found' };
    }

    // Convert binary to bytes
    const messageBytes = [];
    for (let i = 0; i < binaryString.length; i += 8) {
      const byte = binaryString.substr(i, 8);
      if (byte.length === 8) {
        messageBytes.push(parseInt(byte, 2));
      }
    }

    const messageString = this.bytesToString(new Uint8Array(messageBytes));
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
   * Encode message using homoglyph substitution
   * @param {string} carrierText - Carrier text
   * @param {Uint8Array} messageBytes - Message to hide
   * @returns {string} Encoded text
   */
  encodeWithHomoglyphs(carrierText, messageBytes) {
    let result = '';
    let byteIndex = 0;

    for (let i = 0; i < carrierText.length; i++) {
      const char = carrierText[i];
      const lowerChar = char.toLowerCase();

      // If character has homoglyph and we have message data
      if (this.homoglyphs[lowerChar] && byteIndex < messageBytes.length) {
        const byte = messageBytes[byteIndex];
        const bit = byte & 1;

        // Use homoglyph for 1, original for 0
        if (bit === 1) {
          result += this.homoglyphs[lowerChar];
        } else {
          result += char;
        }

        byteIndex++;
      } else {
        result += char;
      }
    }

    return result;
  }

  /**
   * Decode homoglyph substitution
   * @param {string} text - Text with hidden message
   * @returns {Object} Decoded message
   */
  decodeHomoglyphs(text) {
    const messageBytes = [];
    let currentByte = 0;
    let bitCount = 0;

    for (const char of text) {
      if (this.homoglyphDecode[char]) {
        // Found homoglyph - represents bit 1
        currentByte = (currentByte << 1) | 1;
        bitCount++;
      } else if (this.homoglyphs[char.toLowerCase()]) {
        // Found character that could be homoglyph - represents bit 0
        currentByte = (currentByte << 1) | 0;
        bitCount++;
      }

      if (bitCount === 8) {
        messageBytes.push(currentByte);
        currentByte = 0;
        bitCount = 0;
      }
    }

    if (messageBytes.length === 0) {
      return { success: false, error: 'No homoglyph encoded message found' };
    }

    const messageString = this.bytesToString(new Uint8Array(messageBytes));
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
   * Encode message using whitespace variations
   * @param {string} carrierText - Carrier text
   * @param {Uint8Array} messageBytes - Message to hide
   * @returns {string} Encoded text
   */
  encodeWithWhitespace(carrierText, messageBytes) {
    let binaryString = '';

    // Convert bytes to binary string
    for (let i = 0; i < messageBytes.length; i++) {
      binaryString += messageBytes[i].toString(2).padStart(8, '1');
    }

    // Convert binary to whitespace (0 = space, 1 = tab)
    let whitespaceString = '';
    for (let i = 0; i < binaryString.length; i++) {
      whitespaceString += binaryString[i] === '0' ? ' ' : '\t';
    }

    // Append whitespace at the end of text (invisible)
    return carrierText + whitespaceString;
  }

  /**
   * Decode whitespace encoding
   * @param {string} text - Text with hidden message
   * @returns {Object} Decoded message
   */
  decodeWhitespace(text) {
    let binaryString = '';

    // Extract whitespace from end of text
    let inWhitespace = false;
    for (let i = text.length - 1; i >= 0; i--) {
      const char = text[i];
      if (char === ' ' || char === '\t') {
        binaryString = (char === '\t' ? '1' : '0') + binaryString;
        inWhitespace = true;
      } else if (inWhitespace) {
        break;
      }
    }

    if (binaryString.length === 0) {
      return { success: false, error: 'No whitespace encoded message found' };
    }

    // Convert binary to bytes
    const messageBytes = [];
    for (let i = 0; i < binaryString.length; i += 8) {
      const byte = binaryString.substr(i, 8);
      if (byte.length === 8) {
        messageBytes.push(parseInt(byte, 2));
      }
    }

    const messageString = this.bytesToString(new Uint8Array(messageBytes));
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
   * Calculate capacity of text for steganography
   * @param {string} carrierText - Carrier text
   * @param {Object} options - Encoding options
   * @returns {number} Maximum message size in bytes
   */
  calculateCapacity(carrierText, options = {}) {
    if (options.useZeroWidth !== false) {
      // Zero-width: 4 bits per character (2 bits per zero-width char)
      return Math.floor(carrierText.length * 0.5);
    } else if (options.useHomoglyphs) {
      // Homoglyphs: 1 bit per eligible character
      let eligibleChars = 0;
      for (const char of carrierText.toLowerCase()) {
        if (this.homoglyphs[char]) eligibleChars++;
      }
      return Math.floor(eligibleChars / 8);
    } else if (options.useWhitespace) {
      // Whitespace: 1 bit per space/tab
      return Math.floor(carrierText.length / 8);
    }
    return 0;
  }

  /**
   * Validate input parameters
   * @param {string} carrierText - Carrier text
   * @param {string} message - Message to hide
   * @returns {Object} Validation result
   */
  validateInputs(carrierText, message) {
    if (!carrierText || carrierText.length === 0) {
      return { valid: false, error: 'Carrier text cannot be empty' };
    }

    if (!message || message.length === 0) {
      return { valid: false, error: 'Message cannot be empty' };
    }

    if (message.length > this.maxMessageSize) {
      return {
        valid: false,
        error: `Message too large. Maximum size: ${this.formatBytes(this.maxMessageSize)}`
      };
    }

    return { valid: true };
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
      if (header.magic !== 'VEIL-TEXT') {
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
        timestamp: new Date(header.timestamp)
      };
    } catch (error) {
      return {
        success: false,
        error: 'Message validation failed: ' + error.message
      };
    }
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
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash.toString(16);
  }

  calculateChecksum(data) {
    let checksum = 0;
    for (let i = 0; i < data.length; i++) {
      checksum += data[i];
    }
    return checksum % 65536;
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
const textSteganography = new TextSteganography();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TextSteganography;
} else if (typeof window !== 'undefined') {
  window.TextSteganography = TextSteganography;
  window.textSteganography = textSteganography;
}
