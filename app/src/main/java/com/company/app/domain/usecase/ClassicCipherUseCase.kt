package com.company.app.domain.usecase

/**
 * UseCase for traditional cipher algorithms.
 * Supports Caesar, ROT13, Vigenere, etc.
 */
class ClassicCipherUseCase : BaseUseCase<ClassicCipherUseCase.Params, String>() {
    
    enum class Type { 
        CAESAR, 
        ROT13, 
        VIGENERE, 
        ATBASH, 
        XOR 
    }

    data class Params(
        val text: String,
        val type: Type,
        val key: String = ""
    )

    override suspend fun invoke(params: Params): String {
        return when (params.type) {
            Type.ROT13 -> rotate(params.text, 13)
            Type.CAESAR -> rotate(params.text, params.key.toIntOrNull() ?: 0)
            Type.ATBASH -> atbash(params.text)
            Type.VIGENERE -> vigenere(params.text, params.key, encrypt = true)
            Type.XOR -> xor(params.text, params.key)
        }
    }

    private fun rotate(text: String, shift: Int): String {
        val s = shift % 26
        return text.map { char ->
            when {
                char.isUpperCase() -> ('A'.code + (char - 'A' + s + 26) % 26).toChar()
                char.isLowerCase() -> ('a'.code + (char - 'a' + s + 26) % 26).toChar()
                else -> char
            }
        }.joinToString("")
    }

    private fun atbash(text: String): String {
        return text.map { char ->
            when {
                char.isUpperCase() -> ('Z'.code - (char - 'A')).toChar()
                char.isLowerCase() -> ('z'.code - (char - 'a')).toChar()
                else -> char
            }
        }.joinToString("")
    }

    private fun vigenere(text: String, key: String, encrypt: Boolean): String {
        if (key.isEmpty()) return text
        var keyIndex = 0
        val k = key.uppercase()
        
        return text.map { char ->
            if (char.isLetter()) {
                val isUpper = char.isUpperCase()
                val base = if (isUpper) 'A' else 'a'
                val shift = k[keyIndex % k.length] - 'A'
                val actualShift = if (encrypt) shift else 26 - shift
                
                keyIndex++
                (base.code + (char.uppercaseChar() - 'A' + actualShift) % 26).toChar().let {
                    if (isUpper) it else it.lowercaseChar()
                }
            } else char
        }.joinToString("")
    }

    private fun xor(text: String, key: String): String {
        if (key.isEmpty()) return text
        return text.mapIndexed { index, char ->
            (char.code xor key[index % key.length].code).toChar()
        }.joinToString("")
    }
}
