---
name: code-review-expert
description: Expert code review guidelines and automation. Use when reviewing PRs, mentoring junior devs, or setting up CI/CD quality gates.
license: MIT
metadata:
  author: expert-dev
  version: 1.0.0
---

# 🔍 Expert Code Review

## The Expert Mindset
Code review is about **shared ownership** and **knowledge transfer**, not just finding bugs. An Expert Dev looks for:
1. **Architectural Alignment**: Does this follow the project's established patterns?
2. **Security Vulnerabilities**: Are there any injection points or exposed secrets?
3. **Performance Bottlenecks**: Are we doing O(n^2) operations where O(n) is possible?
4. **Maintainability**: Will the next dev understand this in 6 months?

## Review Checklist

### 🏗️ Architecture & Design
- [ ] **SOLID Compliance**: Is the Single Responsibility Principle being followed?
- [ ] **Dependency Inversion**: Are we depending on abstractions, not implementations?
- [ ] **Consistency**: Does the code match the existing style in `.windsurf/rules/`?

### 🛡️ Security
- [ ] **Input Validation**: Is all user input sanitized?
- [ ] **Secrets**: No hardcoded keys, tokens, or passwords.
- [ ] **Auth**: Are endpoints properly protected by middleware?

### ⚡ Performance
- [ ] **Loops & Complexity**: No unnecessary nested loops or heavy operations in UI threads.
- [ ] **Memory**: Are we properly disposing of observers or cancelling coroutines/effects?
- [ ] **Assets**: Are images/data being loaded lazily where appropriate?

### 🧪 Testing
- [ ] **Coverage**: Does the new code have corresponding unit tests?
- [ ] **Edge Cases**: Are null, empty, and error states handled in tests?

## Feedback Examples (The "Expert" Way)

❌ **Bad**: "This is slow. Fix it."
✅ **Expert**: "This nested map operation might become a bottleneck as the dataset grows (currently O(n^2)). Consider using a `Map` for O(1) lookups to bring this down to O(n)."

❌ **Bad**: "Use a ViewModel here."
✅ **Expert**: "To better separate concerns and survive configuration changes, I recommend moving this logic into a `ViewModel`. This aligns with our Architecture Guidelines in `.windsurf/rules/android-arch.md`."
