# Expert REST API Patterns

## 1. Pagination (The "Standard" Way)
Always use cursor-based pagination for large datasets to avoid the "offset performance" trap.

### Request
`GET /api/v1/orders?limit=20&after=cursor_xyz123`

### Response
```json
{
  "data": [...],
  "pagination": {
    "has_more": true,
    "next_cursor": "cursor_abc456",
    "total_count": 1250
  }
}
```

## 2. Advanced Filtering & Sorting
Use a consistent query language for complex filters.

`GET /api/v1/products?sort=-created_at,price&filter[category]=electronics&filter[price_gt]=500`

## 3. Standardized Error Responses
Never return plain text errors. Always use a structured RFC 7807 (Problem Details for HTTP APIs) format.

```json
{
  "type": "https://api.example.com/errors/validation-failed",
  "title": "Validation Failed",
  "status": 400,
  "detail": "The 'email' field is not a valid email address.",
  "instance": "/orders/123",
  "errors": [
    {
      "field": "email",
      "message": "must be a valid email"
    }
  ]
}
```

## 4. Idempotency Keys
For operations that shouldn't be repeated (like payments), require an `Idempotency-Key` header.

`POST /api/v1/payments`
`Idempotency-Key: <uuid>`

The server should cache the result for this key for 24 hours.
