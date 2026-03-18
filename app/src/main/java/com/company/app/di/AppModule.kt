package com.company.app.di

import com.company.app.data.repository.CryptoRepositoryImpl
import com.company.app.domain.repository.CryptoRepository
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object AppModule {

    @Provides
    @Singleton
    fun provideCryptoRepository(): CryptoRepository {
        return CryptoRepositoryImpl()
    }
}
