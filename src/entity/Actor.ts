import {Entity, PrimaryGeneratedColumn, Column, Unique} from "typeorm";

@Entity()
@Unique(['name'])
export class Actor{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 320})
    name: string;
}
