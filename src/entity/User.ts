import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import { BaseEntity } from "../bases/BaseEntity";

@Entity()
export class User extends BaseEntity {

    @Column({type: "varchar", length: 50})
    nickName: string;

    @Column({type: "varchar", length: 50, unique: true})
    email: string;

    @Column({type: "varchar"})
    password: string;

    @Column({default: false})
    isRoot: boolean;
}
