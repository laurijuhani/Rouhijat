import { Router } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { generateToken } from "../utils/token";
import authenticationService from "../services/authenticationService";

const authenticateRouter = Router();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.BACKEND_URL + '/auth/google/callback',
    },
    async (accessToken, _refreshToken, profile, done) => {
      // TODO: make this better
    
      if (!profile.emails) {
        done(null, false, { message: 'No email associated with this account' });
        return;
      }

      console.log(profile);
      

      const user = await authenticationService.logIn(profile.emails[0].value);
      if (user) {
        done(null, profile);
        return;
      }

      const signUp = await authenticationService.signUp({
        id: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        picture: profile.photos![0].value,
      });

      if (!signUp) {
        done(null, false, { message: 'Sign up failed' });
        return
      }
      
      console.log('accessToken', accessToken);
      // mayve save the accessToken to the user
      console.log('profile', profile);
      done(null, profile);
    }
  )
);

authenticateRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));


authenticateRouter.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=500&message=Internal server error`);
    }
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=401&message=${info?.message || 'Authentication failed'}`);
    }
    const token = generateToken(user);
    res.redirect(`${process.env.FRONTEND_URL}/authorized/?token=${token}`);
  })(req, res, next);
});


export default authenticateRouter;