# Android Testing Cheatsheet

## Common Assertions
```kotlin
// JUnit
assertEquals(expected, actual)
assertTrue(condition)
assertFalse(condition)
assertNull(object)
assertNotNull(object)
assertThrows<Exception> { code }

// Truth (Google)
assertThat(actual).isEqualTo(expected)
assertThat(list).contains("item")
assertThat(list).hasSize(5)
```

## Coroutine Test Helpers
```kotlin
@Test
fun testCoroutine() = runTest {
    // runTest handles dispatchers automatically
    val result = viewModel.loadData()
    assertEquals(expected, result)
}

// For ViewModels with state
@Test
fun testStateFlow() = runTest {
    val results = mutableListOf<UiState>()
    val job = launch(UnconfinedTestDispatcher()) {
        viewModel.uiState.toList(results)
    }
    
    viewModel.loadData()
    
    assertEquals(listOf(Loading, Success), results)
    job.cancel()
}
```

## Compose Test Matchers
```kotlin
// Finding nodes
composeTestRule.onNodeWithText("Submit")
composeTestRule.onNodeWithTag("profile-image")
composeTestRule.onNodeWithContentDescription("Close")

// Assertions
assertExists()
assertIsDisplayed()
assertIsNotDisplayed()
assertHasClickAction()

// Actions
performClick()
performTextInput("Hello")
performScrollTo()
```
