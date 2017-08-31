const resolvers = {
  User: {
    id(user) {
      return user._id;
    },

    createdBy(user, args, { User, me }) {
      return User.createdBy(user, me, 'user createdBy');
    },

    updatedBy(user, args, { User, me }) {
      return User.updatedBy(user, me, 'user updatedBy');
    }
  },
  Query: {
    users(root, { lastCreatedAt, limit }, { User, me }) {
      return User.find({ lastCreatedAt, limit }, me, 'users');
    },

    user(root, { id }, { User, me }) {
      return User.findOneById(id, me, 'user');
    }
  },
  Mutation: {
    async createUser(root, { input }, { User, me }) {
      return await User.insert(input, me, 'createUser');
    },

    async updateUser(root, { id, input }, { User, me }) {
      return await User.updateById(id, input, me, 'updateUser');
    },

    async removeUser(root, { id }, { User, me }) {
      return await User.removeById(id, me, 'removeUser');
    }
  },
  Subscription: {
    userCreated: user => user,
    userUpdated: user => user,
    userRemoved: id => id
  }
};

export default resolvers;
