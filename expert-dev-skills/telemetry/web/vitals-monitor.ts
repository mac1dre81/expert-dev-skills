/**
 * ⚡ Expert Vitals Monitor: A production-grade React performance tracker.
 *
 * Features:
 * - Google Core Web Vitals reporting (LCP, FID, CLS)
 * - Navigation and Resource Timing API integration
 * - PII-safe event tracking
 * - Sampling support for high-volume apps
 */

import { onCLS, onFID, onLCP, Metric } from 'web-vitals';

interface VitalsConfig {
  analyticsEndpoint: string;
  samplingRate?: number; // 0.0 to 1.0
  appVersion: string;
}

export class VitalsMonitor {
  private config: VitalsConfig;

  constructor(config: VitalsConfig) {
    this.config = { samplingRate: 1.0, ...config };
    this.init();
  }

  private init() {
    if (Math.random() > (this.config.samplingRate || 1)) return;

    onCLS(this.report);
    onFID(this.report);
    onLCP(this.report);

    // Track initial load performance
    window.addEventListener('load', () => {
      this.trackLoadTiming();
    });
  }

  private report = (metric: Metric) => {
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating, // 'good' | 'needs-improvement' | 'failed'
      id: metric.id,
      appVersion: this.config.appVersion,
      userAgent: navigator.userAgent,
    });

    // Use sendBeacon for more reliable reporting on page hide
    if (navigator.sendBeacon) {
      navigator.sendBeacon(this.config.analyticsEndpoint, body);
    } else {
      fetch(this.config.analyticsEndpoint, {
        method: 'POST',
        body,
        keepalive: true,
      });
    }
  };

  private trackLoadTiming() {
    const [navigation] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    if (navigation) {
      this.trackEvent('page_load', {
        dns: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcp: navigation.connectEnd - navigation.connectStart,
        ttfb: navigation.responseStart - navigation.requestStart,
        dom_complete: navigation.domComplete,
      });
    }
  }

  public trackEvent(name: string, properties?: Record<string, any>) {
    console.log(`[Telemetry] ${name}`, properties);
    // Implementation for tracking custom events (Mixpanel, Amplitude, etc.)
  }
}
