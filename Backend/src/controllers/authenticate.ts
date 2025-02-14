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
        done(null, false);
        return;
      }

      const user = await authenticationService.logIn(profile.emails[0].value);
      if (user) {
        done(null, profile);
        return;
      }

      const signUp = await authenticationService.signUp({
        email: profile.emails[0].value,
        name: profile.displayName,
        picture: profile.photos![0].value,
      });

      if (!signUp) {
        done(null, false);
        return
      }
      
      console.log('accessToken', accessToken);
      console.log('profile', profile);
      done(null, profile);
    }
  )
);

authenticateRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));


authenticateRouter.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login', session: false }), (req, res) => {
  const token = generateToken(req.user);
  res.redirect(`${process.env.FRONTEND_URL}/?token=${token}`);
});


export default authenticateRouter;