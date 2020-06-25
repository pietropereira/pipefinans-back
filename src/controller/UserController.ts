import { getRepository } from "typeorm";
import { Request } from "express";
import { User } from "../entity/User";
import { BaseController } from "../bases/BaseController";
import { sign } from 'jsonwebtoken';
import config from "../configuration/config";
import * as bcrypt from "bcryptjs";
import * as  nodemailer from 'nodemailer';
import * as crypto from 'crypto';

export class UserController extends BaseController<User> {

    constructor() {
        super(User);
    }

    all(request: Request) {
        const _user = request.userAuth.uid;
        return this.repository.find({ where: { deleted: false, uid: _user } });
    }

    async auth(request: Request) {

        let { email, password } = request.body;
        if (!email || !password) {
            return { status: 400, message: "Informe o e-mail e senha para efetuar o login" };
        }

        let check_user = await this.repository.findOne({email: email});
        
        let checkPassword = bcrypt.compareSync(password, check_user.password);
        if (checkPassword) {
            password = check_user.password;
        }

        let user = await this.repository.findOne({ email: email, password: password, deleted: false });
        if (user) {
            let _payload = {
                uid: user.uid,
                email: user.email,
            }
            return {
                status: 200,
                message: {
                    // user: _payload,
                    message: 'Autenticado com sucesso!',
                    token: sign({
                        ..._payload,
                        tm: new Date().getTime()
                    }, config.secretyKey)
                }

            };

        } else {
            return { status: 404, message: "E-mail ou senha inválidos" }
        }

    }


    async createUser(request: Request) {
        let { nickName, email, password, confirmPassword } = request.body;
        super.isRequired(nickName, 'Informe seu nome');
        super.isRequired(email, 'Informe seu e-mail');
        super.isRequired(password, 'Informe a senha');
        super.isRequired(confirmPassword, 'Informe a confirmação da senha');

        let _user = new User();
        _user.nickName = nickName;

        const _email = await this.repository.findOne({email: email});

        if(_email){
            return { status: 404, errors: ['O E-mail já está cadastrado']}
        }

        _user.email = email;

        if (password !== confirmPassword) {
            return { status: 404, errors: ['A senha e a confirmação são diferentes'] }
        }

        if (password) {
            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(password, salt);
            _user.password = hash;
        }

        return await super.save(_user);
    }

    async save(request: Request) {
        let _user = <User>request.body;

        super.isRequired(_user.nickName, 'Nome é obrigatório');
        super.isRequired(_user.email, 'Email é obrigatório');

        return await super.save(_user);
    }

    async changePassword(request: Request) {
        const userId = request.userAuth.uid;
        const { currentPassword, newPassword, confirmNewPassword } = request.body;
        this.isRequired(currentPassword, 'A senha atual é obrigatória');
        this.isRequired(newPassword, 'A nova senha é obrigatória');
        this.isRequired(confirmNewPassword, 'A confirmação da nova senha é obrigatória');
        this.isTrue(newPassword != confirmNewPassword, 'A senha e a confirmação de senha não são iguais');

        if (!this.valid()) {
            return {
                status: 400,
                errors: this.allNotifications
            }
        }

        const _user = await this.repository.findOne({where: {uid: userId}});
        const comparePass = bcrypt.compareSync(currentPassword, _user.password);
        if (comparePass) {
            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(newPassword, salt);
            _user.password = hash;
            this.repository.save(_user);
        }
        else {
            return { status: 404, message: 'Erro ao salvar a senha' };
        }
        
    }

    async forgotPassword(request: Request) {
        const { email } = request.body;
        const _user = await this.repository.findOne({ where: { deleted: false, email: email } });   
        try {
            if (_user.email) {

                const transporter = nodemailer.createTransport({
                    host: "smtp-mail.outlook.com",
                    secureConnection: false,
                    port: 587,
                    tls: {
                        ciphers:'SSLv3'
                     },
                    auth: {
                        user: config.email,
                        pass: config.pass
                    }
                });
    
                const newPassword = crypto.randomBytes(6).toString('HEX');

                transporter.sendMail({
                    from: 'Adminstrador <contato.pipe@outlook.com>',
                    to: email,
                    subject: 'PiPe - Finanças Pessoais',
                    html: `<p>Olá ${_user.nickName}, sua nova senha é: <strong>${newPassword}</strong>. Recomendamos que altere após acessar o sistema novamente.</p>
                    <br/><a href="google.com">Google</a>`
    
                }).then( async () => {
    
                    let salt = bcrypt.genSaltSync(10);
                    let hash = bcrypt.hashSync(newPassword, salt);
    
                    _user.password = hash;
                    return await super.save(_user);
                    
    
                }).then(() => {return {status: 202, message: 'Email enviado!'}})
                .catch(() => {return {status: 404, errors: 'Email não enviado!'}});
            }
    
        }catch(error) {
            return { status: 404, errors: ['Email não encontrado']}
        }
       
    }
}