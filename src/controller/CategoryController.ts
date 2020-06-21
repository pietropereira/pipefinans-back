import { BaseController } from "../bases/BaseController";
import { Request } from "express";
import { Category } from "../entity/Category";
import { getRepository } from "typeorm";
import { Entry } from "../entity/Entry";

export class CategoryController extends BaseController<Category> {



    constructor() {
        super(Category);
    }

    save(request: Request) {
        let _category = <Category>request.body;
        const _user = request.userAuth.uid;
        
        _category.createBy = _user;
        this.isRequired("O nome da categoria é obrigatório", _category.name);
        this.isRequired("A descrição da categoria é obrigatória", _category.description);

        return super.save(_category);
    }


}