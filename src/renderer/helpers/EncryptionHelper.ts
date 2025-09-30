import nodeCrypto from 'crypto'

export class EncryptionHelper {
  private static arrayBufferToHex(buffer: any) {
    return [...new Uint8Array(buffer)].map(byte => byte.toString(16).padStart(2, '0')).join('')
  }

  private static hexToArrayBuffer(hex: string) {
    const bytes = new Uint8Array(hex.length / 2)
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substr(i, 2), 16)
    }
    return bytes.buffer
  }

  static async encryptedPassword(password: string) {
    const encoder = new TextEncoder()
    const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(password), { name: 'PBKDF2' }, false, [
      'deriveKey',
    ])

    const cryptoKey = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode('salt'),
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-CBC', length: 256 },
      true,
      ['encrypt', 'decrypt']
    )

    const keyBytes = await crypto.subtle.exportKey('raw', cryptoKey)
    return this.arrayBufferToHex(keyBytes)
  }

  static async encrypt(value: string, encryptedPassword?: string) {
    if (!encryptedPassword) {
      throw new Error('No password provided for encryption')
    }

    const keyArrayBytes = this.hexToArrayBuffer(encryptedPassword)
    const cryptoKey = await crypto.subtle.importKey('raw', keyArrayBytes, { name: 'AES-CBC', length: 256 }, false, [
      'encrypt',
      'decrypt',
    ])

    const encoder = new TextEncoder()

    const iv = crypto.getRandomValues(new Uint8Array(16))
    const encrypted = await crypto.subtle.encrypt({ name: 'AES-CBC', iv }, cryptoKey, encoder.encode(value))

    return this.arrayBufferToHex(iv) + this.arrayBufferToHex(encrypted)
  }

  static async decrypt(encryptedValue?: string, encryptedPassword?: string) {
    if (!encryptedPassword) {
      throw new Error('No password provided for encryption')
    }

    if (!encryptedValue) {
      throw new Error('No value provided for decryption')
    }

    const keyArrayBytes = this.hexToArrayBuffer(encryptedPassword)
    const cryptoKey = await crypto.subtle.importKey('raw', keyArrayBytes, { name: 'AES-CBC', length: 256 }, false, [
      'encrypt',
      'decrypt',
    ])

    const decoder = new TextDecoder()

    const iv = encryptedValue.slice(0, 32)
    const encrypted = encryptedValue.slice(32)

    const ivArray = this.hexToArrayBuffer(iv)
    const encryptedArray = this.hexToArrayBuffer(encrypted)

    const decrypted = await crypto.subtle.decrypt({ name: 'AES-CBC', iv: ivArray }, cryptoKey, encryptedArray)

    return decoder.decode(decrypted)
  }

  static encryptBackupOrMigrate(value: string, secret: string) {
    const iv = nodeCrypto.randomBytes(16)

    const key = nodeCrypto.pbkdf2Sync(secret, 'salt', 100000, 24, 'sha256')
    const cipher = nodeCrypto.createCipheriv('aes-192-cbc', key, iv)
    const encrypted = cipher.update(value, 'utf8', 'hex') + cipher.final('hex')
    return iv.toString('hex') + encrypted
  }

  static decryptBackupOrMigrate(encryptedData: string, password: string) {
    const iv = Buffer.from(encryptedData.slice(0, 32), 'hex')
    const key = nodeCrypto.pbkdf2Sync(password, 'salt', 100000, 24, 'sha256')
    const decipher = nodeCrypto.createDecipheriv(
      'aes-192-cbc',
      key as nodeCrypto.CipherKey,
      iv as nodeCrypto.BinaryLike
    )

    return decipher.update(encryptedData.slice(32), 'hex', 'utf8') + decipher.final('utf8')
  }
}
