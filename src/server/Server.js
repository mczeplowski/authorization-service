import express from 'express';
import passport from 'passport';
import nconf from 'nconf';
import jwt from 'jsonwebtoken';

export default class Server {
  constructor(port, passportOauthGoogleStrategy) {
    this.port = port;
    this.server = express();
    this.passportOauthGoogleStrategy = passportOauthGoogleStrategy;
  }

  run() {
    this.server.use(passport.initialize());

    this.server.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email' ]}));

    this.server.get('/auth/google/redirect', passport.authenticate('google'), (req, res) => {
        const { id, username, email, googleId } = req.user;
        const user = { id, username, email, googleId };
        const secret = nconf.get('jwt:secret') || 'top-secret';
        const token = jwt.sign(user, secret, { expiresIn: '24h' });
        res.redirect(`http://localhost:8000/?token=${token}`);
    });

    this.passportOauthGoogleStrategy.init();

    return this.server.listen(this.port, () => {
      console.log(`Server is listening on port ${this.port}`);
    });
  }
}