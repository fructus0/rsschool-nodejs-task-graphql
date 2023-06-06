import { validate as isValidUuid } from 'uuid';
import { FastifyInstance } from 'fastify';
import type { UserEntity } from '../utils/DB/entities/DBUsers';

export class Validator {
  public static existenceValidation = (
    entity: any,
    fastifyInstance: FastifyInstance,
    message: string,
    isBadRequest: boolean,
  ): void => {
    if (!entity) {
      throw isBadRequest
        ? fastifyInstance.httpErrors.badRequest(message)
        : fastifyInstance.httpErrors.notFound(message);
    }
  };

  public static uuidValidation = (uuid: string, fastifyInstance: FastifyInstance): void => {
    if (!isValidUuid(uuid)) {
      throw fastifyInstance.httpErrors.badRequest('Invalid uuid.');
    }
  };

  public static sameUserIdsValidation = (
    id1: UserEntity,
    id2: UserEntity,
    fastifyInstance: FastifyInstance,
    message: string,
  ) => {
    if (id1 === id2) {
      throw fastifyInstance.httpErrors.badRequest(message);
    }
  };

  public static userAlreadySubscribedValidation = (
    user1: UserEntity,
    user2: UserEntity,
    fastifyInstance: FastifyInstance,
  ) => {
    if (user2.subscribedToUserIds.includes(user1.id)) {
      throw fastifyInstance.httpErrors.badRequest('User already has subscribe to target');
    }
  };

  public static userHasNoSubscribeToUserValidation = (
    user1: UserEntity,
    user2: UserEntity,
    fastifyInstance: FastifyInstance,
  ) => {
    if (!user2.subscribedToUserIds.includes(user1.id)) {
      throw fastifyInstance.httpErrors.badRequest('User has no subscribe to target');
    }
  };
}
