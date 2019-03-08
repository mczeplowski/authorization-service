import User from './UserModel';

export default class UserRepository {
  constructor() {
    this.model = User;
  }

    getModel() {
      return this.model;
    }

    create(user) {
      return this.getModel()
        .create(user);
    }

    getById(id) {
      return this.getModel()
        .findById(id)
        .exec();
    }

    getByGoogleId(googleId) {
      return this.getModel()
        .findOne({ googleId })
        .exec();
    }
}