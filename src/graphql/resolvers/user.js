import { createUser, getUser } from '../../dataLayer/mongo/user';

export const userResolvers = {
  Query: {
    getUser
  },
  Mutation: {
    createUser
  }
};
