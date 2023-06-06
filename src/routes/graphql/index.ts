import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphql } from 'graphql/graphql';
import { validate } from 'graphql/validation';
import { parse } from 'graphql/language';
import * as depthLimit from 'graphql-depth-limit';

import { getRequestSchema } from './requestSchema';
import { graphqlBodySchema } from './schema';

const DEPTH_LIMIT = 6;

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify,
): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async (request) => {
      const errors = validate(
        getRequestSchema(fastify),
        parse(request.body.query as string),
        [depthLimit(DEPTH_LIMIT)],
      );

      if (errors.length) {
        return {
          errors,
          data: null,
        };
      }

      return graphql(
        {
          variableValues: request.body.variables,
          schema: getRequestSchema(fastify),
          source: request.body.query as string,
          contextValue: fastify,
        },
      );
    },
  );
};

export default plugin;
