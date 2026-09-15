/**
 * Loaders for the optional SAML packages.
 *
 * `passport-saml`, `xml-encryption` and `@xmldom/xmldom` are declared as `optionalDependencies`
 * because only sites that serve authenticated traffic need them. They are also listed in
 * `serverExternalPackages` (see next.config.ts) so Next.js resolves them with a runtime `require`
 * instead of bundling them, which keeps the build working on sites that install without them.
 *
 * Import these loaders rather than the packages directly — a static top-level import would make
 * the packages mandatory again.
 */

/** Thrown when a SAML package is required by a request but is not installed. */
export class SamlUnavailableError extends Error {
  constructor(packageName: string) {
    super(`${packageName} is not installed. Add the optional SAML dependencies to enable authenticated traffic.`)
    this.name = "SamlUnavailableError"
  }
}

/**
 * Loads the `SAML` class from `passport-saml`.
 *
 * @returns The `SAML` constructor.
 * @throws {SamlUnavailableError} When `passport-saml` is not installed.
 */
export const loadSaml = async () => {
  try {
    return (await import("passport-saml")).SAML
  } catch {
    throw new SamlUnavailableError("passport-saml")
  }
}

/**
 * Loads the `xml-encryption` module used to decrypt SAML assertions.
 *
 * @returns The `xml-encryption` module namespace.
 * @throws {SamlUnavailableError} When `xml-encryption` is not installed.
 */
export const loadXmlEncryption = async () => {
  try {
    return await import("xml-encryption")
  } catch {
    throw new SamlUnavailableError("xml-encryption")
  }
}

/**
 * Loads the `DOMParser` implementation used to read SAML XML.
 *
 * @returns The `DOMParser` constructor from `@xmldom/xmldom`.
 * @throws {SamlUnavailableError} When `@xmldom/xmldom` is not installed.
 */
export const loadDomParser = async () => {
  try {
    return (await import("@xmldom/xmldom")).DOMParser
  } catch {
    throw new SamlUnavailableError("@xmldom/xmldom")
  }
}
