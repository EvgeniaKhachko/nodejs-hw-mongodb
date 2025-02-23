import createHttpError from "http-errors";
import { SessionCollection } from "../models/session.js";
import bcrypt from "bcrypt";
import { User } from "../models/user.js";
import { ACCESS_TOKEN_LIVE_TIME, REFRESH_TOKEN_LIVE_TIME, ONE_DAY } from "../constants/time.js";
import crypto from "crypto";
import { sendEmail } from "../utils/sendResetEmail.js";
import { ENV_VARS } from "../constants/env.js";
import { getEnvVar } from "../utils/getEnvVar.js"
import jwt from "jsonwebtoken";
import fs from "node:fs";
import path from "node:path";
import Handlebars from "handlebars";
import { TEMPLATES_DIR_PATH } from "../constants/path.js";

const resetEmailTemplate = fs.readFileSync(
    path.join(TEMPLATES_DIR_PATH, 'send-reset-email.html')
).toString(); 

export const registerUser = async (payload) => {
        const { name, email, password } = payload;

    // Перевіряємо, чи існує користувач з таким email
    const existingUser = await User.findOne({ email });
    if (existingUser) { 
        throw createHttpError(409, 'Email in use');
    };
    const hashedPassword = await bcrypt.hash(password, 10);
 
     // Створюємо нового користувача після перевірки
     const newUser = await User.create({ name, email, password:hashedPassword, });

     return newUser;
}
export const loginUser = async (userData) => {

    const user = await User.findOne({ email: userData.email });

    if (!user) throw createHttpError(401, "Invalid credentials");
  
 
    const isPasswordValid = await bcrypt.compare(userData.password, user.password);
    if (!isPasswordValid) {
      throw createHttpError(401, "Invalid email or password");
    } 

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

export const refreshSession = async ({ sessionId, refreshToken }) => {

 const currentSession = await SessionCollection.findOne({ _id: sessionId, refreshToken });
 const userId = currentSession.userId;
 await SessionCollection.deleteOne({ _id: sessionId, refreshToken });
 return  await SessionCollection.create({
        accessToken: crypto.randomBytes(20).toString('base64') ,
        refreshToken: crypto.randomBytes(20).toString('base64'),
        userId: userId,
        accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_LIVE_TIME),
        refreshTokenValidUntil: new Date(Date.now() +  REFRESH_TOKEN_LIVE_TIME),
    });
};


// export const refreshSession = async ({ sessionId, refreshToken }) => {
//     const existingSession = await SessionCollection.findOne({ _id: sessionId, refreshToken });

//     if (!existingSession) {
//         throw new Error("Session not found or invalid refresh token");
//     }

//     const userId = existingSession.userId; // Отримуємо userId

//     await SessionCollection.deleteOne({ _id: sessionId });
//    const session = createSession(); // Генеруємо сесію
//    await SessionCollection.create({
//        userId: userId,
//        accessToken: session.accessToken,
//        accessTokenValidUntil: session.accessTokenValidUntil,
//        refreshToken: session.refreshToken,
//        refreshTokenValidUntil: session.refreshTokenValidUntil,
//    });

//    return session.accessToken;
// };

export const logoutUser = async ({ sessionId, refreshToken }) => {
    return await SessionCollection.deleteOne({ _id: sessionId, refreshToken });
};

export const logoutSession = async (refreshToken) => {
    try{
    const session = await SessionCollection.findOne({ refreshToken });

    if (!session) {
        throw createHttpError(401, "Invalid session");
    }
    await SessionCollection.deleteOne({ _id: session._id });
} catch (error) {
    throw createHttpError(500, "An error occurred during logout", { cause: error });
}
};

export const sendResetEmail =async (email) => {
    const user = await User.findOne({email});
    if(!user){
        throw createHttpError(404, 'User not found!');
    }
 
    const token = jwt.sign(
        {sub: user._id, email}, 
        getEnvVar(ENV_VARS.JWT_SECRET),
        {
        expiresIn: '5m',
    });
    const resetPasswordLink = `${getEnvVar(ENV_VARS.APP_DOMAIN)}/reset-password?token=${token}`;

    const template = Handlebars.compile(resetEmailTemplate);

    const html = template({
        name: user.name,
        link: resetPasswordLink,
    });
    await sendEmail({
        to: email,
        from: getEnvVar(ENV_VARS.SMTP_FROM),
        subject: 'Reset your password',
        html,
    });
};

export const resetPassword = async ({password, token}) => {
    let payload;
try {
    payload = jwt.verify(token, getEnvVar(ENV_VARS.JWT_SECRET))
    } catch(err){
    console.error(err.message);
    throw createHttpError(401, "Token is expired or invalid.");
    }

const user = await User.findById(payload.sub);
if(!user) {
    throw createHttpError(404, "User not found!");
}
const hashedPassword = await bcrypt.hash(password, 12);

user.password = hashedPassword;
user.refreshToken = null;

await user.save();

// await User.findByIdAndUpdate(user._id, 
//     {password: hashedPassword,})
};