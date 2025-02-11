import createHttpError from "http-errors";
import { SessionCollection } from "../models/session.js";
import {User} from "../models/user.js";

export const authenticate = async(req, res, next) => {
    const authHeader = req.get('Authorization');

    try {
        if (!authHeader) {
            return next(createHttpError(401, 'No Authorization header provided'));
        }
    const [bearer, token] = authHeader.split(' ');

    if(bearer !== 'Bearer'){
        throw new createHttpError (401, 'Authorization header should be of Bearer type');
    }
     if (!token) {
            return next(createHttpError(401, 'No access token provided'));
        }       
    const session = await SessionCollection.findOne({accessToken: token});
    if(!session) {
        return next(createHttpError(401, 'No active session found'));
    }

    if (session.accessTokenValidUntil < new Date()){
        return next(createHttpError(401, 'Access token expired')); 
    }
    const user = await User.findById(session.userId);
    if(!user) {
        await SessionCollection.findByIdAndDelete(session._id);
        return next(createHttpError(401, 'No user found for such session'));
    }
    req.user = user;
    next();
} catch (err){
    next(err);
}
};