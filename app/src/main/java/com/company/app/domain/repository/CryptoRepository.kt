package com.company.app.domain.repository

import com.company.app.data.repository.BaseRepository

/**
 * Interface for Cryptographic operations.
 * Defined in Domain layer to maintain abstraction.
 */
interface CryptoRepository {
    /**
     * Encrypts a plain text message using a password.
     */
    suspend fun encrypt(plainText: String, password: String): BaseRepository.Resource<String>

    /**
     * Decrypts a cipher text message using a password.
     */
    suspend fun decrypt(cipherText: String, password: String): BaseRepository.Resource<String>

    /**
     * Hides an encrypted message inside an audio file.
     */
    suspend fun hideInAudio(audioPath: String, message: String): BaseRepository.Resource<String>
}
