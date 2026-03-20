package com.company.app.domain.usecase

import com.company.app.data.repository.BaseRepository
import com.company.app.domain.repository.CryptoRepository

/**
 * UseCase for extracting hidden messages from image files (PNG).
 */
class ExtractFromImageUseCase(
    private val repository: CryptoRepository
) : BaseUseCase<String, BaseRepository.Resource<String>>() {
    
    override suspend fun invoke(params: String): BaseRepository.Resource<String> {
        return repository.extractFromImage(params)
    }
}
