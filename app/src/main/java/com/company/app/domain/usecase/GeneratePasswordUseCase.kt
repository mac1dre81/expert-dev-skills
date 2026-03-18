package com.company.app.domain.usecase

import java.security.SecureRandom

/**
 * UseCase for generating secure passwords.
 * Supports custom lengths and character types.
 */
class GeneratePasswordUseCase : BaseUseCase<GeneratePasswordUseCase.Params, String>() {
    
    data class Params(
        val length: Int = 16,
        val includeUpper: Boolean = true,
        val includeLower: Boolean = true,
        val includeNumbers: Boolean = true,
        val includeSymbols: Boolean = true
    )

    private val upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    private val lower = "abcdefghijklmnopqrstuvwxyz"
    private val numbers = "0123456789"
    private val symbols = "!@#$%^&*()-_=+[]{}|;:,.<>?"

    override suspend fun invoke(params: Params): String {
        val pool = StringBuilder().apply {
            if (params.includeUpper) append(upper)
            if (params.includeLower) append(lower)
            if (params.includeNumbers) append(numbers)
            if (params.includeSymbols) append(symbols)
        }.toString()

        if (pool.isEmpty()) return ""

        val random = SecureRandom()
        return (1..params.length)
            .map { pool[random.nextInt(pool.length)] }
            .joinToString("")
    }
}
