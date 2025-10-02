// Type definitions for xml-encryption
// Based on xml-encryption v3.1.0 library structure

declare module "xml-encryption" {
  interface DecryptOptions {
    key: string
    disallowDecryptionWithInsecureAlgorithm?: boolean
    warnInsecureAlgorithm?: boolean
  }

  interface EncryptOptions {
    rsa_pub: string
    pem: string | Buffer
    keyEncryptionAlgorithm?: string
    keyEncryptionDigest?: string
  }

  type DecryptCallback = (err: Error | null, result?: string) => void
  type EncryptCallback = (err: Error | null, result?: string) => void

  export function decrypt(xml: string, options: DecryptOptions, callback: DecryptCallback): void
  export function encrypt(xml: string, options: EncryptOptions, callback: EncryptCallback): void
  export function encryptKeyInfo(
    symmetricKey: string | Buffer,
    options: EncryptOptions,
    callback: EncryptCallback
  ): void
  export function decryptKeyInfo(doc: unknown, options: DecryptOptions): string
}