package com.company.app.presentation

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.company.app.data.repository.BaseRepository
import com.company.app.domain.usecase.*
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import java.io.File
import javax.inject.Inject
import kotlin.system.exitProcess

@HiltViewModel
class MainViewModel @Inject constructor(
    private val encryptMessageUseCase: EncryptMessageUseCase,
    private val calculateHashUseCase: CalculateHashUseCase,
    private val generatePasswordUseCase: GeneratePasswordUseCase,
    private val classicCipherUseCase: ClassicCipherUseCase,
    private val audioSteganographyUseCase: AudioSteganographyUseCase,
    private val imageSteganographyUseCase: ImageSteganographyUseCase,
    private val extractFromAudioUseCase: ExtractFromAudioUseCase,
    private val extractFromImageUseCase: ExtractFromImageUseCase
) : ViewModel() {

    private val _uiState = MutableStateFlow<BaseRepository.Resource<String>>(BaseRepository.Resource.Loading)
    val uiState: StateFlow<BaseRepository.Resource<String>> = _uiState

    fun encryptMessage(plainText: String, password: String) {
        viewModelScope.launch {
            _uiState.value = BaseRepository.Resource.Loading
            val params = EncryptMessageUseCase.Params(plainText, password)
            _uiState.value = encryptMessageUseCase(params)
        }
    }

    fun extractFromAudio(path: String) {
        viewModelScope.launch {
            _uiState.value = BaseRepository.Resource.Loading
            _uiState.value = extractFromAudioUseCase(path)
        }
    }

    fun extractFromImage(path: String) {
        viewModelScope.launch {
            _uiState.value = BaseRepository.Resource.Loading
            _uiState.value = extractFromImageUseCase(path)
        }
    }

    /**
     * Executes the Burn Bag Protocol based on selected options.
     */
    fun executeBurnProtocol(
        context: Context,
        deleteFiles: Boolean,
        clearData: Boolean,
        nukeCache: Boolean,
        forceClose: Boolean
    ) {
        viewModelScope.launch {
            if (nukeCache) {
                BaseRepository.GlobalCache.nuke()
            }

            if (deleteFiles) {
                // Delete temporary files created by the app
                context.cacheDir.deleteRecursively()
                context.filesDir.listFiles()?.forEach { it.deleteRecursively() }
            }

            if (clearData) {
                // Clear SharedPreferences/Datastore
                context.getSharedPreferences("veil_cipher_prefs", Context.MODE_PRIVATE)
                    .edit().clear().apply()
            }

            if (forceClose) {
                exitProcess(0)
            }
        }
    }
}
