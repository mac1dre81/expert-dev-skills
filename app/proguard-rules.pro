# Professional-grade security rules for VeilCipher

# 1. Full Obfuscation - Rename everything to single letters
-repackageclasses ''
-allowaccessmodification
-overloadaggressively

# 2. Forensic Protection - Reduce reverse engineering surface
# Keep source/line attributes (useful for crash diagnostics), but rename source
# filenames and suppress ProGuard/R8 notes and warnings to reduce metadata leaks.
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile
-dontnote
-dontwarn

# 3. Cryptography Protection
# Prevent R8 from optimizing out our SecureRandom calls
-keep class java.security.SecureRandom { *; }
-keep class javax.crypto.** { *; }

# 4. Hilt/Dagger Support (Required for Dependency Injection)
-keep class dagger.hilt.** { *; }
-keep @dagger.hilt.android.lifecycle.HiltViewModel class *
-keepclassmembers class * {
    @javax.inject.Inject <init>(...);
}

# 5. Biometric Support
-keep class androidx.biometric.** { *; }

# 6. Jetpack Compose Support
-keep class androidx.compose.runtime.** { *; }
-keep @androidx.compose.runtime.Composable class *
-keepclassmembers class * {
    @androidx.compose.runtime.Composable <methods>;
}

# 7. Domain Model Integrity
# Keep UseCases as they are the core logic entry points
-keep class com.company.app.domain.usecase.** { *; }
