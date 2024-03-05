import {CodegenConfig} from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/graphql` as string,
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