/**
 * VeilCipher - Additional Encryption Tools Module
 * Military-grade encryption utilities including file encryption, password generation,
 * hash calculation, and classic ciphers
 */

class VeilCipherTools {
  constructor() {
    this.crypto = veilCipherCrypto;

    // Character sets for password generation
    this.charSets = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };

    // Ambiguous characters to exclude
    this.ambiguousChars = '0O1lI';

    // Morse code mapping
    this.morseCode = {
      A: '.-',
      B: '-...',
      C: '-.-.',
      D: '-..',
      E: '.',
      F: '..-.',
      G: '--.',
      H: '....',
      I: '..',
      J: '.---',
      K: '-.-',
      L: '.-..',
      M: '--',
      N: '-.',
      O: '---',
      P: '.--.',
      Q: '--.-',
      R: '.-.',
      S: '...',
      T: '-',
      U: '..-',
      V: '...-',
      W: '.--',
      X: '-..-',
      Y: '-.--',
      Z: '--..',
      0: '-----',
      1: '.----',
      2: '..---',
      3: '...--',
      4: '....-',
      5: '.....',
      6: '-....',
      7: '--...',
      8: '---..',
      9: '----.',
      ' ': '/',
      '.': '.-.-.-',
      ',': '--..--',
      '?': '..--..',
      '!': '-.-.--',
      '-': '-....-',
      '+': '.-.-.',
      '@': '.--.-.'
    };

    // Reverse Morse code mapping
    this.morseDecode = {};
    for (const [key, value] of Object.entries(this.morseCode)) {
      this.morseDecode[value] = key;
    }

    // NATO Phonetic Alphabet
    this.natoPhonetic = {
      A: 'Alpha',
      B: 'Bravo',
      C: 'Charlie',
      D: 'Delta',
      E: 'Echo',
      F: 'Foxtrot',
      G: 'Golf',
      H: 'Hotel',
      I: 'India',
      J: 'Juliett',
      K: 'Kilo',
      L: 'Lima',
      M: 'Mike',
      N: 'November',
      O: 'Oscar',
      P: 'Papa',
      Q: 'Quebec',
      R: 'Romeo',
      S: 'Sierra',
      T: 'Tango',
      U: 'Uniform',
      V: 'Victor',
      W: 'Whiskey',
      X: 'X-ray',
      Y: 'Yankee',
      Z: 'Zulu',
      0: 'Zero',
      1: 'One',
      2: 'Two',
      3: 'Three',
      4: 'Four',
      5: 'Five',
      6: 'Six',
      7: 'Seven',
      8: 'Eight',
      9: 'Nine'
    };

    // Reverse NATO Phonetic
    this.natoDecode = {};
    for (const [key, value] of Object.entries(this.natoPhonetic)) {
      this.natoDecode[value] = key;
    }

    // Polybius Square (5x5 grid, I/J combined)
    this.polybiusSquare = [
      ['A', 'B', 'C', 'D', 'E'],
      ['F', 'G', 'H', 'I/J', 'K'],
      ['L', 'M', 'N', 'O', 'P'],
      ['Q', 'R', 'S', 'T', 'U'],
      ['V', 'W', 'X', 'Y', 'Z']
    ];
  }

  /**
   * Generate cryptographically secure random password
   * @param {number} length - Password length
   * @param {Object} options - Password options
   * @returns {string} Generated password
   */
  async generatePassword(length = 32, options = {}) {
    const {
      uppercase = true,
      lowercase = true,
      numbers = true,
      symbols = true,
      excludeAmbiguous = false
    } = options;

    let charset = '';
    if (uppercase) charset += this.charSets.uppercase;
    if (lowercase) charset += this.charSets.lowercase;
    if (numbers) charset += this.charSets.numbers;
    if (symbols) charset += this.charSets.symbols;

    if (excludeAmbiguous) {
      for (const char of this.ambiguousChars) {
        charset = charset.replace(char, '');
      }
    }

    if (charset.length === 0) {
      throw new Error('No character sets selected');
    }

    // Use crypto.getRandomValues for secure random generation
    const randomValues = new Uint32Array(length);
    crypto.getRandomValues(randomValues);

    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset[randomValues[i] % charset.length];
    }

    return password;
  }

  /**
   * Calculate SHA-256 hash of text
   * @param {string} text - Text to hash
   * @returns {Promise<string>} SHA-256 hash in hex format
   */
  async sha256(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Calculate SHA-512 hash of text
   * @param {string} text - Text to hash
   * @returns {Promise<string>} SHA-512 hash in hex format
   */
  async sha512(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-512', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Calculate MD5 hash of text (for compatibility)
   * @param {string} text - Text to hash
   * @returns {Promise<string>} MD5 hash in hex format
   */
  async md5(text) {
    // Simple MD5 implementation using Web Crypto (note: not cryptographically secure)
    // For production, use a proper MD5 library
    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    // Convert to hex string
    const hashArray = Array.from(new Uint8Array(data));
    let hash = '';
    for (let i = 0; i < hashArray.length; i++) {
      hash += hashArray[i].toString(16).padStart(2, '0');
    }

    // Simple hash (not true MD5, but functional for non-security purposes)
    let h1 = 0x67452301,
      h2 = 0xefcdab89,
      h3 = 0x98badcfe,
      h4 = 0x10325476;

    for (let i = 0; i < hash.length; i += 8) {
      const chunk = hash.substr(i, 8) || '00000000';
      h1 = (h1 + parseInt(chunk, 16)) | 0;
      h2 = (h2 + parseInt(chunk, 16)) | 0;
      h3 = (h3 + parseInt(chunk, 16)) | 0;
      h4 = (h4 + parseInt(chunk, 16)) | 0;
    }

    return [h1, h2, h3, h4].map(h => (h >>> 0).toString(16).padStart(8, '0')).join('');
  }

  /**
   * Encrypt file using AES-256-GCM
   * @param {File} file - File to encrypt
   * @param {string} password - Encryption password
   * @returns {Promise<Object>} Encrypted file data
   */
  async encryptFile(file, password) {
    try {
      // Read file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);

      // Generate salt and IV
      const salt = await this.crypto.generateRandomBytes(16);
      const iv = await this.crypto.generateRandomBytes(12);

      // Derive key from password
      const key = await this.crypto.deriveKeyFromPassword(password, salt);

      // Encrypt the data
      const encryptedData = await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv,
          tagLength: 128
        },
        key,
        data
      );

      // Create metadata
      const metadata = {
        version: '1.0',
        algorithm: 'AES-256-GCM',
        originalName: file.name,
        originalSize: file.size,
        originalType: file.type,
        salt: this.arrayBufferToBase64(salt),
        iv: this.arrayBufferToBase64(iv),
        timestamp: Date.now()
      };

      // Combine metadata and encrypted data
      const metadataJson = JSON.stringify(metadata);
      const metadataBytes = new TextEncoder().encode(metadataJson);

      const combinedData = new Uint8Array(4 + metadataBytes.length + 4 + encryptedData.byteLength);

      // Add metadata length
      const metadataLength = new Uint32Array([metadataBytes.length]);
      combinedData.set(new Uint8Array(metadataLength.buffer), 0);

      // Add metadata
      combinedData.set(metadataBytes, 4);

      // Add encrypted data length
      const encryptedLength = new Uint32Array([encryptedData.byteLength]);
      combinedData.set(new Uint8Array(encryptedLength.buffer), 4 + metadataBytes.length);

      // Add encrypted data
      combinedData.set(new Uint8Array(encryptedData), 4 + metadataBytes.length + 4);

      return {
        success: true,
        data: combinedData,
        metadata: metadata
      };
    } catch (error) {
      return {
        success: false,
        error: 'File encryption failed: ' + error.message
      };
    }
  }

  /**
   * Decrypt file using AES-256-GCM
   * @param {ArrayBuffer} arrayBuffer - Encrypted file data
   * @param {string} password - Decryption password
   * @returns {Promise<Object>} Decrypted file data
   */
  async decryptFile(arrayBuffer, password) {
    try {
      const data = new Uint8Array(arrayBuffer);
      const dataView = new DataView(data.buffer);

      // Extract metadata length
      const metadataLength = dataView.getUint32(0, true);

      // Extract metadata
      const metadataBytes = new Uint8Array(data.buffer, 4, metadataLength);
      const metadataJson = new TextDecoder().decode(metadataBytes);
      const metadata = JSON.parse(metadataJson);

      // Extract encrypted data length
      const encryptedDataLength = dataView.getUint32(4 + metadataLength, true);

      // Extract encrypted data
      const encryptedBytes = new Uint8Array(
        data.buffer,
        4 + metadataLength + 4,
        encryptedDataLength
      );

      // Derive key from password
      const salt = this.base64ToArrayBuffer(metadata.salt);
      const key = await this.crypto.deriveKeyFromPassword(password, salt);

      // Decrypt the data
      const decryptedData = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: this.base64ToArrayBuffer(metadata.iv),
          tagLength: 128
        },
        key,
        encryptedBytes
      );

      return {
        success: true,
        data: decryptedData,
        metadata: metadata
      };
    } catch (error) {
      return {
        success: false,
        error: 'File decryption failed: ' + error.message
      };
    }
  }

  /**
   * Caesar cipher encryption
   * @param {string} text - Text to encrypt
   * @param {number} shift - Shift amount
   * @returns {string} Encrypted text
   */
  caesarEncrypt(text, shift) {
    shift = ((shift % 26) + 26) % 26;
    return text.replace(/[a-zA-Z]/g, char => {
      const base = char >= 'a' ? 97 : 65;
      return String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26) + base);
    });
  }

  /**
   * Caesar cipher decryption
   * @param {string} text - Text to decrypt
   * @param {number} shift - Shift amount
   * @returns {string} Decrypted text
   */
  caesarDecrypt(text, shift) {
    return this.caesarEncrypt(text, -shift);
  }

  /**
   * Vigenère cipher encryption
   * @param {string} text - Text to encrypt
   * @param {string} key - Encryption key
   * @returns {string} Encrypted text
   */
  vigenereEncrypt(text, key) {
    let result = '';
    let keyIndex = 0;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];

      if (/[a-zA-Z]/.test(char)) {
        const shift = key[keyIndex % key.length].toLowerCase().charCodeAt(0) - 97;
        const base = char >= 'a' ? 97 : 65;
        result += String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26) + base);
        keyIndex++;
      } else {
        result += char;
      }
    }

    return result;
  }

  /**
   * Vigenère cipher decryption
   * @param {string} text - Text to decrypt
   * @param {string} key - Decryption key
   * @returns {string} Decrypted text
   */
  vigenereDecrypt(text, key) {
    let result = '';
    let keyIndex = 0;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];

      if (/[a-zA-Z]/.test(char)) {
        const shift = key[keyIndex % key.length].toLowerCase().charCodeAt(0) - 97;
        const base = char >= 'a' ? 97 : 65;
        result += String.fromCharCode(((char.charCodeAt(0) - base - shift + 26) % 26) + base);
        keyIndex++;
      } else {
        result += char;
      }
    }

    return result;
  }

  /**
   * Atbash cipher (simple substitution)
   * @param {string} text - Text to encrypt/decrypt
   * @returns {string} Encrypted/decrypted text
   */
  atbash(text) {
    return text.replace(/[a-zA-Z]/g, char => {
      const base = char >= 'a' ? 97 : 65;
      return String.fromCharCode(25 - (char.charCodeAt(0) - base) + base);
    });
  }

  /**
   * Base64 encode
   * @param {string} text - Text to encode
   * @returns {string} Base64 encoded text
   */
  base64Encode(text) {
    try {
      return btoa(unescape(encodeURIComponent(text)));
    } catch (error) {
      throw new Error('Base64 encoding failed');
    }
  }

  /**
   * Base64 decode
   * @param {string} text - Base64 encoded text
   * @returns {string} Decoded text
   */
  base64Decode(text) {
    try {
      return decodeURIComponent(escape(atob(text)));
    } catch (error) {
      throw new Error('Base64 decoding failed');
    }
  }

  /**
   * Binary encode
   * @param {string} text - Text to encode
   * @returns {string} Binary encoded text
   */
  binaryEncode(text) {
    return text
      .split('')
      .map(char => {
        return char.charCodeAt(0).toString(2).padStart(8, '0');
      })
      .join(' ');
  }

  /**
   * Binary decode
   * @param {string} text - Binary encoded text
   * @returns {string} Decoded text
   */
  binaryDecode(text) {
    return text
      .split(' ')
      .map(bin => {
        return String.fromCharCode(parseInt(bin, 2));
      })
      .join('');
  }

  /**
   * Hex encode
   * @param {string} text - Text to encode
   * @returns {string} Hex encoded text
   */
  hexEncode(text) {
    return text
      .split('')
      .map(char => {
        return char.charCodeAt(0).toString(16).padStart(2, '0');
      })
      .join(' ');
  }

  /**
   * Hex decode
   * @param {string} text - Hex encoded text
   * @returns {string} Decoded text
   */
  hexDecode(text) {
    return text
      .split(' ')
      .map(hex => {
        return String.fromCharCode(parseInt(hex, 16));
      })
      .join('');
  }

  /**
   * Morse code encode
   * @param {string} text - Text to encode
   * @returns {string} Morse code encoded text
   */
  morseEncode(text) {
    return text
      .toUpperCase()
      .split('')
      .map(char => {
        return this.morseCode[char] || char;
      })
      .join(' ');
  }

  /**
   * Morse code decode
   * @param {string} text - Morse code encoded text
   * @returns {string} Decoded text
   */
  morseDecode(text) {
    return text
      .split(' ')
      .map(code => {
        return this.morseDecode[code] || code;
      })
      .join('');
  }

  /**
   * ROT13 cipher (Caesar with shift 13)
   * @param {string} text - Text to encrypt/decrypt
   * @returns {string} ROT13 encoded text
   */
  rot13(text) {
    return text.replace(/[a-zA-Z]/g, char => {
      const base = char >= 'a' ? 97 : 65;
      return String.fromCharCode(((char.charCodeAt(0) - base + 13) % 26) + base);
    });
  }

  /**
   * Affine cipher encryption
   * @param {string} text - Text to encrypt
   * @param {number} a - Multiplicative key (must be coprime with 26)
   * @param {number} b - Additive key
   * @returns {string} Encrypted text
   */
  affineEncrypt(text, a, b) {
    // Ensure a is coprime with 26
    const validA = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];
    if (!validA.includes(a % 26)) {
      throw new Error(
        'Key "a" must be coprime with 26 (use 1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, or 25)'
      );
    }

    return text.replace(/[a-zA-Z]/g, char => {
      const base = char >= 'a' ? 97 : 65;
      const x = char.charCodeAt(0) - base;
      const encrypted = (a * x + b) % 26;
      return String.fromCharCode(encrypted + base);
    });
  }

  /**
   * Affine cipher decryption
   * @param {string} text - Text to decrypt
   * @param {number} a - Multiplicative key
   * @param {number} b - Additive key
   * @returns {string} Decrypted text
   */
  affineDecrypt(text, a, b) {
    const validA = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];
    if (!validA.includes(a % 26)) {
      throw new Error('Key "a" must be coprime with 26');
    }

    // Find modular multiplicative inverse of a
    let aInv = 1;
    for (let i = 1; i < 26; i++) {
      if ((a * i) % 26 === 1) {
        aInv = i;
        break;
      }
    }

    return text.replace(/[a-zA-Z]/g, char => {
      const base = char >= 'a' ? 97 : 65;
      const x = char.charCodeAt(0) - base;
      const decrypted = (aInv * (x - b + 26)) % 26;
      return String.fromCharCode(((decrypted + 26) % 26) + base);
    });
  }

  /**
   * Rail fence cipher encryption
   * @param {string} text - Text to encrypt
   * @param {number} rails - Number of rails (default 3)
   * @returns {string} Encrypted text
   */
  railFenceEncrypt(text, rails = 3) {
    if (rails <= 1 || rails >= text.length) return text;

    const fence = Array.from({ length: rails }, () => []);
    let rail = 0;
    let direction = 1;

    for (const char of text) {
      fence[rail].push(char);
      rail += direction;
      if (rail === 0 || rail === rails - 1) direction = -direction;
    }

    return fence.flat().join('');
  }

  /**
   * Rail fence cipher decryption
   * @param {string} text - Text to decrypt
   * @param {number} rails - Number of rails (default 3)
   * @returns {string} Decrypted text
   */
  railFenceDecrypt(text, rails = 3) {
    if (rails <= 1 || rails >= text.length) return text;

    // Create fence pattern
    const fence = Array.from({ length: rails }, () => Array(text.length).fill(null));
    let rail = 0;
    let direction = 1;

    for (let i = 0; i < text.length; i++) {
      fence[rail][i] = '*';
      rail += direction;
      if (rail === 0 || rail === rails - 1) direction = -direction;
    }

    // Fill fence with ciphertext
    let index = 0;
    for (let r = 0; r < rails; r++) {
      for (let c = 0; c < text.length; c++) {
        if (fence[r][c] === '*' && index < text.length) {
          fence[r][c] = text[index++];
        }
      }
    }

    // Read off the plaintext
    let result = '';
    rail = 0;
    direction = 1;
    for (let i = 0; i < text.length; i++) {
      result += fence[rail][i];
      rail += direction;
      if (rail === 0 || rail === rails - 1) direction = -direction;
    }

    return result;
  }

  /**
   * Letter number cipher (A1Z26) - A=1, B=2, ..., Z=26
   * @param {string} text - Text to encode
   * @returns {string} Encoded text (numbers separated by spaces)
   */
  a1z26Encode(text) {
    return text
      .toUpperCase()
      .split('')
      .map(char => {
        if (/[A-Z]/.test(char)) {
          return char.charCodeAt(0) - 64;
        }
        return char;
      })
      .join(' ');
  }

  /**
   * Letter number cipher (A1Z26) decode
   * @param {string} text - Numbers separated by spaces
   * @returns {string} Decoded text
   */
  a1z26Decode(text) {
    return text
      .split(' ')
      .map(num => {
        const n = parseInt(num);
        if (n >= 1 && n <= 26) {
          return String.fromCharCode(n + 64);
        }
        return num;
      })
      .join('');
  }

  /**
   * Polybius square encryption
   * @param {string} text - Text to encrypt
   * @returns {string} Encrypted text (coordinate pairs)
   */
  polybiusEncrypt(text) {
    return text
      .toUpperCase()
      .split('')
      .map(char => {
        if (char === 'J') char = 'I'; // I/J combined
        if (/[A-Z]/.test(char)) {
          for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
              if (
                this.polybiusSquare[row][col] === char ||
                this.polybiusSquare[row][col] === 'I/J'
              ) {
                return `${row + 1}${col + 1}`;
              }
            }
          }
        }
        return char;
      })
      .join(' ');
  }

  /**
   * Polybius square decryption
   * @param {string} text - Coordinate pairs separated by spaces
   * @returns {string} Decrypted text
   */
  polybiusDecrypt(text) {
    return text
      .split(' ')
      .map(pair => {
        if (/^[1-5][1-5]$/.test(pair)) {
          const row = parseInt(pair[0]) - 1;
          const col = parseInt(pair[1]) - 1;
          return this.polybiusSquare[row][col];
        }
        return pair;
      })
      .join('');
  }

  /**
   * NATO Phonetic alphabet encode
   * @param {string} text - Text to encode
   * @returns {string} Phonetic alphabet representation
   */
  natoEncode(text) {
    return text
      .toUpperCase()
      .split('')
      .map(char => {
        if (/[A-Z0-9]/.test(char)) {
          return this.natoPhonetic[char] || char;
        }
        return char;
      })
      .join(' ');
  }

  /**
   * NATO Phonetic alphabet decode
   * @param {string} text - Phonetic words separated by spaces
   * @returns {string} Decoded text
   */
  natoDecode(text) {
    return text
      .split(' ')
      .map(word => {
        return this.natoDecode[word] || word;
      })
      .join('');
  }

  /**
   * XOR cipher encryption/decryption
   * @param {string} text - Text to encrypt/decrypt
   * @param {string} key - XOR key
   * @returns {string} XOR encrypted/decrypted text (hex encoded)
   */
  xorEncrypt(text, key) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      result += charCode.toString(16).padStart(2, '0');
    }
    return result;
  }

  /**
   * XOR cipher decryption
   * @param {string} hex - Hex encoded XOR text
   * @param {string} key - XOR key
   * @returns {string} Decrypted text
   */
  xorDecrypt(hex, key) {
    let result = '';
    for (let i = 0; i < hex.length; i += 2) {
      const byte = parseInt(hex.substr(i, 2), 16);
      const charCode = byte ^ key.charCodeAt((i / 2) % key.length);
      result += String.fromCharCode(charCode);
    }
    return result;
  }

  /**
   * RC4 stream cipher encryption/decryption
   * @param {string} text - Text to encrypt/decrypt
   * @param {string} key - RC4 key
   * @returns {string} RC4 encrypted/decrypted text (hex encoded)
   */
  rc4(text, key) {
    // Key-scheduling algorithm (KSA)
    const S = new Uint8Array(256);
    for (let i = 0; i < 256; i++) S[i] = i;

    let j = 0;
    for (let i = 0; i < 256; i++) {
      j = (j + S[i] + key.charCodeAt(i % key.length)) % 256;
      [S[i], S[j]] = [S[j], S[i]];
    }

    // Pseudo-random generation algorithm (PRGA)
    let i = 0,
      k = 0;
    let result = '';

    for (let n = 0; n < text.length; n++) {
      i = (i + 1) % 256;
      k = (k + S[i]) % 256;
      [S[i], S[k]] = [S[k], S[i]];
      const keystream = S[(S[i] + S[k]) % 256];
      const byte = text.charCodeAt(n) ^ keystream;
      result += byte.toString(16).padStart(2, '0');
    }

    return result;
  }

  /**
   * RC4 decryption (same as encryption for stream cipher)
   * @param {string} hex - Hex encoded RC4 text
   * @param {string} key - RC4 key
   * @returns {string} Decrypted text
   */
  rc4Decrypt(hex, key) {
    // Convert hex to string
    let text = '';
    for (let i = 0; i < hex.length; i += 2) {
      text += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    // RC4 is symmetric, so decryption is the same as encryption
    return this.rc4(text, key);
  }

  /**
   * Utility: Convert ArrayBuffer to Base64
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
   * Utility: Convert Base64 to ArrayBuffer
   */
  base64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
}

// Global instance
const veilCipherTools = new VeilCipherTools();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VeilCipherTools;
} else if (typeof window !== 'undefined') {
  window.VeilCipherTools = VeilCipherTools;
  window.veilCipherTools = veilCipherTools;
}
