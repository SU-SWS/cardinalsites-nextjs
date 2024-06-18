import {CodegenConfig} from '@graphql-codegen/cli';

const drupalUrl = `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/graphql`;
const config: CodegenConfig = {
  overwrite: true,
  schema: [{
    [drupalUrl]: {
      headers: {
        "Authorization": "Basic " + Buffer.from(process.env.DRUPAL_BASIC_AUTH_ADMIN as string).toString("base64")
      }
    }
  }],
  documents: 'src/lib/gql/*.drupal.gql',
  generates: {
    'src/lib/gql/__generated__/drupal.d.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        {add: {content: "/** THIS IS GENERATED FILE. DO NOT MODIFY IT DIRECTLY, RUN 'yarn graphql' INSTEAD. **/"}}
      ],
    },
    'src/lib/gql/__generated__/queries.ts': {
      preset: 'import-types',
      plugins: [
        'typescript-graphql-request',
        {add: {content: "/** THIS IS GENERATED FILE. DO NOT MODIFY IT DIRECTLY, RUN 'yarn graphql' INSTEAD. **/"}}
      ],
      presetConfig: {
        typesPath: './drupal.d',
        importTypesNamespace: 'DrupalTypes'
      },
    },

  },
};

export default config;