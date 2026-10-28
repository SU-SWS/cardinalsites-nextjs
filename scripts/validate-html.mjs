// Validates the HTML that `next build` prerendered into `.next/server/app`. Rules live in `.htmlvalidate.json`.
import {existsSync, readFileSync, readdirSync} from "node:fs"
import {join} from "node:path"
import {FileSystemConfigLoader, HtmlValidate, Reporter, formatterFactory} from "html-validate"

const BUILD_DIR = ".next/server/app"

// Ids that third party embed codes require exactly as written, since their scripts look the element up by it. An editor
// can also place the same embed twice on a page.
const VENDOR_IDS = ["25Live Location Request"]

// Routes that redirect or 404 during prerendering aren't pages. Next writes them as an empty `__next_error__` shell, or
// as the layout with a redirect or not found fallback in place of the content when it happens inside a Suspense boundary.
const isErrorShell = file => {
  const html = readFileSync(file, "utf8")
  return html.includes('<html id="__next_error__"') || /NEXT_REDIRECT;|NEXT_HTTP_ERROR_FALLBACK;/.test(html)
}

// Fallback shells for dynamic params, ie `[[...slug]].html`. Their content, including the <title>, streams in at request time.
const isFallbackShell = file => file.includes("[")

const files = (existsSync(BUILD_DIR) ? readdirSync(BUILD_DIR, {recursive: true}) : [])
  .filter(file => file.endsWith(".html"))
  .map(file => join(BUILD_DIR, file))
  .filter(file => !isFallbackShell(file) && !isErrorShell(file))

if (!files.length) {
  console.error(`No prerendered HTML found in ${BUILD_DIR}. Run \`yarn build\` first.`)
  process.exit(1)
}

const htmlvalidate = new HtmlValidate(new FileSystemConfigLoader())
const report = Reporter.merge(await Promise.all(files.map(file => htmlvalidate.validateFile(file))))

const isVendorId = message => VENDOR_IDS.some(id => message.message.includes(`"${id}"`))

const results = report.results
  .map(result => {
    const messages = result.messages.filter(message => !isVendorId(message))
    return {
      ...result,
      messages,
      errorCount: messages.filter(message => message.severity === 2).length,
      warningCount: messages.filter(message => message.severity === 1).length,
    }
  })
  .filter(result => result.messages.length)

const errorCount = results.reduce((total, result) => total + result.errorCount, 0)
const warningCount = results.reduce((total, result) => total + result.warningCount, 0)

process.stdout.write(formatterFactory("stylish")(results))
process.stdout.write(`Validated ${files.length} pages: ${errorCount} errors, ${warningCount} warnings.\n`)

process.exit(errorCount ? 1 : 0)
