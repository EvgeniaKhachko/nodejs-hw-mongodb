import { SessionCollection } from "../models/session.js";
import { registerUser ,loginUser, logoutUser ,refreshSession } from "../services/users.js";
import createHttpError from "http-errors";

export const registerUserController = async (req, res, next ) => {

try {
    const newUser = await registerUser(req.body);
    res.status(201).json({
        status: 201,
        message: "Successfully registered a user!",
        data: newUser
        // data: {
        //     id: newUser._id,
        //     name: newUser.name,
        //     email: newUser.email,
        // },
});
} catch (error) {
    next(error);
  }
};


export const loginUserController = async (req, res, next) => {
  try {
      const session = await loginUser(req.body);
      res.cookie ('sessionToken', session.refreshToken,{
        httpOnly: true,
        expires: session.refreshTokenValidUntil,
      
      });
      res.cookie ('sessionId', session._id,{
        httpOnly: true,
        expires: session.refreshTokenValidUntil,
    
      });

      res.status(200).json({
          status: 200,
          message: "Successfully logged in a user!",
          data: {
            accessToken: session.accessToken,
          }
      });
  } catch (error) {
      next(error);
  }
};

export const refreshSessionController = async (req, res) => {
  try {
      // Отримуємо sessionId та sessionToken з кук
      const { sessionId, sessionToken } = req.cookies;
      // Якщо куки не передано
      if (!sessionId || !sessionToken) {
          return res.status(400).json({ message: 'Missing session ID or token in cookies' });
      } 
      const { accessToken, sessionId: newSessionId } = await refreshSession({ sessionId, sessionToken });
      
      // Відповідь після успішного оновлення сесії
      res.status(200).json({
          status: '200',
          message: 'Successfully refreshed a session!',
          data: {
            accessToken,
            sessionId: newSessionId
          }
      });
  } catch (error) {
      console.error('Error refreshing session:', error);
      res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
  res.send();
};


export const logoutUserController = async (req, res, next) => {
  try {
      // Отримуємо сесійні дані з кукі
      const { sessionId, sessionToken } = req.cookies;

      if (!sessionId || !sessionToken) {
          return res.status(400).json({ message: "Session not found" });
      }

      // Викликаємо функцію видалення сесії
      await logoutUser({ sessionId, sessionToken });

      // Очищаємо кукі
      res.clearCookie("sessionToken");
      res.clearCookie("sessionId");

      // Відправляємо відповідь без тіла (204 No Content)
      res.status(204).send();
  } catch (error) {
      next(error);
  }
};
