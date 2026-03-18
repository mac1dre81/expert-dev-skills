package com.company.app.domain.usecase

import com.company.app.data.repository.BaseRepository
import com.company.app.domain.repository.CryptoRepository

/**
 * UseCase for hiding encrypted messages in audio files.
 */
class AudioSteganographyUseCase(
    private val repository: CryptoRepository
) : BaseUseCase<AudioSteganographyUseCase.Params, BaseRepository.Resource<String>>() {
    
    data class Params(val audioPath: String, val message: String)

    override suspend fun invoke(params: Params): BaseRepository.Resource<String> {
        return repository.hideInAudio(params.audioPath, params.message)
    }
}
