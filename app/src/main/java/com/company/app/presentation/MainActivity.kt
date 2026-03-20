package com.company.app.presentation

import android.Manifest
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.core.content.ContextCompat
import androidx.fragment.app.FragmentActivity
import androidx.lifecycle.viewmodel.compose.viewModel
import com.company.app.data.repository.BaseRepository
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.delay

@AndroidEntryPoint
class MainActivity : FragmentActivity() { // FragmentActivity is required for BiometricPrompt
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            VeilCipherTheme {
                MainScreenWithBiometrics()
            }
        }
    }
}

@Composable
fun MainScreenWithBiometrics(viewModel: MainViewModel = viewModel()) {
    var isAuthenticated by remember { mutableStateOf(false) }
    var authError by remember { mutableStateOf<String?>(null) }
    val context = LocalContext.current as FragmentActivity

    LaunchedEffect(Unit) {
        val executor = ContextCompat.getMainExecutor(context)
        val biometricPrompt = BiometricPrompt(context, executor,
            object : BiometricPrompt.AuthenticationCallback() {
                override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                    isAuthenticated = true
                }
                override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
                    authError = errString.toString()
                }
            })

        val promptInfo = BiometricPrompt.PromptInfo.Builder()
            .setTitle("VeilCipher Access")
            .setSubtitle("Authenticate to access your secure vault")
            .setNegativeButtonText("Exit")
            .build()

        biometricPrompt.authenticate(promptInfo)
    }

    if (isAuthenticated) {
        MainScreen(viewModel)
    } else {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Icon(Icons.Default.Lock, contentDescription = null, modifier = Modifier.size(64.dp), tint = Color.Gray)
                Spacer(modifier = Modifier.height(16.dp))
                Text(authError ?: "Locked")
                if (authError != null) {
                    Button(onClick = { context.recreate() }) { Text("Retry") }
                }
            }
        }
    }
}

@Composable
fun MainScreen(viewModel: MainViewModel) {
    var selectedTab by remember { mutableIntStateOf(0) }
    var showBurnEffect by remember { mutableStateOf(false) }

    val permissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { }

    LaunchedEffect(Unit) {
        permissionLauncher.launch(
            arrayOf(
                Manifest.permission.READ_EXTERNAL_STORAGE,
                Manifest.permission.WRITE_EXTERNAL_STORAGE
            )
        )
    }

    Scaffold(
        bottomBar = {
            NavigationBar {
                NavigationBarItem(
                    selected = selectedTab == 0,
                    onClick = { selectedTab = 0 },
                    icon = { Icon(Icons.Default.Lock, contentDescription = "Security") },
                    label = { Text("Security") }
                )
                NavigationBarItem(
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1 },
                    icon = { Icon(Icons.Default.Delete, contentDescription = "Burn") },
                    label = { Text("Burn") }
                )
            }
        }
    ) { padding ->
        Box(modifier = Modifier.padding(padding)) {
            when (selectedTab) {
                0 -> EncryptionScreen(viewModel)
                1 -> BurnBagScreen(viewModel)
            }

            if (showBurnEffect) {
                FireAnimation(onFinished = { showBurnEffect = false })
            }
        }
    }
}

@Composable
fun BurnBagScreen(viewModel: MainViewModel) {
    // ... logic from previous step
    val context = LocalContext.current
    var deleteFiles by remember { mutableStateOf(true) }
    var clearData by remember { mutableStateOf(true) }
    var nukeCache by remember { mutableStateOf(true) }
    var forceClose by remember { mutableStateOf(true) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text("Burn Bag Protocol", style = MaterialTheme.typography.headlineMedium, color = Color.Red)
        Text("Select the layers of destruction for this device:", style = MaterialTheme.typography.bodyMedium)

        BurnOption(
            title = "Delete all temporary files",
            description = "Wipes any encrypted/decrypted files stored in the app's cache. Use this to prevent forensic recovery of hidden messages.",
            checked = deleteFiles,
            onCheckedChange = { deleteFiles = it }
        )

        BurnOption(
            title = "Clear Shared Preferences",
            description = "Resets all app settings and saved states. Effectively returns the app to a fresh installation state.",
            checked = clearData,
            onCheckedChange = { clearData = it }
        )

        BurnOption(
            title = "Nuke In-Memory Cache",
            description = "Instantly wipes all sensitive data currently held in the device's RAM (BaseRepository Cache).",
            checked = nukeCache,
            onCheckedChange = { nukeCache = it }
        )

        BurnOption(
            title = "Force-close the app",
            description = "Immediately terminates the application process after the wipe is complete to clear the task switcher.",
            checked = forceClose,
            onCheckedChange = { forceClose = it }
        )

        Spacer(modifier = Modifier.weight(1f))

        Button(
            onClick = { viewModel.executeBurnProtocol(context, deleteFiles, clearData, nukeCache, forceClose) },
            modifier = Modifier.fillMaxWidth(),
            colors = ButtonDefaults.buttonColors(containerColor = Color.Red)
        ) {
            Text("ACTIVATE PROTOCOL", color = Color.White)
        }
    }
}

@Composable
fun BurnOption(title: String, description: String, checked: Boolean, onCheckedChange: (Boolean) -> Unit) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Checkbox(checked = checked, onCheckedChange = onCheckedChange)
        Column(modifier = Modifier.padding(start = 8.dp)) {
            Text(title, style = MaterialTheme.typography.titleMedium)
            Text(description, style = MaterialTheme.typography.bodySmall)
        }
    }
}

@Composable
fun FireAnimation(onFinished: () -> Unit) {
    val infiniteTransition = rememberInfiniteTransition()
    val yOffset by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 1000f,
        animationSpec = infiniteRepeatable(tween(2000, easing = LinearEasing))
    )

    LaunchedEffect(Unit) {
        delay(3000)
        onFinished()
    }

    Canvas(modifier = Modifier.fillMaxSize().background(Color.Black.copy(alpha = 0.8f))) {
        val width = size.width
        val height = size.height
        for (i in 0..15) {
            val xPos = (width / 15) * i
            val flameHeight = (height * 0.8f) + (Math.sin(yOffset.toDouble() / 100 + i).toFloat() * 100)
            val path = Path().apply {
                moveTo(xPos, height)
                quadraticBezierTo(xPos + 50, height - flameHeight / 2, xPos, height - flameHeight)
                quadraticBezierTo(xPos - 50, height - flameHeight / 2, xPos, height)
            }
            drawPath(
                path = path,
                brush = Brush.verticalGradient(
                    colors = listOf(Color.Transparent, Color(0xFFFF4500), Color.Yellow),
                    startY = height - flameHeight,
                    endY = height
                )
            )
        }
    }
}

@Composable
fun EncryptionScreen(viewModel: MainViewModel) {
    // Shared encryption UI logic
    Text("Encryption Screen")
}

@Composable
fun VeilCipherTheme(content: @Composable () -> Unit) {
    MaterialTheme(content = content)
}
