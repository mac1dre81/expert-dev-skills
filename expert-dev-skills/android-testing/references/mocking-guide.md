# Mocking Guide for Android Tests

## MockK Best Practices

### Basic Mocking
```kotlin
// Regular mock
val repository = mockk<UserRepository>()

// Relaxed mock (returns default values for un-stubbed methods)
val repository = mockk<UserRepository>(relaxed = true)

// Spy (real object with some mocked methods)
val realRepo = UserRepositoryImpl()
val spyRepo = spyk(realRepo)
```

### Answer Types
```kotlin
// Return a value
coEvery { repository.getUser("123") } returns user

// Throw an exception
coEvery { repository.getUser("123") } throws IOException()

// Multiple answers in sequence
coEvery { repository.getUser(any()) } returnsMany listOf(user1, user2, user3)

// Answer based on arguments
coEvery { repository.getUser(any()) } answers {
    val id = firstArg<String>()
    User(id, "Name for $id")
}
```

### Verification
```kotlin
// Verify exact number of calls
coVerify(exactly = 1) { repository.saveUser(any()) }

// Verify at least
coVerify(atLeast = 2) { repository.getUser(any()) }

// Verify order
coVerifyOrder {
    repository.getUser("123")
    repository.saveUser(any())
}

// Verify no more interactions
verify { repository wasNot Called }
```
