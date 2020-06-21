import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import { BaseEntity } from "../bases/BaseEntity";

@Entity()
export class User extends BaseEntity {

    @Column({type: "varchar", length: 50})
    firstName: string;

    @Column({type: "varchar", length: 50})
    lastName: string;

    @Column({type: "date"})
    birthDate: Date;

    @Column({type: "varchar", length: 50, unique: true})
    email: string;

    @Column({type: "varchar"})
    password: string;

    @Column({default: false})
    isRoot: boolean;

}
