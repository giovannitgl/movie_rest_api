import {Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany} from "typeorm";
import {Rating} from "./Rating";

export enum UserTypes {
    Admin,
    User,
}

@Entity()
@Unique(['email'])
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 320})
    email: string;

    @Column({type: 'varchar', length: 64})
    password: string;

    @Column({type: 'varchar', length: 100})
    firstName: string;

    @Column({type: 'varchar', length: 100})
    lastName: string;

    @Column('int')
    age: number;

    @Column('int')
    type: UserTypes;

    @Column('bool', {default: true})
    active: boolean;

    @OneToMany(() => Rating, (rt: Rating) => rt.user )
    ratings: Rating[];
}
