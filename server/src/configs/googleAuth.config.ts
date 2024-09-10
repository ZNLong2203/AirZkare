import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const strategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
}, (accessToken, refreshToken, profile, done) => {
    done(null, profile);
});

passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user);
})

passport.deserializeUser((obj: any, done: any) => {
    done(null, obj);
})

export default passport;
