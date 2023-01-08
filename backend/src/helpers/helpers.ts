import bcrypt from "bcrypt"
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import fs from 'fs'
import global from "../@types/expressRequest"
class HelperController{
    async encryptPassword(password: string){
        let encrypt_password: any = bcrypt.hashSync(password,5);
        return encrypt_password;
    }
    async comparepassword(password: string, hash_password: string){
        return bcrypt.compareSync(password, hash_password);
    }
    async validate(req: Request, res: Response, next: NextFunction){
        try {
          if (!req.headers.authorization) {
            return res.status(200).send({
              status: false,
              message: "Access token is missing! Please login.",
              error: {},
            });
          }
          const token: any = req.headers.authorization.split(" ")[1];
          if (!token) {
            return res.status(200).send({
              status: false,
              message: "Access token is missing! Please login.",
              error: {},
            });
          }
          const secretKey: any = process.env.JWT_SECRET_KEY;
          const data: any = jwt.verify(token, secretKey);
          if (Date.now() >= data.exp * 1000) {
            return res.status(200).send({
              status: false,
              message: "Access token is expired.",
              error: {},
            });
          }
          //Saving User data in Request for further use
          req.user = {
            email: data.email,
            id: data.id,
            name: data.name
          };
          return next();
        } catch (error: any) {
            if(error?.name === "TokenExpiredError") {
                return res.status(401).send({
                    status: false,
                    message: "Access token is expired.",
                    error: {}
                }) 
            }
            return res.status(500).send({
                status: false,
                message: "Something went wrong! Please try again later.",
                error: {}
            }) 
        }
    }
    async fileRemoved(filepath: string){
        fs.unlink(filepath, (err)=>{
            if(err){
                console.log("Image removed failed.");  
            }
        })
    }

}
export default new HelperController();