import * as typeorm from 'typeorm';
import {ErrorHandler} from "../src/middleware/ErrorMiddleware";
import MovieController from "../src/controller/MovieController";
import {MovieCreateDTO, MovieFilterDTO, RateCreateDTO, RateRequestDTO} from "../src/dto/MovieDTO";

(typeorm as any).getRepository = jest.fn();


describe('Movie Controller', () => {
    let controller: MovieController;
    beforeEach(() => {
        controller = new MovieController();
    })

    describe('Movie Register', () => {
        it('Success', async () => {
            const movieData: MovieCreateDTO = {
                title: 'A movie',
                synopsis: 'The movie is about testing software',
                director: 'T. Est',
                genre: 'Programming',
                actors: ['T. Est Jr., T. Est #2']
            };
            (typeorm as any).getRepository.mockReturnValue({
                findOne: () => Promise.resolve({...movieData, id: 0}),
                save: () => Promise.resolve({...movieData, id: 0}),
            })
            const user = await controller.registerMovie(movieData)
            expect(user).toBeDefined()
        })
        it('Failure: data validation fail', async () => {
            const movieData = {
                title: 'A movie',
                synopsis: 'The movie is about testing software',
                director: 'T. Est',
                genre: 1,
                actors: 2,
            };
            try{
                await controller.registerMovie(movieData as any)

            } catch (err) {
                const statusCode = err.statusCode
                expect(err).toBeInstanceOf(ErrorHandler)
                expect(statusCode).toBe(400)

            }
        })
    })

    describe('Movie Get Detail', () => {
        it('Success', async () => {
            const movieData: MovieCreateDTO = {
                title: 'A movie',
                synopsis: 'The movie is about testing software',
                director: 'T. Est',
                genre: 'Programming',
                actors: ['T. Est Jr., T. Est #2']
            };
            (typeorm as any).getRepository.mockReturnValue({
                findOne: () => Promise.resolve({...movieData, id: 0}),
                query: () => Promise.resolve([{'avg': '2.000'}])
            })
            const user = await controller.getMovieDetails(0)
            expect(user).toBeDefined()
        })
        it('Failure: not found', async () => {
            (typeorm as any).getRepository.mockReturnValue({
                findOne: () => Promise.resolve()
            })
            try {
                await controller.getMovieDetails(0)
            } catch (err) {
                expect(err.statusCode).toBe(404)
            }
        })
        it('Failure: bad id', async () => {
            try {
                const user = await controller.getMovieDetails(parseInt('a'))
            } catch (err) {
                expect(err.statusCode).toBe(400)
            }
        })
    })

    describe('Movie List', () => {
        it('Success', async () => {
            const movieData: MovieCreateDTO = {
                title: 'A movie',
                synopsis: 'The movie is about testing software',
                director: 'T. Est',
                genre: 'Programming',
                actors: ['T. Est Jr., T. Est #2']
            };
            const filter: MovieFilterDTO = {
                page: 0,
                entries: 10
            };

            (typeorm as any).getRepository.mockReturnValue({
                find: () => Promise.resolve([{...movieData, id: 0}]),
            })
            const user = await controller.listMovies(filter)
            expect(user).toBeDefined()
        })
        it('Failure: bad filter', async () => {
            const filter = {
                page: 'a',
                entries: 10
            };
            try {
                await controller.listMovies(filter as any)
            } catch (err) {
                expect(err.statusCode).toBe(400)
            }
        })
    })

    describe('Movie Rating', () => {
        it('Success', async () => {
            const userData: any = {
                firstName: 'test',
                lastName: 'user',
                password: 'ABC',
                email: 'test@user.abc',
                age: 100
            };
            const movieData: MovieCreateDTO = {
                title: 'A movie',
                synopsis: 'The movie is about testing software',
                director: 'T. Est',
                genre: 'Programming',
                actors: ['T. Est Jr., T. Est #2']
            };
            const rating: RateRequestDTO = {
                rating: 0
            };
            (typeorm as any).getRepository.mockReturnValue({
                findOne: () => Promise.resolve([{...movieData, id: 0}]),
                save: () => Promise.resolve({rating})
            })

            const rate = await controller.registerRate(1, rating, userData)
            expect(rate).toBeDefined()
        })
        it('Failure: data validation fail', async () => {
            const userData: any = {
                firstName: 'test',
                lastName: 'user',
                password: 'ABC',
                email: 'test@user.abc',
                age: 100
            };
            const rating: RateRequestDTO = {
                rating: 0
            };
            try {
                await controller.registerRate(1, rating, userData)
            } catch (err) {
                expect(err.statusCode).toBe(400)
            }
        })
        it('Failure: movie not found', async () => {
            const userData: any = {
                firstName: 'test',
                lastName: 'user',
                password: 'ABC',
                email: 'test@user.abc',
                age: 100
            };
            const rating: RateRequestDTO = {
                rating: 0
            };
            (typeorm as any).getRepository.mockReturnValue({
                findOne: () => Promise.resolve()
            })
            try {
                await controller.registerRate(1, rating, userData)
            } catch (err) {
                expect(err.statusCode).toBe(404)
            }
        })
    })
})