"use server"

import {revalidateTag} from "next/cache"

export async function clearCache(formData: FormData) {
  try {
    const clearMenu = formData.get("clearMenu") === "on"
    const clearGlobalElements = formData.get("clearGlobalElements") === "on"

    const paths = formData.get("path") as string

    const cleared = []

    if (clearMenu) {
      revalidateTag("menu:main", "max")
      cleared.push("main menu")
    }
    if (clearGlobalElements) {
      revalidateTag("config-pages", "max")
      cleared.push("global footer")
    }

    if (paths) {
      paths
        .trim()
        .split(" ")
        .map(path => {
          revalidateTag(`paths:/${path.trim()}`, "max")
          revalidateTag(path.trim(), "max")
          cleared.push(path)
        })
    }

    if (cleared.length > 0) {
      return {
        success: true,
        message: "Successfully cleared " + cleared.join(", ") + ".",
      }
    }
    return {
      success: false,
      message: "Please choose an element to clear cache or enter a path.",
    }
  } catch (error) {
    console.error("Cache clear error:", error)
    return {
      success: false,
      message: "Failed to clear cache. Check server logs for details.",
    }
  }
}
