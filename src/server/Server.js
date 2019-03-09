import express from 'express';
import passport from 'passport';
import nconf from 'nconf';
import jwt from 'jsonwebtoken';
import session from 'express-session';

const passRedirectUrlToSessionMiddleware = (req, res, next) => {
  req.session.redirectUrl = req.query.redirectUrl;
  next();
};

export default class Server {
  constructor(port, sessionSecret, passportOauthGoogleStrategy) {
    this.port = port;
    this.sessionSecret = sessionSecret;
    this.server = express();
    this.passportOauthGoogleStrategy = passportOauthGoogleStrategy;
  }

  run() {
    this.server
      .use(passport.initialize())
      .use(session({
        secret: this.sessionSecret,
        resave: false,
        saveUninitialized: true,
      }));

    this.server.get('/auth/google', passRedirectUrlToSessionMiddleware, passport.authenticate('google', { scope: ['profile', 'email' ]}));

    this.server.get('/auth/google/redirect', passport.authenticate('google'), (req, res) => {
        const { id, username, email, googleId } = req.user;
        const user = { id, username, email, googleId };
        const secret = nconf.get('jwt:secret') || 'top-secret';
        const token = jwt.sign(user, secret, { expiresIn: '24h' });
        const redirectUrl = `${req.session.redirectUrl || 'http://localhost:8080'}?token=${token}`;
        res.redirect(redirectUrl);
    });

    this.passportOauthGoogleStrategy.init();

    return this.server.listen(this.port, () => {
      console.log(`Server is listening on port ${this.port}`);
    });
  }
}