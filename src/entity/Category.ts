import { BaseEntity } from "../bases/BaseEntity";
import { Entity, Column } from "typeorm";

@Entity()
export class Category extends BaseEntity {

    @Column({type: "varchar", length: 50})
    name: string;
    
    @Column({type: "varchar", length: 50})
    description: string;

    @Column({type: "varchar", length: 36})
    createBy: string;
}