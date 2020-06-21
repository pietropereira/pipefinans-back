import {Response, Request} from "express";
import {verify} from "jsonwebtoken";
import config from "../configuration/config";
import { Repository, getRepository } from "typeorm";

export default async(request: Request, response: Response, next: Function) => {

    const token = request.body.token || request.query.token  || request.headers['x-token-access'];
    const publicRoutes = <Array<String>>config.publicRoutes;
    let isPublicRoute: boolean = false;

    publicRoutes.forEach(url => {
        let isPublic = request.url.includes(url);
        if(isPublic) {
            isPublicRoute = true;
        }
    });


    if(isPublicRoute) {
        next();
    } else {
        if(token) {
            try {
                let _userAuth = verify(token, config.secretyKey);
                request.userAuth = _userAuth;

                next();

            } catch(error) {
                response.status(401).send({message: "Token informado é inválido!"});
            }
        } else {
            response.status(401).send({message: "Para acessar esse recurso você precisa estar autenticadado"});
            return;
        }
    }
}