import { Request, Response } from "express";
import { Users, IUserAttributes } from "../models";
import bcrypt from "bcrypt";
import njwt, { Jwt } from "njwt";
import { IResponsePayload } from "../interfaces";

/**
 *
 * @param tokenData , data to be encoded in token
 * @returns token
 */
const encodeToken = (tokenData: { email: string }) => {
  const APP_SECRET = process.env.APP_SECRET;
  return njwt.create(tokenData, APP_SECRET).compact();
};

/**
 *
 * @param token , access token to be decoded
 * @returns decoded token or undefined when the token is invalid or expired
 */
export const decodeToken = (
  token: string
): { email: string; exp: number } | undefined => {
  const APP_SECRET = process.env.APP_SECRET;
  let decodedToken: Jwt | undefined;
  try {
    decodedToken = njwt.verify(token, APP_SECRET);
  } catch (err) {
    return undefined;
  }
  decodedToken?.setExpiration(new Date().getTime() + 3600000).body; //1 hour
  return decodedToken?.body as { email: string; exp: number } | undefined;
};

/**
 * @description register user to the platform
 * @param req express request
 * @param res express response
 * @returns express json response
 */
export const register = async (req: Request, res: Response) => {
  const { email, firstName, lastName, password } = (req.body ||
    {}) as IUserAttributes;
  if (!email || !firstName || !lastName || !password) {
    return res
      .status(400)
      .send({ success: false, error: "Bad Request, missing parameters" });
  }
  const isUserExist = await Users.findOne({ where: { email } });
  if (!isUserExist) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const access_token = encodeToken({ email });
    try {
      await Users.create({
        email,
        firstName,
        lastName,
        password: hashedPassword,
      });
      return res.status(200).json({ success: true, data: { access_token } });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, error: "Internal Server Error" });
    }
  }
  return res.status(422).json({ success: false, error: "User already exist" });
};

type TLoginData = IUserAttributes & {
  access_token: string;
};
/**
 * @description login user to the platform
 * @param req express request
 * @param res express response
 * @returns express json response
 */
export const login = async (
  req: Request,
  res: Response<IResponsePayload<TLoginData>>
) => {
  const { email, password } = req.body;

  const userObject = await Users.findOne({
    where: { email },
  });

  if (userObject === null) {
    return res
      .status(200)
      .json({ message: "User not found", success: false, status: 404 });
  } else {
    bcrypt.compare(password, userObject.password, (err, result) => {
      if (result) {
        const access_token = encodeToken({ email: userObject.email });
        const { password, ...rest } = userObject.get();
        return res.status(200).json({
          success: true,
          data: { ...rest, access_token },
          status: 200,
          message: "User Logged in successfully",
        });
      } else {
        return res.status(401).json({
          message: "Incorrect Email or Password",
          success: false,
          status: 401,
        });
      }
    });
  }
};
