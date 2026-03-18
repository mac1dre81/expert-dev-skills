package com.company.app.domain.usecase

import com.company.app.data.repository.BaseRepository
import com.company.app.domain.repository.CryptoRepository

/**
 * Encrypts a message with password validation and error handling.
 */
class EncryptMessageUseCase(
    private val cryptoRepository: CryptoRepository
) : ValidatedUseCase<EncryptMessageUseCase.Params, BaseRepository.Resource<String>>() {

    data class Params(val plainText: String, val password: String)

    /**
     * Business rules for validation.
     * Returns error message if invalid, null if valid.
     */
    override fun validate(params: Params): String? = when {
        params.plainText.isBlank() -> "Message cannot be empty"
        params.password.isBlank() -> "Password cannot be empty"
        params.password.length < 8 -> "Password must be at least 8 characters"
        else -> null
    }

    /**
     * Executes the encryption logic.
     */
    override suspend fun doWork(params: Params): BaseRepository.Resource<String> {
        return cryptoRepository.encrypt(params.plainText, params.password)
    }
}
