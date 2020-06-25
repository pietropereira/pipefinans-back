import { BaseController } from "../bases/BaseController";
import { Entry } from "../entity/Entry";
import { Request } from "express";

export class EntryController extends BaseController<Entry> {

    constructor() {
        super(Entry);
    }

    save(request: Request) {

        let _entry = <Entry>request.body;
        const _user = request.userAuth.uid;
        _entry.user = _user;

        this.isRequired('O nome da despesa é obrigatório', _entry.name);
        this.isRequired('A descriação da despesa é obrigatória', _entry.description);
        this.isRequired('O tipo da despesa é obrigatório', _entry.type);
        this.isRequired('Informe se está paga ou pendente', _entry.paid);
        this.isRequired('Data de criação é obrigatória', _entry.date);
        this.isRequired('Categoria ', _entry.category);

        return super.save(_entry);
    }

    async getAll(request: Request) {
        const _user = request.userAuth.uid;
        const allEntries = (await this._repository.find({ where: { deleted: false, user: _user}})).filter(x => x.category.deleted === false);
        return allEntries;
    }

}