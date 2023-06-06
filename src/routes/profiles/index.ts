import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify,
): Promise<void> => {
  fastify.get('/', async (): Promise<
  ProfileEntity[]
  > => fastify.db.profiles.findMany());

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async (request): Promise<ProfileEntity> => {
      const profile = await fastify.db.profiles.findOne({ key: 'id', equals: request.params.id });

      if (!profile) {
        throw fastify.httpErrors.notFound('Not found.');
      }

      return profile;
    },
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async (request): Promise<ProfileEntity> => {
      const memberType = await fastify.db.memberTypes.findOne({ key: 'id', equals: request.body.memberTypeId });
      const userHasProfile = await fastify.db.profiles.findOne({ key: 'userId', equals: request.body.userId });

      if (!memberType) {
        throw fastify.httpErrors.badRequest('Member type not found.');
      }

      if (userHasProfile) {
        throw fastify.httpErrors.badRequest('User already has profile');
      }

      try {
        return await fastify.db.profiles.create(request.body);
      } catch {
        throw fastify.httpErrors.badRequest('Bad request');
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
    async (request): Promise<ProfileEntity> => {
      try {
        return await fastify.db.profiles.delete(request.params.id);
      } catch {
        throw fastify.httpErrors.badRequest('Not found.');
      }
    },
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async (request): Promise<ProfileEntity> => {
      const memberType = await fastify.db.memberTypes.findOne({ key: 'id', equals: request.body.memberTypeId as string });

      if (!memberType) {
        throw fastify.httpErrors.badRequest('Member type not found.');
      }

      try {
        return await fastify.db.profiles.change(request.params.id, request.body);
      } catch {
        throw fastify.httpErrors.badRequest('Bad request.');
      }
    },
  );
};

export default plugin;
