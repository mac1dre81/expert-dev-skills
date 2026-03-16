---
name: react-performance-optimization
description: Expert guidance on React performance optimization - bundle analysis, render optimization, code splitting, and Core Web Vitals improvement. Use when users have slow React apps, high bounce rates, or poor Lighthouse scores.
license: MIT
compatibility: React 16.8+ with modern tooling (Vite, Next.js, Create React App)
metadata:
  author: expert-dev
  version: 1.1.0
---

# ⚡ React Performance Mastery

## When to Activate
This skill is essential when the user:
- Complains about slow React app loading/rendering
- Has poor Lighthouse scores (especially FCP, LCP, TTI)
- Reports UI jank or frozen frames
- Asks about code splitting or lazy loading
- Needs to optimize bundle size
- Is preparing for production launch

## Performance Philosophy
<philosophy>
**80/20 Rule**: 80% of performance gains come from 20% of the work:
1. **Measure first** - Never optimize blindly
2. **Fix the biggest bottlenecks** - Bundle size, unnecessary re-renders
3. **Optimize progressively** - Ship fast, then make faster

**Core Web Vitals Priority**:
- 🥇 **LCP** (Largest Contentful Paint) - < 2.5s
- 🥈 **INP** (Interaction to Next Paint) - < 200ms  
- 🥉 **CLS** (Cumulative Layout Shift) - < 0.1
</philosophy>

## Diagnostic Toolkit

### 1. Bundle Analysis
Run our [bundle analyzer script](scripts/analyze-bundle.sh) first:
```bash
# Shows exactly what's bloating your bundle
./scripts/analyze-bundle.sh

# Sample output:
# 📦 Total bundle: 856 kB
# 🔴 vendors~main.js: 420 kB (react-dom, lodash)
# 🟡 components.js: 234 kB (heavy: date-picker, chart)
# 🟢 app.js: 202 kB
```

### 2. Render Profiling
```javascript
// Add to development
import { Profiler } from 'react';

<Profiler id="Sidebar" onRender={(id, phase, actualTime) => {
  console.log(`${id} ${phase}: ${actualTime}ms`);
  if (actualTime > 16) { // 60fps = 16ms per frame
    console.warn(`⚠️ ${id} took too long to render`);
  }
}}>
  <Sidebar />
</Profiler>
```

### 3. Lighthouse CI
Integrate Lighthouse into CI/CD:

```yaml
# .github/workflows/performance.yml
name: Performance
on: [pull_request]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Lighthouse
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            https://staging.example.com/
          budgetPath: ./lighthouse-budget.json
```

## Optimization Strategies

### 1. Code Splitting

#### Route-Based Splitting (Recommended)
```javascript
// ❌ Before - all code loads at once
import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';
import { Analytics } from './pages/Analytics';

// ✅ After - split by routes
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));
const Analytics = lazy(() => import('./pages/Analytics'));

function App() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Suspense>
  );
}
```

#### Component-Level Splitting
```javascript
// For heavy components used conditionally
const HeavyDataTable = lazy(() => import('./HeavyDataTable'));

function UserList() {
  const [showFullTable, setShowFullTable] = useState(false);
  
  return (
    <div>
      <SimpleList users={users} />
      {showFullTable && (
        <Suspense fallback={<TableSkeleton />}>
          <HeavyDataTable data={users} />
        </Suspense>
      )}
    </div>
  );
}
```

### 2. Render Optimization

#### Memoization Patterns
```typescript
// ❌ Avoid - recreated every render
const heavyProcess = (data: Data[]) => {
  return data.filter(d => d.value > 100).sort();
};

// ✅ Good - memoize expensive computations
const processedData = useMemo(() => 
  data.filter(d => d.value > 100).sort(),
  [data]
);

// ✅ Better - extract to custom hook with caching
function useProcessedData(data: Data[]) {
  return useMemo(() => {
    return data.filter(d => d.value > 100).sort();
  }, [data]);
}
```

#### Preventing Unnecessary Rerenders
```typescript
// Component with stable props
const UserCard = memo(({ user, onAction }) => {
  return (
    <div>
      <h3>{user.name}</h3>
      <button onClick={() => onAction(user.id)}>
        Action
      </button>
    </div>
  );
}, (prev, next) => {
  // Custom comparison if needed
  return prev.user.id === next.user.id;
});

// Parent with stable callbacks
function UserList() {
  // ✅ Stable callback reference
  const handleAction = useCallback((userId: string) => {
    // Handle action
  }, []); // No dependencies = stable forever

  return users.map(user => (
    <UserCard key={user.id} user={user} onAction={handleAction} />
  ));
}
```

### 3. Image Optimization
```typescript
// ✅ Use Next.js Image component
import Image from 'next/image';

<Image
  src="/hero.jpg"
  width={1200}
  height={600}
  alt="Hero"
  priority // For LCP images
  loading="eager" // Critical above-fold
  quality={85} // Balance quality/size
/>

// ✅ Or use modern img attributes
<img 
  src="/image.webp"
  alt="Optimized"
  loading="lazy" // Below-fold
  decoding="async"
  fetchpriority="high" // Critical images
/>
```

## Advanced Techniques

### Virtual Lists for Long Data
```typescript
import { FixedSizeList } from 'react-window';

const Row = ({ index, style, data }) => (
  <div style={style}>
    {data[index].name}
  </div>
);

function UserDirectory({ users }) {
  return (
    <FixedSizeList
      height={600}
      width="100%"
      itemCount={users.length}
      itemSize={50}
      itemData={users}
    >
      {Row}
    </FixedSizeList>
  );
}
```

### Progressive Hydration
```typescript
// For Next.js apps
import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(
  () => import('../components/HeavyChart'),
  {
    loading: () => <ChartSkeleton />,
    ssr: false, // Don't SSR if not needed
  }
);
```

## Common Performance Traps
<traps>
❌ **Not measuring before optimizing** - Always use data
✅ Run Lighthouse, React DevTools Profiler first

❌ **Premature optimization** - Don't optimize what isn't slow
✅ Focus on real bottlenecks users experience

❌ **Over-memoization** - Memo has cost too
✅ Only memoize expensive computations, not trivial ones

❌ **Ignoring mobile** - Desktop fast doesn't mean mobile fast
✅ Test on low-end devices, slow networks

❌ **Third-party bloat** - Each library costs performance
✅ Audit dependencies, use lightweight alternatives
</traps>
