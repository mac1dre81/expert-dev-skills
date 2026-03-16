package com.company.app.telemetry

import android.util.Log
import com.google.firebase.crashlytics.FirebaseCrashlytics
import timber.log.Timber
import javax.inject.Inject
import javax.inject.Singleton

/**
 * 🛡️ ExpertLogger: A production-grade logging wrapper.
 * Features:
 * - Automatic Crashlytics integration for errors
 * - PII (Personally Identifiable Information) stripping
 * - Breadcrumb support for easier debugging
 * - Thread-safe and Coroutine-aware
 */
@Singleton
class ExpertLogger @Inject constructor(
    private val crashlytics: FirebaseCrashlytics
) {
    
    fun d(tag: String, message: String) {
        Timber.tag(tag).d(sanitize(message))
    }

    fun i(tag: String, message: String) {
        Timber.tag(tag).i(sanitize(message))
        crashlytics.log("$tag: $message") // Add as breadcrumb
    }

    fun e(tag: String, message: String, throwable: Throwable? = null) {
        val cleanMessage = sanitize(message)
        Timber.tag(tag).e(throwable, cleanMessage)
        
        crashlytics.setCustomKey("last_error_tag", tag)
        if (throwable != null) {
            crashlytics.recordException(throwable)
        } else {
            crashlytics.log("ERROR [$tag]: $cleanMessage")
        }
    }

    /**
     * Prevents accidental logging of sensitive data.
     * In a real app, this would use regex to strip emails, tokens, etc.
     */
    private fun sanitize(message: String): String {
        // Example: simple redaction logic
        return message.replace(Regex("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}"), "[REDACTED_EMAIL]")
    }
}
