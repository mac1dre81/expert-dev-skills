package com.company.app.domain.usecase

import kotlinx.coroutines.flow.Flow

/**
 * Simplified Base UseCase using operator fun invoke.
 * Features:
 * - Separation of concerns (Presentation <-> Data)
 * - Single-responsibility execution
 * - Clean API using invoke operator
 */
abstract class BaseUseCase<in P, out R> {
    /**
     * Executes the use case with given parameters
     * @param params Input parameters for the use case
     * @return Result of type R
     */
    abstract suspend operator fun invoke(params: P): R
}

/**
 * UseCase for returning a Flow (Reactive streams).
 */
abstract class BaseFlowUseCase<in P, out R> {
    abstract operator fun invoke(params: P): Flow<R>
}

/**
 * UseCase for operations with parameter validation.
 */
abstract class ValidatedUseCase<in P, out R> {
    
    /**
     * Validates parameters before execution.
     * @return Error message if invalid, null if valid.
     */
    protected abstract fun validate(params: P): String?

    /**
     * Execute with parameter validation.
     */
    suspend operator fun invoke(params: P): Result<R> {
        val validationError = validate(params)
        return if (validationError != null) {
            Result.failure(IllegalArgumentException(validationError))
        } else {
            try {
                Result.success(doWork(params))
            } catch (e: Exception) {
                Result.failure(e)
            }
        }
    }

    protected abstract suspend fun doWork(params: P): R
}

/**
 * Use case with no parameters
 */
abstract class NoParamUseCase<out R> {
    abstract suspend operator fun invoke(): R
}
