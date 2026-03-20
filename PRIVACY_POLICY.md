# VeilCipher Privacy Policy

**Effective date:** 2026-03-20

This Privacy Policy explains how VeilCipher (“we”, “us”, or “our”) handles information when you use the browser-based application and Android module included in this repository.

## 1. Overview

VeilCipher is designed to run primarily on your device/browser. It performs encryption and steganography locally, without requiring user accounts.

However, some features may interact with third-party services (for example, QR code generation in the browser app). When such third-party interactions occur, we describe them below.

## 2. Scope of this policy

This policy covers:

1. The web/browser application located under `veilcipher/`.
2. The Android application under `app/`.

If you access any features outside this repository (including third-party services linked from or used by the app), those services may have their own privacy practices.

## 3. What we collect

### 3.1 Information you provide

Depending on the feature you use, VeilCipher may process:

1. Messages or secret content you enter (e.g., text to encrypt/hide).
2. Files you select (e.g., images, audio, or other carrier content).
3. Passwords you enter to encrypt/decrypt.

### 3.2 Device and browser details (for local security monitoring)

The browser app includes an Operational Security (OpSec) component that monitors local activity and may collect information **in-memory for display/alerts**, such as:

1. Your browser user agent.
2. The current page URL.
3. Details about outbound requests detected in the browser (e.g., request URLs).

This local monitoring is used to warn you about potential security-relevant events in your current session. It does not create a server-side account or automatically transmit these alerts to VeilCipher servers.

### 3.3 Android permissions and on-device storage

The Android module requests permissions to access user files so it can read carrier content and write outputs on the device.

The Android module also uses biometric authentication (via the device’s built-in biometric system) to control access to the app’s screens.

VeilCipher may store app settings on the device (for example, shared preferences). The “Burn Bag” protocol includes controls to clear on-device data.

### 3.4 QR code generation (third-party transmission in the browser app)

The browser app can generate downloadable QR codes by calling a third-party QR code generation API:

- `https://api.qrserver.com/v1/create-qr-code/`

When you use this feature, the content you request to encode (e.g., decoded text) is sent to that third-party service as part of the request.

We do not control how that third party collects, uses, or retains information. Those practices are governed by the third party’s privacy policy and terms.

## 4. How we use information

We use the information processed in VeilCipher to:

1. Provide encryption/decryption and steganography features locally in your browser/device.
2. Provide local OpSec/security alerts during your session (browser).
3. Enforce access control in the Android module using biometric authentication.
4. Support the “Burn Bag” protocol so you can delete temporary files and clear local app settings when desired.

## 5. Sharing and disclosure

### 5.1 Third-party service usage (browser QR feature)

When you generate QR codes using the browser feature described above, your encoded content is transmitted to the QR code generation service (`api.qrserver.com`).

### 5.2 No other intentional sharing

Except for the third-party QR feature and any third-party services you may choose to use indirectly, VeilCipher does not intentionally sell, rent, or share personal information for advertising or marketing purposes.

## 6. Data retention

1. **Browser app:** Sensitive inputs (messages, encryption keys, carrier data) are processed in your browser. OpSec alerts are kept in memory for the current session. Downloaded outputs are saved by your browser to your chosen location.
2. **Android app:** Temporary files and app settings may exist on-device depending on your actions. You can use the “Burn Bag” protocol to delete cached files and clear app settings.

If you clear your browser/app data, the locally stored information will typically be removed.

## 7. Security

VeilCipher uses client-side cryptography to protect confidentiality during encryption and steganography operations. Additionally, the Android “Burn Bag” protocol supports deletion/clearing of sensitive local artifacts.

No security measures are perfect. Please use strong passwords and follow safe operational practices.

## 8. Your rights and choices

Depending on your jurisdiction, you may have rights related to access to, correction of, deletion of, or portability of information.

For this project, practical controls include:

1. **Browser:** Clear your browser storage and session data; do not use features that send data to third parties unless you understand the implications.
2. **Android:** Use the “Burn Bag” protocol to delete temporary files and clear on-device settings.

## 9. Children’s privacy

VeilCipher is not directed to children, and we do not knowingly collect personal information from children.

## 10. International transfers

If you use the browser QR code feature, your encoded content may be processed by servers located outside your country.

## 11. Contact

If you have questions about this Privacy Policy, contact us by opening an issue in this repository on GitHub.

