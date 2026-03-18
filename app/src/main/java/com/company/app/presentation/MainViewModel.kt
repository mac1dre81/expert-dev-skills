package com.company.app.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.company.app.data.repository.BaseRepository
import com.company.app.domain.usecase.*
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class MainViewModel @Inject constructor(
    private val encryptMessageUseCase: EncryptMessageUseCase,
    private val calculateHashUseCase: CalculateHashUseCase,
    private val generatePasswordUseCase: GeneratePasswordUseCase,
    private val classicCipherUseCase: ClassicCipherUseCase,
    private val audioSteganographyUseCase: AudioSteganographyUseCase,
    private val imageSteganographyUseCase: ImageSteganographyUseCase
) : ViewModel() {

    private val _encryptionResult = MutableStateFlow<BaseRepository.Resource<String>>(BaseRepository.Resource.Loading)
    val encryptionResult: StateFlow<BaseRepository.Resource<String>> = _encryptionResult

    fun encryptMessage(plainText: String, password: String) {
        viewModelScope.launch {
            val params = EncryptMessageUseCase.Params(plainText, password)
            val result = encryptMessageUseCase(params)
            _encryptionResult.value = result
        }
    }

    // Additional methods for other use cases can be added here
}
