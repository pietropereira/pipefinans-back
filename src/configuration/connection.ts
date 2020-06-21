import { createConnection } from "typeorm";
import { User } from "../entity/User";
import { Category } from "../entity/Category";
import { Entry } from "../entity/Entry";

const cfg = require("../../ormconfig.json");

export default {
    createConnection: async () => {
        await createConnection(
            {
                type: cfg.type,
                host: cfg.host,
                port: cfg.port,
                username: cfg.username,
                password: cfg.password,
                database: cfg.database,
                synchronize: true,
                logging: false,
                entities: [
                    User,
                    Category,
                    Entry,
                ]
            }
        );
        
        console.log('Database connected');
    }
}