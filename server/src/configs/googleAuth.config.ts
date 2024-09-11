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
    
        const createToken = sign({
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            role: user.role,
        }, process.env.JWT_SECRET!, { expiresIn: '1d' });
    
        const existsToken = await prisma.token.findFirst({
            where: {
                user_id: user.user_id,
            }
        })
    
        if(existsToken) {
            await prisma.token.update({
                where: {
                    token_id: existsToken.token_id,
                },
                data: {
                    token: createToken,
                }
            })
        } else {
            await prisma.token.create({
                data: {
                    token_id: randomUUID(),
                    user_id: user.user_id,
                    token: createToken,
                }
            })
        }
    
        const metadata = {
            user_id: user.user_id,
            username: user.username,
            role: user.role,
            token: createToken,
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
