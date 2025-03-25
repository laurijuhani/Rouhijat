import { Router } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { generateToken } from "../utils/token";
import authenticationService from "../services/authenticationService";
import { GoogleUser } from "../utils/types";

const authenticateRouter = Router();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.BACKEND_URL + '/auth/google/callback',
    },
    (accessToken, _refreshToken, profile, done) => {
      // TODO: make this better
    
      if (!profile.emails) {
        done(null, false, { message: 'No email associated with this account' });
        return;
      }

      authenticationService.logIn(profile.emails[0].value)
        .then((user) => {
          if (user) {
            return done(null, profile);
          }
        })
        .catch((err) => {
          return done(err, false, { message: 'Internal server error' });
        });

      authenticationService.signUp({
        id: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        picture: profile.photos![0].value,
      })
        .then((signUp) => {
          if (!signUp) {
            return done(null, false, { message: 'Sign up failed' });
          }
        })
        .catch((err) => {
          return done(err, false, { message: 'Internal server error' });
        });
      
      console.log('accessToken', accessToken);
      // maybe save the accessToken to the user
      console.log('profile', profile);
      done(null, profile);
    }
  )
);


// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
authenticateRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));


authenticateRouter.get('/google/callback', (req, res, next) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  passport.authenticate('google', { session: false }, async (err, user: GoogleUser, info: { message?: string }) => {
    if (err) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=500&message=Internal server error`);
    }
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=401&message=${info?.message || 'Authentication failed'}`);
    }
    const token = await generateToken(user);
    res.redirect(`${process.env.FRONTEND_URL}/authorized/?token=${token}`);
  })(req, res, next);
});


export default authenticateRouter;