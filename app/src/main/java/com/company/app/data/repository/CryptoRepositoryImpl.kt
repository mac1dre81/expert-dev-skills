package com.company.app.data.repository

import com.company.app.domain.repository.CryptoRepository
import java.security.SecureRandom
import java.util.Base64
import javax.crypto.Cipher
import javax.crypto.SecretKeyFactory
import javax.crypto.spec.GCMParameterSpec
import javax.crypto.spec.PBEKeySpec
import javax.crypto.spec.SecretKeySpec

/**
 * Implementation of CryptoRepository using AES-256-GCM and PBKDF2.
 * Matches the JS implementation: 100,000 iterations, SHA-256.
 */
class CryptoRepositoryImpl : BaseRepository(), CryptoRepository {

    private val algorithm = "AES/GCM/NoPadding"
    private val tagLength = 128
    private val ivLength = 12
    private val saltLength = 16
    private val iterations = 100000
    private val keyLength = 256

    override suspend fun encrypt(plainText: String, password: String): Resource<String> = safeApiCall {
        val salt = ByteArray(saltLength).apply { SecureRandom().nextBytes(this) }
        val iv = ByteArray(ivLength).apply { SecureRandom().nextBytes(this) }
        
        val key = deriveKey(password, salt)
        
        val cipher = Cipher.getInstance(algorithm)
        val spec = GCMParameterSpec(tagLength, iv)
        cipher.init(Cipher.ENCRYPT_MODE, key, spec)
        
        val cipherText = cipher.doFinal(plainText.toByteArray(Charsets.UTF_8))
        
        // Combine Salt + IV + CipherText for storage/transmission
        val combined = salt + iv + cipherText
        Base64.getEncoder().encodeToString(combined)
    }

    override suspend fun decrypt(cipherText: String, password: String): Resource<String> = safeApiCall {
        val combined = Base64.getDecoder().decode(cipherText)
        
        val salt = combined.sliceArray(0 until saltLength)
        val iv = combined.sliceArray(saltLength until saltLength + ivLength)
        val encrypted = combined.sliceArray(saltLength + ivLength until combined.size)
        
        val key = deriveKey(password, salt)
        
        val cipher = Cipher.getInstance(algorithm)
        val spec = GCMParameterSpec(tagLength, iv)
        cipher.init(Cipher.DECRYPT_MODE, key, spec)
        
        val decryptedBytes = cipher.doFinal(encrypted)
        String(decryptedBytes, Charsets.UTF_8)
    }

    override suspend fun hideInAudio(audioPath: String, message: String): Resource<String> = safeApiCall {
        "Audio steganography placeholder for $audioPath"
    }

    /**
     * PBKDF2 Key Derivation to match JS implementation.
     */
    private fun deriveKey(password: String, salt: ByteArray): SecretKeySpec {
        val factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256")
        val spec = PBEKeySpec(password.toCharArray(), salt, iterations, keyLength)
        val tmp = factory.generateSecret(spec)
        return SecretKeySpec(tmp.encoded, "AES")
    }
}
