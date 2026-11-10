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

    // Space separated paths and/or cache tags. A path may be entered with or without its leading
    // slash (`/about` or `about`); a value without one is also cleared as a raw cache tag, e.g.
    // `views:stanford_news`. Repeated spaces must not produce empty values, which would clear `/`.
    const values = (paths || "").split(/\s+/).filter(value => !!value)
    values.forEach(value => {
      revalidateTag(`paths:/${value.replace(/^\/+/, "")}`, "max")
      if (!value.startsWith("/")) revalidateTag(value, "max")
      cleared.push(value)
    })

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
