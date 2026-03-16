---
name: android-testing-expert
description: Expert guidance on Android testing strategies - unit tests, integration tests, UI tests with Compose, and test doubles. Use when the user needs to test Android apps, especially with complex architectures or legacy code.
license: MIT
compatibility: Android projects with Kotlin, JUnit 4/5, and either Espresso or Compose UI tests
metadata:
  author: expert-dev
  version: 1.0.0
---

# 📱 Android Testing Mastery

## When to Use This Skill
Activate when the user asks about:
- Testing Android applications (unit/integration/UI)
- Setting up test infrastructure
- Mocking dependencies (MockK, Mockito)
- Testing ViewModels, Repositories, or UseCases
- Testing Compose UI
- Improving test coverage and reliability
- Legacy code testing strategies

## Core Testing Philosophy
<philosophy>
Follow the **Test Pyramid**:
- **70% Unit Tests** - Fast, isolated, covering business logic
- **20% Integration Tests** - Repository + DB, API clients
- **10% UI Tests** - Critical user journeys

**FIRST Principles**:
- **F**ast: Tests should run quickly
- **I**solated: No test depends on another
- **R**epeatable: Same result every time
- **S**elf-validating: Pass/fail without human interpretation
- **T**imely: Written with/just before the code
</philosophy>

## Unit Testing ViewModels

### Basic ViewModel Test
```kotlin
class UserViewModelTest {
    private val userRepository = mockk<UserRepository>()
    private val viewModel = UserViewModel(userRepository)

    @Test
    fun `loadUser should update state with user data`() = runTest {
        // Given
        val userId = "123"
        val expectedUser = User(id = userId, name = "John")
        coEvery { userRepository.getUser(userId) } returns Result.success(expectedUser)

        // When
        viewModel.loadUser(userId)

        // Then
        val actualState = viewModel.userState.value
        assert(actualState is UserState.Success)
        assertEquals(expectedUser, (actualState as UserState.Success).user)
        coVerify { userRepository.getUser(userId) }
    }
}
```

## Testing StateFlow/Compose
```kotlin
@Test
fun `error state should show correct message`() = runTest {
    // Setup
    val errorMessage = "Network error"
    coEvery { userRepository.getUser(any()) } returns Result.failure(IOException(errorMessage))

    // Execute
    viewModel.loadUser("123")

    // Compose UI Test
    composeTestRule.setContent {
        UserProfileScreen(viewModel)
    }

    // Verify error state
    composeTestRule
        .onNodeWithText(errorMessage)
        .assertIsDisplayed()
    
    composeTestRule
        .onNodeWithTag("retry-button")
        .assertExists()
}
```

## Integration Testing Patterns

### Room Database Tests
```kotlin
@RunWith(AndroidJUnit4::class)
class UserDaoTest {
    private lateinit var database: AppDatabase
    private lateinit var dao: UserDao

    @Before
    fun setup() {
        database = Room.inMemoryDatabaseBuilder(
            ApplicationProvider.getApplicationContext(),
            AppDatabase::class.java
        ).build()
        dao = database.userDao()
    }

    @Test
    fun insertAndGetUser() = runTest {
        val user = User(id = "1", name = "Test")
        dao.insert(user)
        
        val loaded = dao.getUser("1")
        assertEquals(user, loaded)
    }

    @After
    fun teardown() {
        database.close()
    }
}
```

### Repository with Real API
```kotlin
@Test
fun `repository should cache network results`() = runTest {
    // Use test server
    val server = MockWebServer()
    server.enqueue(MockResponse().setBody("""{"id":"1","name":"Test"}"""))
    
    val api = Retrofit.Builder()
        .baseUrl(server.url("/"))
        .build()
        .create(UserApi::class.java)
    
    val repository = UserRepositoryImpl(api, fakeDao)
    
    // First call - hits network
    val result1 = repository.getUser("1").first()
    assertEquals(1, server.requestCount)
    
    // Second call - should use cache
    val result2 = repository.getUser("1").first()
    assertEquals(1, server.requestCount) // Still 1
    
    server.shutdown()
}
```

## Mocking Strategies with MockK

### Handling Complex Scenarios
```kotlin
@Test
fun `should handle repository errors gracefully`() = runTest {
    // Create relaxed mock for methods we don't care about
    val repository = mockk<Repository>(relaxed = true)
    
    // Only mock the specific call we care about
    coEvery { repository.getUser(any()) } throws IOException("Network failed")
    
    // Test error handling
    val result = viewModel.loadUser("123")
    assert(result is ErrorState.NetworkError)
    
    // Verify specific interactions
    coVerify(exactly = 1) { repository.getUser("123") }
    coVerify(inverse = true) { repository.saveUser(any()) }
}
```

## Testing Legacy Code

### Characterization Tests
```kotlin
@Test
fun `characterize existing behavior before refactoring`() {
    // Don't test "correctness", document actual behavior
    val legacyComponent = LegacyCode()
    
    val result = legacyComponent.process("input")
    
    // This documents current behavior
    assertEquals("expected-output", result)
    
    // Save this test; after refactoring, result should match
}
```

## Common Pitfalls & Solutions
<pitfalls>
❌ **Testing implementation, not behavior**
✅ Test what the code does, not how it does it

❌ **Flaky tests with timing issues**
✅ Use Dispatchers.setMain with TestCoroutineDispatcher

❌ **Over-mocking leading to brittle tests**
✅ Prefer fakes for stable dependencies, mocks for external services

❌ **Large test classes doing too much**
✅ One test class per production class, one behavior per test

❌ **Slow UI tests**
✅ Use ComposeTestRule with idling resources, test critical paths only
</pitfalls>

## When to Use Different Test Types
| Test Type | Speed | When to Use |
| :--- | :--- | :--- |
| Unit (JUnit) | ⚡⚡⚡ | Business logic, ViewModels, UseCases |
| Integration | ⚡⚡ | Repositories + DB, API clients |
| UI (Compose) | ⚡ | Critical user flows, accessibility |
| End-to-End | 🐢 | Release validation, payment flows |
