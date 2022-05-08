function encryptText(text, password) {
    return CryptoJS.AES.encrypt(text, password).toString();
}

function decryptText(text, password) {
    const decryptedBytes = CryptoJS.AES.decrypt(text, password);
    return decryptedBytes.toString(CryptoJS.enc.Utf8);
}
