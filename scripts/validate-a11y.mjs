// Runs axe-core against every page `next build` prerendered, in a real Chrome driven over Selenium. Every page is checked
// and all violations are reported before the process exits non-zero, so one run shows everything that needs fixing.
//
// Environment:
//   A11Y_BASE_URL  Where the browser reaches the running Next server. Default http://localhost:3000
//   SELENIUM_URL   Selenium WebDriver server, ie the selenium/standalone-chrome service. Default http://localhost:4444
//   A11Y_REPORT    JSON report output path. Default a11y-report.json
import {writeFileSync} from "node:fs"
import {Builder} from "selenium-webdriver"
import chrome from "selenium-webdriver/chrome.js"
import AxeBuilder from "@axe-core/webdriverjs"
import {BUILD_DIR, getPrerenderedRoutes} from "./prerendered-pages.mjs"

const BASE_URL = (process.env.A11Y_BASE_URL || "http://localhost:3000").replace(/\/$/, "")
const SELENIUM_URL = process.env.SELENIUM_URL || "http://localhost:4444"
const REPORT_PATH = process.env.A11Y_REPORT || "a11y-report.json"
const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]
const PAGE_TIMEOUT = 30_000
// Content the codebase can't fix: author-entered WYSIWYG HTML, and third party oembed iframes. Axe skips these elements
// and everything inside them.
const EXCLUDE_SELECTORS = [".wysiwyg", ".oembed"]

// Routes behind a login. In the browser they redirect to the SAML or basic auth prompt, not to the page itself.
const SKIP_ROUTES = ["/user", "/system/cache-clear"]

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

// The server HTML is not what users end up with: client components re-render after hydration (ie the main menu swaps
// its mobile <dialog> for a desktop <div> once it knows the window width). Wait until the DOM has had no mutations for
// SETTLE_QUIET ms, so axe checks the hydrated page. Give up after SETTLE_MAX ms in case something animates forever.
const SETTLE_QUIET = 1000
const SETTLE_MAX = 10_000
const waitForSettledDom = driver =>
  driver.executeAsyncScript(
    (quiet, max, done) => {
      let timer
      const finish = () => {
        observer.disconnect()
        clearTimeout(timer)
        clearTimeout(cap)
        done()
      }
      const observer = new MutationObserver(() => {
        clearTimeout(timer)
        timer = setTimeout(finish, quiet)
      })
      observer.observe(document.documentElement, {
        subtree: true,
        childList: true,
        attributes: true,
        characterData: true,
      })
      timer = setTimeout(finish, quiet)
      const cap = setTimeout(finish, max)
    },
    SETTLE_QUIET,
    SETTLE_MAX
  )

/**
 * Retry `fn` until it resolves or `timeout` ms pass. Services in CI can take a few seconds to accept connections.
 */
const retry = async (label, fn, timeout = 90_000) => {
  const start = Date.now()
  for (;;) {
    try {
      return await fn()
    } catch (error) {
      if (Date.now() - start > timeout) throw new Error(`${label} not ready after ${timeout / 1000}s: ${error.message}`)
      await sleep(2000)
    }
  }
}

const buildDriver = () => {
  const options = new chrome.Options().addArguments("--headless=new", "--window-size=1280,1024", "--disable-gpu")
  return new Builder().forBrowser("chrome").usingServer(SELENIUM_URL).setChromeOptions(options).build()
}

const routes = getPrerenderedRoutes().filter(route => !SKIP_ROUTES.includes(route))
if (!routes.length) {
  console.error(`No prerendered HTML found in ${BUILD_DIR}. Run \`yarn build\` first.`)
  process.exit(1)
}

await retry("Next server", async () => {
  const response = await fetch(BASE_URL)
  if (response.status >= 500) throw new Error(`HTTP ${response.status}`)
})
let driver = await retry("Selenium", buildDriver)
await driver.manage().setTimeouts({pageLoad: PAGE_TIMEOUT, script: PAGE_TIMEOUT})

const pages = []
for (const route of routes) {
  const url = BASE_URL + route
  try {
    await driver.get(url)
    await driver.wait(() => driver.executeScript("return document.readyState === 'complete'"), PAGE_TIMEOUT)
    await waitForSettledDom(driver)
    const axe = new AxeBuilder(driver).withTags(WCAG_TAGS)
    EXCLUDE_SELECTORS.forEach(selector => axe.exclude(selector))
    const {violations} = await axe.analyze()
    pages.push({route, violations})
    console.log(`${violations.length ? "✖" : "✔"} ${route}${violations.length ? ` (${violations.length} rules)` : ""}`)
  } catch (error) {
    // Record the failure and keep going. Start a fresh browser in case the session itself is what broke.
    pages.push({route, error: error.message, violations: []})
    console.log(`! ${route} could not be checked: ${error.message}`)
    await driver.quit().catch(() => {})
    driver = await retry("Selenium", buildDriver)
    await driver.manage().setTimeouts({pageLoad: PAGE_TIMEOUT, script: PAGE_TIMEOUT})
  }
}
await driver.quit().catch(() => {})

// Group by rule so a shared component that breaks on every page reads as one problem, not dozens.
const rules = new Map()
for (const {route, violations} of pages) {
  for (const violation of violations) {
    const rule = rules.get(violation.id) || {
      id: violation.id,
      impact: violation.impact,
      help: violation.help,
      helpUrl: violation.helpUrl,
      nodeCount: 0,
      pages: [],
    }
    rule.nodeCount += violation.nodes.length
    rule.pages.push({route, targets: violation.nodes.map(node => node.target.join(" "))})
    rules.set(violation.id, rule)
  }
}

const IMPACT_ORDER = ["critical", "serious", "moderate", "minor"]
const sortedRules = [...rules.values()].sort((a, b) => IMPACT_ORDER.indexOf(a.impact) - IMPACT_ORDER.indexOf(b.impact))
const erroredPages = pages.filter(page => page.error)
const failingPages = pages.filter(page => page.violations.length)

console.log("")
for (const rule of sortedRules) {
  console.log(`[${rule.impact}] ${rule.id}: ${rule.help}`)
  console.log(`  ${rule.helpUrl}`)
  console.log(`  ${rule.nodeCount} elements on ${rule.pages.length} pages`)
  for (const {route, targets} of rule.pages) {
    console.log(`    ${route}`)
    for (const target of targets) console.log(`      ${target}`)
  }
  console.log("")
}
for (const {route, error} of erroredPages) console.log(`Could not check ${route}: ${error}`)

writeFileSync(
  REPORT_PATH,
  JSON.stringify(
    {baseUrl: BASE_URL, tags: WCAG_TAGS, excluded: EXCLUDE_SELECTORS, checked: pages.length, rules: sortedRules, errors: erroredPages},
    null,
    2
  )
)

console.log(
  `Checked ${pages.length} pages: ${sortedRules.length} rules violated on ${failingPages.length} pages, ` +
    `${erroredPages.length} pages could not be checked. Report written to ${REPORT_PATH}.`
)

process.exit(sortedRules.length || erroredPages.length ? 1 : 0)
