import {Entity, JoinColumn, Column, Unique, ManyToOne, PrimaryColumn} from "typeorm";
import {User} from "./User";
import {Movie} from "./Movie";

@Entity()
export class Rating{
    @PrimaryColumn()
    userId: number;

    @PrimaryColumn()
    movieId: number;

    @Column({type: 'int'})
    rating: number;

    @ManyToOne(() => User, (usr: User) => usr.ratings)
    @JoinColumn({name: 'userId'})
    user!: User;

    @ManyToOne(() => Movie, (mv: Movie) => mv.ratings)
    @JoinColumn({name: 'movieId'})
    movie!: Movie;
}
