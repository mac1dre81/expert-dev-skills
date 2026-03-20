package com.company.app.domain.usecase

import com.company.app.data.repository.BaseRepository
import com.company.app.domain.repository.CryptoRepository

/**
 * UseCase for extracting hidden messages from audio files.
 */
class ExtractFromAudioUseCase(
    private val repository: CryptoRepository
) : BaseUseCase<String, BaseRepository.Resource<String>>() {
    
    override suspend fun invoke(params: String): BaseRepository.Resource<String> {
        return repository.extractFromAudio(params)
    }
}
