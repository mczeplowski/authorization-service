import mongoose from 'mongoose';

export default class Mongo {
  constructor(databaseUrl) {
    this.databaseUrl = databaseUrl;
  }

  run() {
    console.log('Conecting with Mongo...');
    return mongoose.connect(this.databaseUrl, { useNewUrlParser: true })
      .then(() => {
        console.log('Successful connect with Mongo');
      })
      .catch((e) => {
        console.error('Unable connect with Mongo', JSON.stringify(e));
        process.exit(1);
      });

  }
}