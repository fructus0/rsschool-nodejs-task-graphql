import { validate as isValidUuid } from 'uuid';
import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { changeUserBodySchema, createUserBodySchema, subscribeBodySchema } from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify,
): Promise<void> => {
  fastify.get('/', async (): Promise<UserEntity[]> => fastify.db.users.findMany());

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async (request): Promise<UserEntity> => {
      const user = await fastify.db.users.findOne({
        key: 'id', equals: request.params.id,
      });

      if (!user) {
        throw fastify.httpErrors.notFound('Not Found.');
      }

      return user;
    },
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async (request): Promise<UserEntity> => {
      try {
        return await fastify.db.users.create(request.body);
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
    async (request): Promise<UserEntity> => {
      if (!isValidUuid(request.params.id)) {
        throw fastify.httpErrors.badRequest('Bad request.');
      }

      const userToDelete = await fastify.db.users.findOne({ key: 'id', equals: request.params.id });

      if (!userToDelete) {
        throw fastify.httpErrors.notFound('Not found.');
      }

      const userPosts = await fastify.db.posts.findMany({ key: 'userId', equals: userToDelete.id });
      const userProfile = await fastify.db.profiles.findOne({ key: 'userId', equals: userToDelete.id });
      const userFollowers = await fastify.db.users.findMany({ key: 'subscribedToUserIds', inArray: userToDelete.id });

      for (const post of userPosts) {
        await fastify.db.posts.delete(post.id);
      }

      if (userProfile) {
        await fastify.db.profiles.delete(userProfile.id);
      }

      for (const follower of userFollowers) {
        await fastify.db.users.change(follower.id, {
          subscribedToUserIds: follower
            .subscribedToUserIds.filter((id) => id !== userToDelete.id),
        });
      }

      return fastify.db.users.delete(userToDelete.id);
    },
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async (request): Promise<UserEntity> => {
      if (!isValidUuid(request.params.id) || !isValidUuid(request.body.userId)) {
        fastify.httpErrors.badRequest('Bad request.');
      }

      if (request.body.userId === request.params.id) {
        throw fastify.httpErrors.badRequest('Invalid user to subscribe.');
      }

      const currentUser = await fastify.db.users.findOne({ key: 'id', equals: request.body.userId });
      const targetUser = await fastify.db.users.findOne({ key: 'id', equals: request.params.id });

      if (!currentUser || !targetUser) {
        throw fastify.httpErrors.notFound('Some of users are not found');
      }

      try {
        return await fastify.db.users.change(
          currentUser.id,
          { subscribedToUserIds: [...currentUser.subscribedToUserIds, targetUser.id] },
        );
      } catch {
        throw fastify.httpErrors.badRequest('Bad request.');
      }
    },
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async (request): Promise<UserEntity> => {
      if (!isValidUuid(request.params.id) || !isValidUuid(request.body.userId)) {
        fastify.httpErrors.badRequest('Bad request.');
      }

      if (request.body.userId === request.params.id) {
        throw fastify.httpErrors.badRequest('Invalid user to unsubscribe.');
      }

      const currentUser = await fastify.db.users.findOne({ key: 'id', equals: request.body.userId });
      const targetUser = await fastify.db.users.findOne({ key: 'id', equals: request.params.id });

      if (!currentUser || !targetUser) {
        throw fastify.httpErrors.notFound('Some of users are not found');
      }

      if (!currentUser.subscribedToUserIds.includes(targetUser.id)) {
        throw fastify.httpErrors.badRequest('User does not have subscription.');
      }

      try {
        return await fastify.db.users.change(currentUser.id, {
          subscribedToUserIds: currentUser
            .subscribedToUserIds.filter((id) => id !== targetUser.id),
        });
      } catch {
        throw fastify.httpErrors.notFound('Not found.');
      }
    },
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async (request): Promise<UserEntity> => {
      try {
        return await fastify.db.users.change(request.params.id, request.body);
      } catch {
        throw fastify.httpErrors.badRequest('Bad request.');
      }
    },
  );
};

export default plugin;
