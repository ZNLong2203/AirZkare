import passport from "passport";
import { Strategy as GoogleStrategy, Profile as GoogleProfile, VerifyCallback } from "passport-google-oauth20";
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import { sign } from "jsonwebtoken";
import { User } from "../interfaces/user.interface";

const prisma = new PrismaClient();

const strategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
    passReqToCallback: true,
}, async (req: any, accessToken: string, refreshToken: string, profile: GoogleProfile, done: VerifyCallback) => {
    try {
        let user: User | null = await prisma.user.findUnique({
            where: {
                email: profile.emails?.[0]?.value,
            }
        })
    
        if(!user) {
            user = await prisma.user.create({
                data: {
                    user_id: randomUUID(),
                    username: profile.displayName,
                    email: profile.emails?.[0]?.value as string,
                    image: profile.photos?.[0]?.value,
                    password: '',
                    provider: 'google',
                    provider_code: profile.id,
                }
            })
        } else if(user.provider !== 'google') {
            return done(null, false, { message: 'User already registered with different provider' })
        }

        const checkCreatePassenger = await prisma.passenger.findUnique({
            where: {
                passenger_id: user.user_id,
            }
        })
        if(!checkCreatePassenger) {
            await prisma.passenger.create({
                data: {
                    passenger_id: user.user_id,
                    user_id: user.user_id,
                }
            })
        }

        const payload = {
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            role: user.role,
        }
        const accessToken = sign(payload, process.env.JWT_SECRET!, { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN });
        const refreshToken = sign(payload, process.env.JWT_SECRET!, { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN });
    
        const metadata = {
            user_id: user.user_id,
            username: user.username,
            role: user.role,
            accessToken: accessToken,
            refreshToken: refreshToken,
        }
    
        return done(null, metadata);
    } catch(err) {
        return done(err, false);
    }
});

passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user);
})

passport.deserializeUser((obj: any, done: any) => {
    done(null, obj);
})

export default passport;
