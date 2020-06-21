import { Entity, Column, ManyToOne } from "typeorm";
import { EntryType } from "../enums/EntryType";
import { User } from "./User";
import { Category } from "./Category";
import { BaseEntity } from "../bases/BaseEntity";

@Entity()
export class Entry extends BaseEntity {

    @Column({type: "varchar", length: 50})
    name: string;

    @Column({type: "varchar", length: 200})
    description: string;

    @Column({type: "double"})
    amount: number;

    @Column()
    type: EntryType;

    @Column()
    paid: boolean;

    // @Column({type: "varchar", length: 20})
    // date: string;

    // @Column({type: "int"})
    // month: number;

    // @Column({type: "int"})
    // year: number;
    @Column({type: "date"})
    date: Date;

    @ManyToOne(() => User, {eager: true})
    user: User;

    @ManyToOne(() => Category, {eager: true})
    category: Category;
}