import { Router } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { generateToken } from "../utils/token";

const authenticateRouter = Router();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.BACKEND_URL + '/auth/google/callback',
    },
    (accessToken, _refreshToken, profile, done) => {

      // add here the logic to save the user to the databases
      
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