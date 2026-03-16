---
name: api-design-expert
description: Expert API design guidance covering REST, GraphQL, versioning, security, and documentation. Use when designing new APIs, refactoring legacy endpoints, or preparing for public API launch.
license: MIT
compatibility: Any web framework (Express, FastAPI, Spring Boot) with OpenAPI 3.0 support
metadata:
  author: expert-dev
  version: 1.0.0
---

# 🌐 Production-Ready API Design

## When to Use
Activate when the user is:
- Designing a new API from scratch
- Refactoring messy existing endpoints
- Preparing to expose a public API
- Debating REST vs GraphQL
- Needing API versioning strategy
- Concerned about API security

## Core Design Principles
<principles>
**API Design Maturity Model** (Richardson):
- **Level 0**: One endpoint (RPC-style)
- **Level 1**: Multiple endpoints (resources)
- **Level 2**: HTTP verbs (GET, POST, PUT, DELETE) ✅ Target this
- **Level 3**: HATEOAS (hypermedia controls)

**Key Tenets**:
1. **Resource-oriented** - URLs represent nouns, not verbs
2. **Stateless** - Each request contains all info needed
3. **Idempotent where possible** - Safe to retry
4. **Versioned** - Never break existing clients
5. **Well-documented** - Self-describing endpoints
</principles>

## REST API Design Patterns

### URL Structure
```typescript
// ✅ Good REST patterns
GET    /api/v1/users              // List users
POST   /api/v1/users              // Create user
GET    /api/v1/users/{id}         // Get specific user
PUT    /api/v1/users/{id}          // Full update
PATCH  /api/v1/users/{id}          // Partial update
DELETE /api/v1/users/{id}          // Delete user

// Relationships
GET    /api/v1/users/{id}/orders   // User's orders
POST   /api/v1/users/{id}/orders   // Create order for user

// Actions (use verbs sparingly)
POST   /api/v1/users/{id}/activate // Non-CRUD operations
POST   /api/v1/orders/{id}/cancel  // State transitions

// ❌ Bad patterns
GET    /api/getUser                // Verb in URL
POST   /api/updateUser             // Verb, not resource
GET    /api/users/all              // Redundant
DELETE /api/removeUserById/{id}     // Too verbose
```

### Versioning Strategies
1. **URI Versioning (Recommended)**: `/api/v1/resource`
2. **Header Versioning**: `Accept: application/vnd.company.v1+json`
3. **Query Parameter**: `/api/resource?v=1`

### Security Best Practices
- **Authentication**: Use OAuth2 + OpenID Connect
- **Authorization**: Implement RBAC (Role-Based Access Control) or ABAC
- **Rate Limiting**: Protect against DDoS and brute force
- **Input Validation**: Strictly validate all incoming data using JSON Schema
- **Data Sanitization**: Prevent SQL injection and XSS

### Documentation
- Use **OpenAPI 3.0** (Swagger) for REST
- Use **GraphiQL/Apollo Studio** for GraphQL
- Include clear error response examples
- Provide client SDKs or code snippets
