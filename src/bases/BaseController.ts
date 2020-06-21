import { BaseNotification } from "./BaseNotification";
import { Repository, getRepository } from "typeorm";
import { Request } from "express";

export abstract class BaseController<T> extends BaseNotification {

    protected _repository: Repository<T>


    constructor(entity: any, onlyRoot: boolean = false) {
        super();
        this._repository = getRepository<T>(entity);
    }


    async all(request: Request) {

        const getAll = await this._repository.find({ where: { deleted: false, createBy: request.userAuth.uid }});
        return getAll;
    }

    async one(request: Request) {
        
        const _uid = await request.params.id as string;
        return this._repository.findOne(_uid, {where: {deleted: false, createBy: request.userAuth.uid }});
    }

    async save(model: any) {
        
        if (model.uid) {
            delete model['deleted'];
            delete model['createAt'];
            delete model['updateAt'];

            let _modelInDB = await this._repository.findOne(model.uid);
            if (_modelInDB) {
                Object.assign(_modelInDB, model);
            }
        }

        if (this.valid())
            return this._repository.save(model);
        else {
            return {
                status: 400,
                errors: this.allNotifications
            }
        }
    }

    async remove(request: Request) {
        let uid = request.params.id;
        let model: any = await this._repository.findOne(uid, {where: {deleted: false}});
        if (model) {
            model.deleted = true;
            return this._repository.save(model);
        } else {
            return {
                status: 400,
                errors: [
                    "Item não encontrado!"
                ]
            }
        }
    }

    get repository(): Repository<T> {
        return this._repository;
    }
}