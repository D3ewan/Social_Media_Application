import jwt, { JwtHeader, JwtPayload } from 'jsonwebtoken';
import { error } from '../utils/responseWrapper';
import { Request, Response, NextFunction } from 'express';
// import User from '../models/User';
import {z} from "zod";
interface newRequest extends Request {
    _id?: string;
}

const jwtPayloadSchema = z.object({
    _id: z.string(),
    // Add more properties if necessary
});
export default async (req: newRequest, res: Response, next: NextFunction) => {
    if (!req.headers || !req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        return res.send(error(401, 'Authorization header is required'))
    }
    const accessToken = req.headers.authorization.split(' ')[1];
    try {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_PRIVATE_KEY);
        const decodedData = jwtPayloadSchema.parse(decoded);
        req._id = decodedData._id;

        const user = await User.findById(req._id);
        if (!user) {
            return res.send(error(404, 'user not found'));
        }
        next();
    } catch (e) {
        console.error({ message: e.message });
        return res.send(error(401, 'invalid access key'))
    }
}


