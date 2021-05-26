import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    JoinTable,
    OneToMany
} from "typeorm";
import {Actor} from "./Actor";
import {Rating} from "./Rating";


@Entity()
export class Movie {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 320})
    title: string;

    @Column({type: 'text'})
    synopsis: string;

    @Column({type: 'varchar', length: 320})
    director: string

    @Column({type: 'varchar', length: 30})
    genre: string

    @ManyToMany(() => Actor, (act) => act.movies)
    @JoinTable()
    actors: Actor[];

    @OneToMany(() => Rating, (rt: Rating) => rt.movie)
    ratings: Rating[];
}
