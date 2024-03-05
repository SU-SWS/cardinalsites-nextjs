import Wysiwyg from "@components/elements/wysiwyg";
import StanfordPolicyCard from "@components/nodes/cards/stanford-policy/stanford-policy-card";
import StringWithLines from "@components/elements/string-with-lines";
import {HtmlHTMLAttributes} from "react";
import {H1, H2, H3} from "@components/elements/headers";
import {NodeStanfordPolicy} from "@lib/gql/__generated__/drupal.d";

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordPolicy
  headingLevel?: "h2" | "h3"
}

const StanfordPolicyPage = async ({node, ...props}: Props) => {
  const changeLog = node.suPolicyChangelog?.filter(change => change.suPolicyPublic) || []
  return (
    <article className="centered pt-32" {...props}>
      <H1>
        {node.title}
      </H1>
      <div className="flex flex-col gap-20">
        {(node.suPolicyAuthority || node.suPolicyUpdated || node.suPolicyEffective) &&
          <div>
            {node.suPolicyAuthority &&
              <div>
                <strong>Authority: </strong>
                {node.suPolicyAuthority}
              </div>
            }
            {node.suPolicyUpdated &&
              <div>
                <strong>Last Updated: </strong>
                {new Date(node.suPolicyUpdated.time).toLocaleDateString('en-us', {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  timeZone: node.suPolicyUpdated.timezone
                })}
              </div>
            }
            {node.suPolicyEffective &&
              <div>
                <strong>Effective Date: </strong>
                {new Date(node.suPolicyEffective.time).toLocaleDateString('en-us', {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  timeZone: node.suPolicyEffective.timezone
                })}
              </div>
            }
          </div>
        }

        {changeLog.length > 0 &&
          <div className="bg-black-10 p-20 border border-black-40 mb-10">
            <H2 className="text-m1">Change log:</H2>

            {changeLog.map(change =>
              <div key={change.id}>
                <H3 className="flex gap-2 text-m0">
                  <div>{new Date(change.suPolicyDate.time).toLocaleDateString('en-us', {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    timeZone: change.suPolicyDate.timezone
                  })}</div>
                  <div className="w-[2px] bg-black shrink-0"/>
                  <div>{change.suPolicyTitle}</div>
                </H3>

                <div>
                  <StringWithLines text={change.suPolicyNotes} key={change.id}/>
                </div>
              </div>
            )}
          </div>
        }

        <Wysiwyg html={node.body?.processed}/>

        {node.suPolicyRelated &&
          <div>
            <H2 className="text-center">Related Policies</H2>
            <ul className="list-unstyled grid lg:grid-cols-3 gap-20">
              {node.suPolicyRelated.map(policy =>
                <li key={policy.id}>
                  <StanfordPolicyCard node={policy as NodeStanfordPolicy}/>
                </li>
              )}
            </ul>
          </div>
        }
      </div>
    </article>
  )
}
export default StanfordPolicyPage;