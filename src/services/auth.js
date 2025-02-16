import createHttpError from "http-errors";
import { SessionCollection } from "../models/session.js";
import bcrypt from "bcrypt";
import { User } from "../models/user.js";
import { ACCESS_TOKEN_LIVE_TIME, REFRESH_TOKEN_LIVE_TIME, ONE_DAY } from "../../time.js";
import crypto from "crypto";



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