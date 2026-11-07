// Validates the HTML that `next build` prerendered into `.next/server/app`. Rules live in `.htmlvalidate.json`.
import {FileSystemConfigLoader, HtmlValidate, Reporter, formatterFactory} from "html-validate"
import {BUILD_DIR, getPrerenderedFiles} from "./prerendered-pages.mjs"

// Ids that third party embed codes require exactly as written, since their scripts look the element up by it. An editor
// can also place the same embed twice on a page.
const VENDOR_IDS = ["25Live Location Request"]

const files = getPrerenderedFiles()

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
