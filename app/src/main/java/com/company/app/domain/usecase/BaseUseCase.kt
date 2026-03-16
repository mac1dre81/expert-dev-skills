package com.company.app.domain.usecase

/**
 * 🏗️ Base UseCase for expert-grade business logic.
 * Features:
 * - Separation of concerns (Presentation <-> Data)
 * - Single-responsibility execution
 */
abstract class BaseUseCase<in P, out R> {
    abstract suspend fun execute(params: P): R
}
