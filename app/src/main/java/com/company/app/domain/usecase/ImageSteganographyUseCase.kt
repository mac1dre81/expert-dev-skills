package com.company.app.domain.usecase

import com.company.app.data.repository.BaseRepository
import com.company.app.domain.repository.CryptoRepository

/**
 * UseCase for hiding encrypted messages in image files (PNG, JPG).
 */
class ImageSteganographyUseCase(
    private val repository: CryptoRepository
) : BaseUseCase<ImageSteganographyUseCase.Params, BaseRepository.Resource<String>>() {
    
    data class Params(val imagePath: String, val message: String)

    override suspend fun invoke(params: Params): BaseRepository.Resource<String> {
        return repository.hideInImage(params.imagePath, params.message)
    }
}
