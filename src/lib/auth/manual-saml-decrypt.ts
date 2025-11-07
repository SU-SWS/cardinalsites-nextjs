// Manual SAML decryption utility to work around passport-saml encrypted assertion issues
// <reference path="../../@types/xml-encryption/index.d.ts" />
import * as xmlenc from "xml-encryption"
import {DOMParser} from "@xmldom/xmldom"
import {UserProfile} from "@lib/auth/jwt-auth"

export const manuallyDecryptSAMLResponse = async (
  encodedResponse: string,
  privateKeyPem: string
): Promise<string | null> => {
  try {
    // Decode the base64 SAML response
    const xmlResponse = Buffer.from(encodedResponse, "base64").toString("utf8")

    // Parse XML
    const parser = new DOMParser()
    const doc = parser.parseFromString(xmlResponse, "text/xml")

    // Find encrypted assertions
    const encryptedAssertions = doc.getElementsByTagName("saml2:EncryptedAssertion")

    if (encryptedAssertions.length === 0) {
      return xmlResponse
    }

    // Try to decrypt using xml-encryption directly
    return new Promise((resolve, _reject) => {
      // Create clean options object for xml-encryption
      const decryptOptions = {
        key: privateKeyPem,
        // Add common options that xml-encryption might expect
        disallowDecryptionWithInsecureAlgorithm: false,
        warnInsecureAlgorithm: false,
      }

      xmlenc.decrypt(xmlResponse, decryptOptions, (err: Error | null, result?: string) => {
        if (err) {
          console.error("❌ Manual decryption failed:", err.message)
          console.error("❌ Full error:", err)
          resolve(null)
        } else {
          resolve(result || null)
        }
      })
    })
  } catch (error) {
    console.error("❌ Manual decryption error:", error instanceof Error ? error.message : error)
    console.error("❌ Full error:", error)
    return null
  }
}

export const extractProfileFromDecryptedXML = (decryptedXML: string): UserProfile | null => {
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(decryptedXML, "text/xml")

    // Get attributes
    const attributes = doc.getElementsByTagName("saml2:Attribute")
    const profileAttributes: Map<string, string[]> = new Map([])

    for (let i = 0; i < attributes.length; i++) {
      const attr = attributes[i]
      const name = attr.getAttribute("FriendlyName") || attr.getAttribute("Name")
      const values = attr.getElementsByTagName("saml2:AttributeValue")

      if (!name || values.length === 0) continue

      const attributeValues: string[] = []

      for (let j = 0; j < values.length; j++) {
        const textContent = values[j]?.textContent
        if (textContent !== null && textContent !== undefined) {
          attributeValues.push(textContent)
        }
      }
      if (attributeValues.length > 0) {
        profileAttributes.set(name, attributeValues)
      }
    }

    // Extract basic profile information
    return {
      uid: profileAttributes.get("uid")?.[0] || "",
      mail: profileAttributes.get("mail")?.[0] || "",
      eduPersonPrincipalName: profileAttributes.get("eduPersonPrincipalName")?.[0] || "",
      displayName: profileAttributes.get("displayName")?.[0] || "",
      eduPersonAffiliation: profileAttributes.get("eduPersonAffiliation"),
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ Profile extraction error:", error.message)
    }
    return null
  }
}
