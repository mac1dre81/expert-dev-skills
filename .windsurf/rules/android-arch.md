---
trigger: glob
globs: "**/*.kt,**/*.java"
description: Enforce Google-recommended Android architecture patterns
---

# 📱 Android Architecture Guidelines

<coding_standards>
When writing Android code, enforce these patterns:

## Package Structure
com.company.app/
├── data/ # Repositories, data sources, models
├── domain/ # Use cases, domain models
├── presentation/ # UI components, ViewModels, states
└── di/ # Dependency injection modules

## ViewModel Rules
- Never hold references to Activities/Fragments
- Use `stateIn` with `WhileSubscribed` for UI state
- Expose `StateFlow`/`SharedFlow`, never mutable
- Handle `viewModelScope` coroutines properly

## Repository Pattern
```kotlin
interface UserRepository {
    suspend fun getUser(id: String): Flow<Resource<User>>
}

class UserRepositoryImpl @Inject constructor(
    private val localDataSource: UserDao,
    private val remoteDataSource: UserApi
) : UserRepository {
    // Implement with proper error handling and caching
}
```

## Dependency Injection
- Use constructor injection exclusively
- Define qualifiers for different implementations
- Scope appropriately (@Singleton, @ActivityScoped)

## Error Handling
- Use sealed classes for results
- Never swallow exceptions
- Propagate errors to UI layer appropriately
</coding_standards>
