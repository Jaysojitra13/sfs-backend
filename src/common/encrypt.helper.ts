import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionHelper {
  encryptBuffer(buffer, tIv = null) {
    // random key
    const iv = tIv ? tIv : crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(
      process.env.CRYPTO_ALGORITHM,
      Buffer.from(process.env.MASTER_ENCRYPTION_KEY, 'hex'),
      iv,
    );
    let encrypted = cipher.update(buffer, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return { encrypted, iv };
  }

  decryptBuffer(buffer, iv) {
    const decipher = crypto.createDecipheriv(
      process.env.CRYPTO_ALGORITHM,
      Buffer.from(process.env.MASTER_ENCRYPTION_KEY, 'hex'),
      iv,
    );
    let decrypted = decipher.update(buffer, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
  }
}
