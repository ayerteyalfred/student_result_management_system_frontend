import CryptoJS from 'crypto-js'

const crypto = {
  //Encrypt data
  encryptData(data, key) {
    let encryptText = CryptoJS.AES.encrypt(data, key).toString()
    return encryptText
  },

  //Decrypt data
  decryptData(data, key) {
    let bytes = CryptoJS.AES.decrypt(data, key)
    let originalText = bytes.toString(CryptoJS.enc.Utf8)
    return originalText
  },

  secretKey() {
    return '07cd0070-ea29-4650-a31b-df8d84837dc0'
  }
}

export default crypto
