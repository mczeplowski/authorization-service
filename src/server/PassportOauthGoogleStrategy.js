import nconf from 'nconf';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';

export default class PassportOauthGoogleStrategy {
    constructor(userRepository) {
      this.userRepository = userRepository;
    }

    init() {
      passport.serializeUser((user, done) => {
        done(null, user.id);
      });

      passport.deserializeUser((id, done) => {
        this.userRepository
          .getById(id)
          .then((user) => {
              done(null, user);
          });
      });

      const googleConfig = {
        callbackURL: '/auth/google/redirect',
        clientID: nconf.get('google:clientId'),
        clientSecret: nconf.get('google:clientSecret'),
      };

      passport.use(new GoogleStrategy(googleConfig, async (accessToken, refreshToken, profile, done) => {
        let user = null;

        try {
          user = await this.userRepository.getByGoogleId(profile.id);
        } catch (e) {
          console.error(e);
        }

        if (user) {
          return done(null, user);
        }

        try {
          user = await this.userRepository.create({
            email: profile.email,
            googleId: profile.id,
            username: profile.displayName,
          });
        } catch (e) {
          console.error(e);
        }

        done(null, user);
      }));
    }
}