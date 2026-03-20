package com.company.app.data.repository

import java.io.IOException

/**
 * Base Repository for expert-grade data handling.
 * Features:
 * - Resource-wrapped responses
 * - Error propagation
 * - Coroutine support
 */
abstract class BaseRepository {
    
    /**
     * Resource wrapper for handling different states of data operations
     */
    sealed class Resource<out T> {
        data class Success<T>(val data: T) : Resource<T>()
        data class Error(val message: String, val throwable: Throwable? = null) : Resource<Nothing>()
        object Loading : Resource<Nothing>()
    }
    
    /**
     * Safe API call wrapper with error handling
     */
    protected suspend fun <T> safeApiCall(
        apiCall: suspend () -> T
    ): Resource<T> = try {
        Resource.Success(apiCall.invoke())
    } catch (e: Exception) {
        handleApiError(e)
    }
    
    /**
     * Error handler with specific error types.
     */
    private fun <T> handleApiError(e: Exception): Resource.Error {
        return when (e) {
            is IOException -> Resource.Error("Network error: ${e.message}", e)
            else -> Resource.Error("Unknown error: ${e.message}", e)
        }
    }
    
    /**
     * In-memory cache helper
     */
    object GlobalCache {
        private val caches = mutableListOf<SimpleCache<*, *>>()

        fun register(cache: SimpleCache<*, *>) {
            caches.add(cache)
        }

        fun nuke() {
            caches.forEach { it.clear() }
        }
    }

    protected class SimpleCache<K, V> {
        private val cache = mutableMapOf<K, V>()
        
        init {
            GlobalCache.register(this)
        }
        
        fun get(key: K): V? = cache[key]
        fun set(key: K, value: V) { cache[key] = value }
        fun remove(key: K) { cache.remove(key) }
        fun clear() { cache.clear() }
    }
}
