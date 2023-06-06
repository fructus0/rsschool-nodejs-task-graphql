import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { changeMemberTypeBodySchema } from './schema';
import type { MemberTypeEntity } from '../../utils/DB/entities/DBMemberTypes';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify,
): Promise<void> => {
  fastify.get('/', async (): Promise<
  MemberTypeEntity[]
  > => fastify.db.memberTypes.findMany());

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },

    async (request): Promise<MemberTypeEntity> => {
      const memberType = await fastify.db.memberTypes.findOne({
        key: 'id', equals: request.params.id,
      });

      if (!memberType) {
        throw fastify.httpErrors.notFound('Not found.');
      }

      return memberType;
    },
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeMemberTypeBodySchema,
        params: idParamSchema,
      },
    },
    async (request): Promise<MemberTypeEntity> => {
      try {
        return await fastify.db.memberTypes.change(request.params.id, request.body);
      } catch {
        throw fastify.httpErrors.badRequest('Bad request.');
      }
    },
  );
};

export default plugin;
