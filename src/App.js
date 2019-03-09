import nconf from 'nconf';
import Server from './server/Server';
import Mongo from './database/Mongo';
import UserRepository from './database/UserRepository';
import PassportOauthGoogleStrategy from './server/PassportOauthGoogleStrategy';

export default class App {
  constructor() {
    const databaseUrl = nconf.get('database');
    this.mongo = new Mongo(databaseUrl);

    const port = nconf.get('api:port') || 3000;
    const sessionSecret = nconf.get('session:secret') || 'secret';
    const userRepository = new UserRepository();
    const passportOauthGoogleStrategy = new PassportOauthGoogleStrategy(userRepository);
    this.server = new Server(port, sessionSecret, passportOauthGoogleStrategy);
  }

  async run() {
    await this.mongo.run();
    await this.server.run();

    console.log('Application is ready.');
  }
}
