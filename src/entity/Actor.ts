import {Entity, PrimaryGeneratedColumn, Column, Unique, ManyToMany, JoinTable} from "typeorm";
import {Movie} from "./Movie";

@Entity()
@Unique(['name'])
export class Actor{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 320})
    name: string;

    @ManyToMany(() => Movie, (mov) => mov.actors)
    @JoinTable()
    movies: Movie[];
}
