import "reflect-metadata";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import { Request, Response } from "express";
import { Routes } from "./routes";
import config from "./configuration/config";
import auth from "./middlaware/auth";
import connection from "./configuration/connection";


const app = express();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());
app.use(auth);

Routes.forEach(route => {
    (app as any)[route.method](route.route, (request: Request, response: Response, next: Function) => {
        const result = (new (route.controller as any))[route.action](request, response, next);
        if (result instanceof Promise) {
            result.then(d => {
                if (d && d.status)
                    response.status(d.status).send(d.message || d.errors);
                else {
                    response.json(d);
                }
            });
        } else if (result !== null && result !== undefined) {
            response.json(result);
        }
    });
});

app.listen(config.port, '0.0.0.0', async () => {
    console.log(`Api initialize in port ${config.port}`);
    try {
        await connection.createConnection();
    }
    catch (error) {
        console.error('Data base not connected', error);
    }
});