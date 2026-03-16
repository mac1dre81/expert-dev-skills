---
name: telemetry-expert
description: Expert guidance on application monitoring, logging, and performance tracking. Use when implementing analytics, crash reporting, or user behavior tracking.
license: MIT
metadata:
  author: expert-dev
  version: 1.0.0
---

# 📊 Expert Telemetry & Monitoring

## Core Principles
1. **No PII in Logs**: Never log emails, passwords, or tokens.
2. **Context is King**: Every error log should include device state, user ID (anonymized), and breadcrumbs.
3. **Performance First**: Logging shouldn't block the UI thread—use background workers.
4. **Data-Driven**: If you can't measure it, you can't improve it.

## The Telemetry Pyramid
- **Level 1: Crash Reporting** (Sentry, Crashlytics) - Critical failures.
- **Level 2: Error Logging** (Timber, Winston) - Handled exceptions.
- **Level 3: Performance Tracking** (Core Web Vitals, App Start time).
- **Level 4: Business Analytics** (Amplitude, Mixpanel) - User behavior.

## Implementation Guide

### 📱 Android (ExpertLogger)
Use the `ExpertLogger` wrapper to ensure all logs are automatically enriched with coroutine context and device metadata.

### 🌐 Web (Vitals Monitor)
Automatically report LCP, FID, and CLS to your analytics endpoint to ensure performance budgets are met.

## Monitoring Checklist
- [ ] **Privacy**: Logs are stripped of PII.
- [ ] **Alerts**: Critical errors trigger PII/PagerDuty alerts.
- [ ] **Retention**: Log rotation/retention policies are set.
- [ ] **Sampling**: High-volume events are sampled to save costs.
