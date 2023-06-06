import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { changePostBodySchema, createPostBodySchema } from './schema';
import type { PostEntity } from '../../utils/DB/entities/DBPosts';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify,
): Promise<void> => {
  fastify.get('/', async (): Promise<PostEntity[]> => fastify.db.posts.findMany());

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async (request): Promise<PostEntity> => {
      const targetPost = await fastify.db.posts.findOne({
        key: 'id', equals: request.params.id,
      });

      if (!targetPost) {
        throw fastify.httpErrors.notFound('Not found.');
      }

      return targetPost;
    },
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createPostBodySchema,
      },
    },
    async (request): Promise<PostEntity> => {
      try {
        return await fastify.db.posts.create(request.body);
      } catch {
        throw fastify.httpErrors.badRequest('Bad request.');
      }
    },
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async (request): Promise<PostEntity | {}> => {
      try {
        await fastify.db.posts.delete(request.params.id);

        return {};
      } catch {
        throw fastify.httpErrors.badRequest('Bad request.');
      }
    },
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changePostBodySchema,
        params: idParamSchema,
      },
    },
    async (request): Promise<PostEntity> => {
      try {
        return await fastify.db.posts.change(request.params.id, request.body);
      } catch {
        throw fastify.httpErrors.badRequest('Bad request.');
      }
    },
  );
};

export default plugin;
