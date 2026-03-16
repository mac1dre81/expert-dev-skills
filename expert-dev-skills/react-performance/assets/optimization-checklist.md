# React Performance Optimization Checklist

## 🚀 Pre-Launch Checklist

### Bundle Size
- [ ] Bundle analyzed with source-map-explorer
- [ ] Code splitting implemented for routes
- [ ] Large dependencies replaced with lighter alternatives
- [ ] Tree shaking working (no unused exports)
- [ ] Images optimized and properly sized

### Core Web Vitals
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] TTI < 3.5s on mobile

### Rendering
- [ ] No unnecessary re-renders (React DevTools)
- [ ] useMemo/useCallback used appropriately
- [ ] Virtual scrolling for long lists
- [ ] Components memoized where beneficial

## 📈 Monthly Maintenance

- [ ] Run Lighthouse audit
- [ ] Check for dependency updates
- [ ] Review Core Web Vitals in analytics
- [ ] Audit third-party scripts
- [ ] Check bundle size regression

## 🔧 Quick Wins

1. Add `loading="lazy"` to images
2. Implement route-based code splitting
3. Remove unused dependencies
4. Add `rel="preconnect"` for critical origins
5. Use `will-change` for animations
