/**
 * VeilCipher - Operational Security Module
 * Monitors and alerts on potential security issues
 * Professional-grade security monitoring for espionage operations
 */

class VeilCipherOpSec {
  constructor() {
    this.alerts = [];
    this.securityLevel = 'HIGH';
    this.threats = new Map();
    this.monitoringActive = true;
    
    this.threatPatterns = {
      screenshot: /screenshot|printscreen|prtsc/i,
      clipboard: /clipboard|copy|paste/i,
      network: /network|connection|offline/i,
      memory: /memory|leak|overflow/i,
      debug: /debug|console|inspect/i
    };
    
    this.init();
  }

  /**
   * Initialize operational security monitoring
   */
  init() {
    this.startThreatMonitoring();
    this.startSessionMonitoring();
    this.startBrowserMonitoring();
    this.startNetworkMonitoring();
    
    console.log('VeilCipher OpSec: Operational Security Monitoring Active');
  }

  /**
   * Start threat monitoring
   */
  startThreatMonitoring() {
    // Monitor for potential security threats
    setInterval(() => {
      this.checkForThreats();
    }, 5000); // Check every 5 seconds

    // Monitor window events
    window.addEventListener('beforeunload', (e) => {
      this.logThreat('session-termination', 'User attempting to close session');
    });

    window.addEventListener('unload', () => {
      this.logThreat('session-closed', 'Session terminated');
    });

    // Monitor visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.logThreat('window-hidden', 'Window minimized/hidden');
      } else {
        this.logThreat('window-visible', 'Window restored');
      }
    });
  }

  /**
   * Start session monitoring
   */
  startSessionMonitoring() {
    let sessionStartTime = Date.now();
    let lastActivity = Date.now();
    
    // Monitor user activity
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    activityEvents.forEach(event => {
      document.addEventListener(event, () => {
        lastActivity = Date.now();
      }, { passive: true });
    });

    // Check for inactivity
    setInterval(() => {
      const now = Date.now();
      const inactivityTime = now - lastActivity;
      const sessionTime = now - sessionStartTime;

      // Check for suspicious inactivity
      if (inactivityTime > 300000) { // 5 minutes
        this.logThreat('prolonged-inactivity', `User inactive for ${Math.floor(inactivityTime / 60000)} minutes`);
      }

      // Check for suspicious session length
      if (sessionTime > 3600000) { // 1 hour
        this.logThreat('prolonged-session', `Session active for ${Math.floor(sessionTime / 3600000)} hours`);
      }

    }, 60000); // Check every minute
  }

  /**
   * Start browser monitoring
   */
  startBrowserMonitoring() {
    // Monitor for developer tools
    let devtools = { open: false };
    const threshold = 160;
    
    setInterval(() => {
      if (
        window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold
      ) {
        if (!devtools.open) {
          devtools.open = true;
          this.logThreat('developer-tools', 'Developer tools detected');
        }
      } else {
        if (devtools.open) {
          devtools.open = false;
          this.logThreat('developer-tools-closed', 'Developer tools closed');
        }
      }
    }, 500);

    // Monitor for suspicious browser features
    if (!window.crypto || !window.crypto.subtle) {
      this.logThreat('crypto-unavailable', 'Web Crypto API not available');
    }

    if (!window.File || !window.FileReader) {
      this.logThreat('file-api-unavailable', 'File API not available');
    }

    if (!window.AudioContext && !window.webkitAudioContext) {
      this.logThreat('audio-api-unavailable', 'Web Audio API not available');
    }
  }

  /**
   * Start network monitoring
   */
  startNetworkMonitoring() {
    // Monitor online/offline status
    window.addEventListener('online', () => {
      this.logThreat('network-online', 'Network connection restored');
    });

    window.addEventListener('offline', () => {
      this.logThreat('network-offline', 'Network connection lost');
    });

    // Monitor for potential network requests
    const originalFetch = window.fetch;
    if (originalFetch) {
      window.fetch = (...args) => {
        this.logThreat('network-request', `Outbound request detected: ${args[0]}`);
        return originalFetch.apply(window, args);
      };
    }

    // Monitor XMLHttpRequest
    const originalXHR = window.XMLHttpRequest;
    if (originalXHR) {
      window.XMLHttpRequest = function() {
        const xhr = new originalXHR();
        
        xhr.addEventListener('loadstart', () => {
          this.logThreat('xhr-request', `XMLHttpRequest started: ${xhr.responseURL}`);
        });
        
        return xhr;
      }.bind(this);
    }
  }

  /**
   * Check for potential threats
   */
  checkForThreats() {
    // Check for console.log usage
    const originalLog = console.log;
    console.log = (...args) => {
      if (args.some(arg => typeof arg === 'string' && arg.includes('veilcipher'))) {
        this.logThreat('console-leak', 'Potential data leak in console.log');
      }
      originalLog.apply(console, args);
    };

    // Check for error logging
    const originalError = console.error;
    console.error = (...args) => {
      if (args.some(arg => typeof arg === 'string' && arg.includes('veilcipher'))) {
        this.logThreat('error-leak', 'Potential data leak in console.error');
      }
      originalError.apply(console, args);
    };

    // Check for suspicious DOM modifications
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const html = node.outerHTML || node.innerHTML;
              if (html && html.includes('veilcipher')) {
                this.logThreat('dom-modification', 'Suspicious DOM modification detected');
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Log a security threat
   * @param {string} type - Type of threat
   * @param {string} description - Description of the threat
   * @param {string} severity - Severity level (LOW, MEDIUM, HIGH, CRITICAL)
   */
  logThreat(type, description, severity = 'MEDIUM') {
    const threat = {
      id: this.generateThreatId(),
      timestamp: new Date().toISOString(),
      type: type,
      description: description,
      severity: severity,
      resolved: false,
      userAgent: navigator.userAgent,
      url: window.location.href,
      sessionId: window.veilCipherApp ? window.veilCipherApp.sessionId : 'unknown'
    };

    this.threats.set(threat.id, threat);
    this.updateSecurityLevel();
    
    // Show alert if monitoring is active
    if (this.monitoringActive) {
      this.showSecurityAlert(threat);
    }

    console.warn(`VeilCipher OpSec Alert [${severity}]: ${description}`);
  }

  /**
   * Show security alert
   * @param {Object} threat - Threat object
   */
  showSecurityAlert(threat) {
    if (window.veilCipherApp) {
      const alertType = this.mapSeverityToAlertType(threat.severity);
      window.veilCipherApp.showOpSecAlert(
        `${threat.type}: ${threat.description}`,
        alertType
      );
    }
  }

  /**
   * Map severity to alert type
   * @param {string} severity - Severity level
   * @returns {string} Alert type
   */
  mapSeverityToAlertType(severity) {
    switch (severity) {
      case 'LOW': return 'info';
      case 'MEDIUM': return 'warning';
      case 'HIGH': return 'danger';
      case 'CRITICAL': return 'critical';
      default: return 'warning';
    }
  }

  /**
   * Update security level based on current threats
   */
  updateSecurityLevel() {
    let highestSeverity = 'LOW';
    
    for (const threat of this.threats.values()) {
      if (!threat.resolved) {
        if (threat.severity === 'CRITICAL') {
          highestSeverity = 'CRITICAL';
          break;
        } else if (threat.severity === 'HIGH' && highestSeverity !== 'CRITICAL') {
          highestSeverity = 'HIGH';
        } else if (threat.severity === 'MEDIUM' && highestSeverity === 'LOW') {
          highestSeverity = 'MEDIUM';
        }
      }
    }

    this.securityLevel = highestSeverity;
    
    // Update UI
    if (window.veilCipherApp) {
      const securityLevelEl = document.getElementById('security-level');
      if (securityLevelEl) {
        securityLevelEl.textContent = this.securityLevel;
        securityLevelEl.style.color = this.getSeverityColor(this.securityLevel);
      }
    }
  }

  /**
   * Get color for severity level
   * @param {string} severity - Severity level
   * @returns {string} CSS color
   */
  getSeverityColor(severity) {
    switch (severity) {
      case 'LOW': return '#2ecc71';
      case 'MEDIUM': return '#f1c40f';
      case 'HIGH': return '#e74c3c';
      case 'CRITICAL': return '#ff0055';
      default: return '#9aa7b2';
    }
  }

  /**
   * Resolve a threat
   * @param {string} threatId - ID of the threat to resolve
   */
  resolveThreat(threatId) {
    const threat = this.threats.get(threatId);
    if (threat) {
      threat.resolved = true;
      threat.resolvedAt = new Date().toISOString();
      this.updateSecurityLevel();
      
      if (window.veilCipherApp) {
        window.veilCipherApp.showOpSecAlert(
          `Threat resolved: ${threat.description}`,
          'success'
        );
      }
    }
  }

  /**
   * Get all threats
   * @returns {Array} Array of threats
   */
  getThreats() {
    return Array.from(this.threats.values());
  }

  /**
   * Get unresolved threats
   * @returns {Array} Array of unresolved threats
   */
  getUnresolvedThreats() {
    return Array.from(this.threats.values()).filter(threat => !threat.resolved);
  }

  /**
   * Clear all threats
   */
  clearThreats() {
    this.threats.clear();
    this.updateSecurityLevel();
  }

  /**
   * Toggle monitoring
   * @param {boolean} active - Whether monitoring should be active
   */
  setMonitoring(active) {
    this.monitoringActive = active;
    if (active) {
      this.logThreat('monitoring-enabled', 'Operational security monitoring re-enabled');
    } else {
      this.logThreat('monitoring-disabled', 'Operational security monitoring disabled', 'HIGH');
    }
  }

  /**
   * Generate unique threat ID
   * @returns {string} Unique ID
   */
  generateThreatId() {
    return 'threat_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  /**
   * Perform security audit
   * @returns {Object} Audit results
   */
  performSecurityAudit() {
    const threats = this.getThreats();
    const unresolved = this.getUnresolvedThreats();
    
    const audit = {
      timestamp: new Date().toISOString(),
      securityLevel: this.securityLevel,
      totalThreats: threats.length,
      unresolvedThreats: unresolved.length,
      resolvedThreats: threats.length - unresolved.length,
      threatsByType: this.groupThreatsByType(threats),
      threatsBySeverity: this.groupThreatsBySeverity(threats),
      recommendations: this.generateRecommendations(unresolved)
    };

    return audit;
  }

  /**
   * Group threats by type
   * @param {Array} threats - Array of threats
   * @returns {Object} Threats grouped by type
   */
  groupThreatsByType(threats) {
    const grouped = {};
    threats.forEach(threat => {
      if (!grouped[threat.type]) {
        grouped[threat.type] = [];
      }
      grouped[threat.type].push(threat);
    });
    return grouped;
  }

  /**
   * Group threats by severity
   * @param {Array} threats - Array of threats
   * @returns {Object} Threats grouped by severity
   */
  groupThreatsBySeverity(threats) {
    const grouped = { LOW: [], MEDIUM: [], HIGH: [], CRITICAL: [] };
    threats.forEach(threat => {
      grouped[threat.severity].push(threat);
    });
    return grouped;
  }

  /**
   * Generate security recommendations
   * @param {Array} unresolvedThreats - Array of unresolved threats
   * @returns {Array} Recommendations
   */
  generateRecommendations(unresolvedThreats) {
    const recommendations = [];
    
    const threatTypes = unresolvedThreats.map(t => t.type);
    
    if (threatTypes.includes('developer-tools')) {
      recommendations.push('Close developer tools to prevent potential data exposure');
    }
    
    if (threatTypes.includes('console-leak') || threatTypes.includes('error-leak')) {
      recommendations.push('Avoid logging sensitive data to console');
    }
    
    if (threatTypes.includes('network-request')) {
      recommendations.push('Monitor and restrict network requests in secure environments');
    }
    
    if (threatTypes.includes('prolonged-inactivity')) {
      recommendations.push('Enable automatic session timeout for security');
    }
    
    if (threatTypes.includes('session-termination')) {
      recommendations.push('Ensure proper session cleanup on termination');
    }

    return recommendations;
  }

  /**
   * Export security report
   * @returns {string} Security report as JSON
   */
  exportSecurityReport() {
    const audit = this.performSecurityAudit();
    const report = {
      reportType: 'VeilCipher Security Audit',
      reportVersion: '1.0',
      generatedAt: new Date().toISOString(),
      sessionId: window.veilCipherApp ? window.veilCipherApp.sessionId : 'unknown',
      audit: audit,
      systemInfo: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screenResolution: `${screen.width}x${screen.height}`,
        viewportSize: `${window.innerWidth}x${window.innerHeight}`
      }
    };

    return JSON.stringify(report, null, 2);
  }
}

// Global instance
const veilCipherOpSec = new VeilCipherOpSec();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VeilCipherOpSec;
} else if (typeof window !== 'undefined') {
  window.VeilCipherOpSec = VeilCipherOpSec;
  window.veilCipherOpSec = veilCipherOpSec;
}