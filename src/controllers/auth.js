
import { registerUser ,loginUser, logoutUser ,refreshSession } from "../services/auth.js";
import createHttpError from "http-errors";



export const registerUserController = async (req, res, next) => {

try {
    const newUser = await registerUser(req.body);
    res.status(201).json({
        status: 201,
        message: "Successfully registered a user!",
        data: newUser
    });
} catch (error) {
    next(error);
  }
};

export const loginUserController = async (req, res, next) => {
  try {
      const session = await loginUser(req.body);

      res.cookie ('refreshToken', session.refreshToken,{
        httpOnly: true,
        expires: new Date(session.refreshTokenValidUntil),
       
      });
        
      res.cookie ('sessionId', String(session._id),{
        httpOnly: true,
        expires: new Date(session.refreshTokenValidUntil),
    
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

      const newAccessToken = await refreshSession({
        sessionId: req.cookies.sessionId,
        refreshToken: req.cookies.refreshToken,
      });
    
      res.status(200).json({
          status: 200,
          message: 'Session refreshed successfully!',
          data: { accessToken: newAccessToken }
      });

};

export const logoutUserController = async (req, res, next) => {
  try {
    const sessionId = req.cookies?.sessionId;

    if (sessionId) {
      await logoutUser(sessionId);
    }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
} catch (error) {
  next(error); 
}

};
