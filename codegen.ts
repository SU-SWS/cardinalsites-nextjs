import {CodegenConfig} from "@graphql-codegen/cli"

const drupalUrl = `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/graphql`
const config: CodegenConfig = {
  overwrite: true,
  schema: [
    {
      [drupalUrl]: {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(process.env.DRUPAL_BASIC_AUTH || (process.env.DRUPAL_BASIC_AUTH_ADMIN as string)).toString(
              "base64"
            ),
        },
      },
    },
  ],
  documents: "src/lib/gql/*.drupal.gql",
  generates: {
    // Outputs graphql.ts (types + TypedDocumentNode per operation), gql.ts, and index.ts
    "src/lib/gql/__generated__/": {
      preset: "client",
      presetConfig: {
        // Disable fragment masking — fragments are accessed directly, not via useFragment()
        fragmentMasking: false,
      },
      config: {
        // Emit enums as const objects for exhaustive type narrowing
        enumsAsConst: true,
        // Map Drupal custom scalars to appropriate TypeScript types
        scalars: {
          Bibliography: "string",
          Cursor: "string",
          Email: "string",
          Html: "string",
          PhoneNumber: "string",
          Time: "string",
          TimeZone: "string",
          Timestamp: "string",
          UntypedStructuredData: "unknown",
          UtcOffset: "string",
        },
      },
      plugins: [
        {add: {content: "/** THIS IS GENERATED FILE. DO NOT MODIFY IT DIRECTLY, RUN 'yarn graphql' INSTEAD. **/\n"}},
      ],
    },
  },
}

export default config
