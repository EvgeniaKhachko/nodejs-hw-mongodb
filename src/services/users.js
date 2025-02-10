import { User } from "../models/user.js";
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import crypto from "node:crypto";
import { SessionCollection } from "../models/session.js";
import { ACCESS_TOKEN_LIVE_TIME, REFRESH_TOKEN_LIVE_TIME } from "../../time.js";

export const registerUser = async (payload) => {
    const { name, email, password } = payload;

    // 🔹 Перевіряємо, чи існує користувач з таким email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw createHttpError(409, 'Email in use');
    };
    const hashedPassword = await bcrypt.hash(password, 10);
 
     // Створюємо нового користувача після перевірки
     const newUser = await User.create({ name, email, password:hashedPassword, });

     return newUser;
};

export const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email });
  
    if (!user) {
      throw createHttpError(401, "Invalid email or password");
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw createHttpError(401, "Invalid email or password");
    } 
    // return user;

    await SessionCollection.deleteOne({userId: user._id});

    const session = await SessionCollection.create({
        accessToken: crypto.randomBytes(20).toString('base64') ,
        refreshToken: crypto.randomBytes(20).toString('base64'),
        userId: user._id ,
        accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_LIVE_TIME),
        refreshTokenValidUntil: new Date(Date.now() +  REFRESH_TOKEN_LIVE_TIME),
    })

    return session;
};
export const logoutUser = async ({ sessionId, sessionToken }) => {
    return await SessionCollection.deleteOne({ _id: sessionId, refreshToken: sessionToken });
};


 export const refreshSession = async ({ sessionId, sessionToken }) => {
    const session = await SessionCollection.findOne({ 
        _id: sessionId,
         refreshToken: sessionToken });

    if (!session) {
        throw createHttpError(401, 'Session not found!');
    }
    // Перевіримо чи не прострочений refreshToken
    if (session.refreshTokenValidUntil < new Date()) {
        throw createHttpError(401, 'Session token expired!');
    }

    const user = await User.findById(session.userId);
    if(!user){
        throw createHttpError(401,'Session user is not found')
    }
    // Видалимо стару сесію
    await SessionCollection.deleteOne({ _id: sessionId});

    const newAccessToken = crypto.randomBytes(20).toString('base64');
    const newRefreshToken = crypto.randomBytes(20).toString('base64');
    
    // Створимо нову сесію в базі
    const newSession = await SessionCollection.create({
        accessToken: newAccessToken,  
        refreshToken: newRefreshToken,
        userId: session.userId ,
        accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_LIVE_TIME),
        refreshTokenValidUntil: new Date(Date.now() +  REFRESH_TOKEN_LIVE_TIME),
    })

    return {
        accessToken: newAccessToken,
        sessionId: newSession._id
    };
};