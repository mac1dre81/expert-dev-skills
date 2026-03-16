/**
 * VeilCipher - Audio Steganography Module
 * Implements audio spectrum steganography for WAV files
 * Professional-grade audio hiding using Web Audio API
 */

class AudioSteganography {
  constructor() {
    this.maxMessageSize = 512 * 1024; // 512KB limit for audio
    this.sampleRate = 44100;
    this.bitsPerSample = 2; // Use 2 bits per sample for quality
    this.frequencyRange = {
      low: 20,      // Hz
      high: 18000   // Hz (inaudible range)
    };
  }

  /**
   * Hide encrypted message in audio file
   * @param {File} audioFile - Carrier audio file (WAV)
   * @param {string} encryptedMessage - Encrypted message to hide
   * @param {string} password - Encryption password
   * @returns {Promise<Object>} Result with modified audio
   */
  async hideMessage(audioFile, encryptedMessage, password) {
    try {
      // Validate inputs
      const validation = this.validateInputs(audioFile, encryptedMessage);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      // Load and decode audio
      const audioData = await this.loadAudio(audioFile);
      const audioBuffer = audioData.buffer;
      const channelData = audioBuffer.getChannelData(0); // Use mono channel

      // Prepare message with header
      const messageWithHeader = this.prepareMessage(encryptedMessage, password, audioBuffer);
      const messageBytes = this.stringToBytes(messageWithHeader);

      // Check capacity
      const capacity = this.calculateCapacity(audioBuffer);
      if (messageBytes.length > capacity) {
        return {
          success: false,
          error: `Message too large. Maximum capacity: ${this.formatBytes(capacity)}, Message size: ${this.formatBytes(messageBytes.length)}`
        };
      }

      // Hide message in audio samples
      const modifiedChannelData = this.hideInAudio(channelData, messageBytes);
      audioBuffer.copyToChannel(modifiedChannelData, 0);

      // Create modified audio blob
      const modifiedAudioBlob = await this.createAudioBlob(audioBuffer);

      return {
        success: true,
        modifiedAudio: modifiedAudioBlob,
        originalSize: audioFile.size,
        messageSize: messageBytes.length,
        capacity: capacity,
        efficiency: Math.round((messageBytes.length / capacity) * 100),
        sampleRate: audioBuffer.sampleRate,
        duration: audioBuffer.duration,
        channels: audioBuffer.numberOfChannels
      };

    } catch (error) {
      console.error('Audio steganography failed:', error);
      return {
        success: false,
        error: 'Audio steganography operation failed: ' + error.message
      };
    }
  }

  /**
   * Extract hidden message from audio file
   * @param {File} audioFile - Audio file containing hidden message
   * @param {string} password - Password for decryption
   * @returns {Promise<Object>} Extracted message
   */
  async extractMessage(audioFile, password) {
    try {
      // Load audio
      const audioData = await this.loadAudio(audioFile);
      const audioBuffer = audioData.buffer;
      const channelData = audioBuffer.getChannelData(0);

      // Extract from audio samples
      const extractedData = this.extractFromAudio(channelData);
      
      if (!extractedData.success) {
        return extractedData;
      }

      // Validate and decrypt
      return this.validateAndDecrypt(extractedData.message, password);

    } catch (error) {
      console.error('Audio message extraction failed:', error);
      return {
        success: false,
        error: 'Audio extraction failed: ' + error.message
      };
    }
  }

  /**
   * Load and decode audio file
   * @param {File} file - Audio file
   * @returns {Promise<Object>} Audio data
   */
  async loadAudio(file) {
    return new Promise((resolve, reject) => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const audioBuffer = await audioContext.decodeAudioData(e.target.result);
          resolve({
            buffer: audioBuffer,
            context: audioContext,
            duration: audioBuffer.duration,
            sampleRate: audioBuffer.sampleRate,
            channels: audioBuffer.numberOfChannels
          });
        } catch (error) {
          reject(new Error('Failed to decode audio file'));
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read audio file'));
      };

      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Prepare message with header for audio steganography
   * @param {string} message - Original message
   * @param {string} password - Password for verification
   * @param {AudioBuffer} audioBuffer - Audio buffer for metadata
   * @returns {string} Prepared message with header
   */
  prepareMessage(message, password, audioBuffer) {
    const header = {
      magic: 'VEIL-AUDIO',
      version: '1.0',
      timestamp: Date.now(),
      audioInfo: {
        sampleRate: audioBuffer.sampleRate,
        duration: audioBuffer.duration,
        channels: audioBuffer.numberOfChannels,
        length: audioBuffer.length
      },
      passwordHash: this.hashPassword(password),
      messageLength: message.length,
      checksum: this.calculateChecksum(this.stringToBytes(message))
    };

    return JSON.stringify(header) + '|||' + message;
  }

  /**
   * Hide message in audio samples using LSB manipulation
   * @param {Float32Array} channelData - Audio channel data
   * @param {Uint8Array} messageBytes - Message to hide
   * @returns {Float32Array} Modified audio data
   */
  hideInAudio(channelData, messageBytes) {
    const data = new Float32Array(channelData);
    const totalBits = messageBytes.length * 8;
    let bitIndex = 0;
    let byteIndex = 0;

    // Skip silent or very quiet samples to avoid detection
    const threshold = 0.01; // Minimum amplitude threshold

    for (let i = 0; i < data.length && bitIndex < totalBits; i++) {
      const sample = Math.abs(data[i]);
      
      // Only modify samples above threshold
      if (sample > threshold) {
        if (byteIndex < messageBytes.length) {
          const byte = messageBytes[byteIndex];
          const bit = (byte >> (7 - (bitIndex % 8))) & 1;
          
          // Convert float to integer representation for LSB manipulation
          const intSample = Math.round(sample * 32767); // Convert to 16-bit integer
          const modifiedInt = (intSample & 0xFFFE) | bit; // Clear and set LSB
          const modifiedFloat = modifiedInt / 32767; // Convert back to float
          
          // Preserve original sign
          data[i] = data[i] >= 0 ? modifiedFloat : -modifiedFloat;
          
          bitIndex++;
          if (bitIndex % 8 === 0) {
            byteIndex++;
          }
        }
      }
    }

    return data;
  }

  /**
   * Extract message from audio samples
   * @param {Float32Array} channelData - Audio channel data
   * @returns {Object} Extracted message
   */
  extractFromAudio(channelData) {
    const data = channelData;
    let bits = [];
    let currentByte = 0;
    let bitCount = 0;
    let byteCount = 0;
    let messageBytes = [];
    const threshold = 0.01;

    // Extract bits from LSB of audio samples
    for (let i = 0; i < data.length; i++) {
      const sample = Math.abs(data[i]);
      
      if (sample > threshold) {
        // Convert float to integer and extract LSB
        const intSample = Math.round(sample * 32767);
        const bit = intSample & 1;
        
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
    }

    if (messageBytes.length === 0) {
      return { success: false, error: 'No hidden message found in audio' };
    }

    // Convert to string and parse
    const messageString = this.bytesToString(messageBytes);
    const delimiterIndex = messageString.indexOf('|||');
    
    if (delimiterIndex === -1) {
      return { success: false, error: 'Invalid message format in audio' };
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
   * Create audio blob from modified buffer
   * @param {AudioBuffer} audioBuffer - Modified audio buffer
   * @returns {Promise<Blob>} Audio blob
   */
  async createAudioBlob(audioBuffer) {
    return new Promise((resolve) => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const offlineContext = new OfflineAudioContext(
        audioBuffer.numberOfChannels,
        audioBuffer.length,
        audioBuffer.sampleRate
      );

      const source = offlineContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(offlineContext.destination);

      source.start(0);
      
      offlineContext.startRendering().then((renderedBuffer) => {
        // Convert AudioBuffer to WAV blob
        const wavBlob = this.audioBufferToWav(renderedBuffer);
        resolve(wavBlob);
      });
    });
  }

  /**
   * Convert AudioBuffer to WAV format
   * @param {AudioBuffer} audioBuffer - Audio buffer to convert
   * @returns {Blob} WAV blob
   */
  audioBufferToWav(audioBuffer) {
    const numChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;
    
    let offset = 0;
    const buffer = new ArrayBuffer(44 + audioBuffer.length * numChannels * 2);
    const view = new DataView(buffer);

    // Write WAV header
    const writeString = (view, offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + audioBuffer.length * numChannels * 2, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * 2, true);
    view.setUint16(32, numChannels * 2, true);
    view.setUint16(34, bitDepth, true);
    writeString(view, 36, 'data');
    view.setUint32(40, audioBuffer.length * numChannels * 2, true);

    // Write audio data
    offset = 44;
    const channels = [];
    for (let i = 0; i < numChannels; i++) {
      channels.push(audioBuffer.getChannelData(i));
    }

    let sample, bytes;
    for (let i = 0; i < audioBuffer.length; i++) {
      for (let channel = 0; channel < numChannels; channel++) {
        sample = Math.max(-1, Math.min(1, channels[channel][i]));
        bytes = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
        view.setInt16(offset, bytes, true);
        offset += 2;
      }
    }

    return new Blob([view], { type: 'audio/wav' });
  }

  /**
   * Calculate capacity of audio for steganography
   * @param {AudioBuffer} audioBuffer - Audio buffer
   * @returns {number} Maximum message size in bytes
   */
  calculateCapacity(audioBuffer) {
    // Only use samples above threshold for hiding
    const channelData = audioBuffer.getChannelData(0);
    const threshold = 0.01;
    let usableSamples = 0;

    for (let i = 0; i < channelData.length; i++) {
      if (Math.abs(channelData[i]) > threshold) {
        usableSamples++;
      }
    }

    // Each usable sample can store 1 bit (using LSB)
    const totalBits = usableSamples * this.bitsPerSample;
    return Math.floor(totalBits / 8); // Convert to bytes
  }

  /**
   * Validate input parameters
   * @param {File} audioFile - Audio file
   * @param {string} message - Message to hide
   * @returns {Object} Validation result
   */
  validateInputs(audioFile, message) {
    if (!audioFile) {
      return { valid: false, error: 'No audio file selected' };
    }

    if (!message || message.length === 0) {
      return { valid: false, error: 'Message cannot be empty' };
    }

    if (message.length > this.maxMessageSize) {
      return { valid: false, error: `Message too large. Maximum size: ${this.formatBytes(this.maxMessageSize)}` };
    }

    const allowedTypes = ['audio/wav', 'audio/x-wav', 'audio/mpeg', 'audio/mp3'];
    if (!allowedTypes.includes(audioFile.type)) {
      return { valid: false, error: 'Unsupported audio format. Please use WAV or MP3.' };
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
      if (header.magic !== 'VEIL-AUDIO') {
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
        audioInfo: header.audioInfo
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
      hash = ((hash << 5) - hash) + char;
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
const audioSteganography = new AudioSteganography();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AudioSteganography;
} else if (typeof window !== 'undefined') {
  window.AudioSteganography = AudioSteganography;
  window.audioSteganography = audioSteganography;
}