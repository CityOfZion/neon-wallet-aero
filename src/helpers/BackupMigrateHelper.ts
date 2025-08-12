import crypto from 'crypto'

export class BackupMigrateHelper {
  static decrypt(encryptedData: string, password: string) {
    const iv = Buffer.from(encryptedData.slice(0, 32), 'hex')
    const key = crypto.pbkdf2Sync(password, 'salt', 100000, 24, 'sha256')
    const decipher = crypto.createDecipheriv('aes-192-cbc', key as crypto.CipherKey, iv as crypto.BinaryLike)

    return decipher.update(encryptedData.slice(32), 'hex', 'utf8') + decipher.final('utf8')
  }
}
