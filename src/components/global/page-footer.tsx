import LocalFooter from "@components/config-pages/local-footer"
import SuperFooter from "@components/config-pages/super-footer"
import {getConfigPage} from "@lib/gql/gql-queries"
import {StanfordLocalFooter, StanfordSuperFooter} from "@lib/gql/__generated__/drupal.d"
import {HTMLAttributes} from "react"

type Props = HTMLAttributes<HTMLElement>

const PageFooter = async ({...props}: Props) => {
  const superFooterConfig = await getConfigPage<StanfordSuperFooter>("StanfordSuperFooter")
  const localFooterConfig = await getConfigPage<StanfordLocalFooter>("StanfordLocalFooter")

  return (
    <footer {...props}>
      {superFooterConfig && <SuperFooter {...superFooterConfig} />}
      {localFooterConfig && <LocalFooter {...localFooterConfig} />}

      <div className="bg-cardinal-red py-10 [&_a:hocus]:text-white [&_a]:text-white [&_a]:no-underline">
        <div className="centered lg:flex lg:items-start lg:gap-20">
          <div className="mb-10 text-center">
            <a
              className="text-center font-stanford"
              href="https://www.stanford.edu"
            >
              <div className="text-[3.2rem]">Stanford</div>
              <div>University</div>
            </a>
          </div>
          <div className="mx-auto lg:mx-0 [&_a:focus]:underline [&_a:hover]:underline">
            <nav
              aria-label="University Links"
              className="mb-5 flex justify-center gap-20 sm:flex-col sm:gap-0 lg:justify-start"
            >
              <ul className="list-unstyled justify-center text-2xl sm:flex sm:gap-10 md:text-3xl lg:justify-start">
                <li>
                  <a href="https://www.stanford.edu">Stanford Home</a>
                </li>
                <li>
                  <a href="https://visit.stanford.edu/plan/">Maps &amp; Directions</a>
                </li>
                <li>
                  <a href="https://www.stanford.edu/search/">Search Stanford</a>
                </li>
                <li>
                  <a href="https://emergency.stanford.edu">Emergency Info</a>
                </li>
              </ul>

              <ul className="list-unstyled justify-center text-2xl sm:flex sm:gap-10 sm:text-xl lg:justify-start lg:text-3xl">
                <li>
                  <a
                    href="https://www.stanford.edu/site/terms/"
                    title="Terms of use for sites"
                    className="font-normal"
                  >
                    Terms of Use
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.stanford.edu/site/privacy/"
                    title="Privacy and cookie policy"
                    className="font-normal"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="https://uit.stanford.edu/security/copyright-infringement"
                    title="Report alleged copyright infringement"
                    className="font-normal"
                  >
                    Copyright
                  </a>
                </li>
                <li>
                  <a
                    href="https://adminguide.stanford.edu/chapter-1/subchapter-5/policy-1-5-4"
                    title="Ownership and use of Stanford trademarks and images"
                    className="font-normal"
                  >
                    Trademarks
                  </a>
                </li>
                <li>
                  <a
                    href="https://bulletin.stanford.edu/pages/c7vDgeOuJIfpZe8GKmW3"
                    title="Non-discrimination policy"
                    className="font-normal"
                  >
                    Non-Discrimination
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.stanford.edu/site/accessibility"
                    title="Report web accessibility issues"
                    className="font-normal"
                  >
                    Accessibility
                  </a>
                </li>
              </ul>
            </nav>
            <div className="text-center text-xl text-white lg:text-left">© Stanford University. Stanford, California 94305.</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
export default PageFooter
