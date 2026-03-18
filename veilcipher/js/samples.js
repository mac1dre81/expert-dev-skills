/**
 * VeilCipher - Sample Data Module
 * Preset carrier texts, sample data, and typical options for all tools
 */

const VeilCipherSamples = {
  // Carrier texts for text steganography
  carrierTexts: [
    // Business/Professional
    {
      category: 'Business',
      samples: [
        'Dear Team, I hope this email finds you well. Please review the attached quarterly report and let me know if you have any questions. Best regards, Management',
        'Meeting scheduled for tomorrow at 3 PM in conference room B. Agenda includes budget review, project updates, and Q4 planning. Please come prepared.',
        'Thank you for your inquiry. Our customer service team will respond within 24 hours. Reference number: CS-2024-0892. We appreciate your business.',
        'Per our conversation, I am writing to confirm the details of our agreement. Please find the terms outlined in the attached document for your review.',
        'This is to inform you that your order has been processed and will ship within 2-3 business days. Tracking information will be sent to your email.'
      ]
    },
    // Casual/Personal
    {
      category: 'Personal',
      samples: [
        'Hey! Just wanted to check in and see how you are doing. It has been a while since we last caught up. Let me know when you are free to chat!',
        'Thanks for inviting me to the party! I will definitely be there. Should I bring anything? Looking forward to seeing everyone!',
        'The weather has been amazing lately. Perfect time for a weekend getaway. Have you thought about where you want to go for vacation?',
        'Just finished reading that book you recommended. You were right, it was incredible! We need to discuss the ending when we meet up.',
        'Happy birthday! Hope you have an amazing day filled with joy and celebration. Wish I could be there to celebrate with you!'
      ]
    },
    // News/Articles
    {
      category: 'News',
      samples: [
        'Local authorities announced new traffic regulations will take effect next month. The changes aim to improve safety in residential areas and reduce congestion.',
        'Technology stocks showed mixed results in today trading session. Analysts attribute the volatility to ongoing economic uncertainty and interest rate concerns.',
        'Scientists have discovered a new species of deep-sea creature in the Pacific Ocean. The findings were published in the journal Nature this week.',
        'The city council approved the budget for the new community center. Construction is expected to begin in spring and create approximately 200 jobs.',
        'Weather forecasters predict above-average temperatures for the coming week. Residents are advised to stay hydrated and limit outdoor activities during peak hours.'
      ]
    },
    // Technical/Documentation
    {
      category: 'Technical',
      samples: [
        'System update completed successfully. All services have been restored to normal operation. Please report any issues to the IT helpdesk for immediate assistance.',
        'The API endpoint requires authentication via OAuth 2.0. Include the access token in the Authorization header as a Bearer token for all requests.',
        'Database migration scheduled for maintenance window. Expected downtime is approximately 30 minutes. Please save all work before the scheduled time.',
        'Error handling has been improved in version 2.1. The new logging system provides better debugging information and performance metrics.',
        'Security patch addresses critical vulnerability in authentication module. All users are required to update before the end of this security cycle.'
      ]
    },
    // Literature/Quotes
    {
      category: 'Literature',
      samples: [
        'It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity.',
        'To be, or not to be, that is the question: Whether it is nobler in the mind to suffer the slings and arrows of outrageous fortune, or to take arms against a sea of troubles.',
        'All happy families are alike; each unhappy family is unhappy in its own way. Everything was in confusion in the Oblonsky household.',
        'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. However little known the feelings of such a man.',
        'In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell, nor yet a dry, bare, sandy hole.'
      ]
    },
    // Legal/Formal
    {
      category: 'Legal',
      samples: [
        'The parties hereby agree to the terms and conditions set forth in this agreement. Any disputes shall be resolved through binding arbitration in accordance with applicable law.',
        'Notice is hereby given that the undersigned has been appointed as executor of the estate. All creditors are requested to submit claims within thirty days.',
        'This contract shall become effective upon execution by both parties. Either party may terminate with thirty days written notice to the other party.',
        'Confidentiality obligations shall survive termination of this agreement. Disclosure of proprietary information is strictly prohibited without prior written consent.',
        'The licensee is granted a non-exclusive, non-transferable license to use the software. All intellectual property rights remain with the original owner.'
      ]
    }
  ],

  // Sample images (base64 placeholders or URLs)
  sampleImageTips: [
    'Use PNG format for best results (lossless compression)',
    'Larger images can hide more data (approximately 3 bits per pixel)',
    'Complex images with many colors hide data better than simple images',
    'Avoid using JPEG for steganography (lossy compression may corrupt data)',
    'A 1920x1080 image can hide approximately 750KB of encrypted data'
  ],

  // Sample audio tips
  sampleAudioTips: [
    'Use WAV format for best results (uncompressed)',
    'Longer audio files can hide more data',
    'Audio with varying volume levels works best',
    'Changes are inaudible - hidden above hearing threshold',
    'A 3-minute WAV file can hide approximately 50KB of data'
  ],

  // Password generator typical configurations
  passwordPresets: [
    {
      name: 'Basic (8 chars)',
      length: 8,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: false
    },
    {
      name: 'Standard (12 chars)',
      length: 12,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true
    },
    {
      name: 'Strong (16 chars)',
      length: 16,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true
    },
    {
      name: 'Maximum (32 chars)',
      length: 32,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true
    },
    {
      name: 'No Symbols (16 chars)',
      length: 16,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: false
    },
    {
      name: 'Easy to Read (12 chars)',
      length: 12,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: false,
      excludeAmbiguous: true
    },
    {
      name: 'Ultra Secure (64 chars)',
      length: 64,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true
    }
  ],

  // Hash calculator sample texts
  hashSamples: [
    'Hello, World!',
    'The quick brown fox jumps over the lazy dog',
    'VeilCipher - Professional Steganography Suite',
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    '0123456789',
    '!@#$%^&*()_+-=[]{}|;:,.<>?'
  ],

  // Classic cipher sample texts
  cipherSamples: [
    'HELLO WORLD',
    'THE QUICK BROWN FOX',
    'SECRET MESSAGE',
    'ATTACK AT DAWN',
    'MEET ME AT NOON'
  ],

  // Typical cipher keys
  cipherKeys: {
    caesar: [3, 5, 7, 10, 13],
    affine: [
      [5, 8],
      [7, 3],
      [11, 5],
      [15, 7]
    ],
    vigenere: ['SECRET', 'KEY', 'PASSWORD', 'CIPHER', 'VEIL'],
    railfence: [2, 3, 4, 5]
  }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VeilCipherSamples;
} else if (typeof window !== 'undefined') {
  window.VeilCipherSamples = VeilCipherSamples;
}
