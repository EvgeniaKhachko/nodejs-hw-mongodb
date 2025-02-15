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

    // Видаляємо старі сесії
    await SessionCollection.deleteMany({ userId: user._id });

    const session = createSession(); // Генеруємо сесію

    await SessionCollection.create({
        userId: user._id,
        accessToken: session.accessToken,
        accessTokenValidUntil: session.accessTokenValidUntil,
        refreshToken: session.refreshToken,
        refreshTokenValidUntil: session.refreshTokenValidUntil,
    });

    return session;
};

const createSession = () => {
    const accessToken = crypto.randomBytes(30).toString('hex');
    const refreshToken = crypto.randomBytes(30).toString('hex');
    return {
      accessToken,
      refreshToken,
      accessTokenValidUntil: new Date(Date.now() + ONE_DAY),
      refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
    };
};

  

export const refreshSession = async ({ refreshToken }) => {
   return await crypto.randomBytes(30).toString('hex');
};


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