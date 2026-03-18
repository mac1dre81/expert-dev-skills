package com.company.app.domain.usecase

import java.security.MessageDigest

/**
 * UseCase for calculating hashes of text.
 * Supports algorithms like SHA-256, MD5, etc.
 */
class CalculateHashUseCase : BaseUseCase<CalculateHashUseCase.Params, String>() {
    
    data class Params(val input: String, val algorithm: String = "SHA-256")

    override suspend fun invoke(params: Params): String {
        val digest = MessageDigest.getInstance(params.algorithm)
        val hashBytes = digest.digest(params.input.toByteArray(Charsets.UTF_8))
        return hashBytes.joinToString("") { "%02x".format(it) }
    }
}
