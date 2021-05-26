import * as typeorm from 'typeorm';
import {UserCreateDTO} from "../src/dto/UserDTO";
import UserController from "../src/controller/UserController";
import {ErrorHandler} from "../src/middleware/ErrorMiddleware";
import {User, UserTypes} from "../src/entity/User";

(typeorm as any).getRepository = jest.fn();


describe('User Controller', () => {
    let controller: UserController;
    beforeEach(() => {
        controller = new UserController();
    })

    describe('User Register', () => {
        it('Success', async () => {
            const userData: UserCreateDTO = {
                firstName: 'test',
                lastName: 'user',
                password: 'ABC',
                email: 'test@user.abc',
                age: 100
            };
            (typeorm as any).getRepository.mockReturnValue({
                findOne: () => Promise.resolve({...userData, id: 0}),
                save: () => Promise.resolve({...userData, id: 0}),
            })
            const user = await controller.registerUser(userData)
            expect(user).toBeDefined()
        })
        it('Failure: data validation fail', async () => {
            const userData: any = {
                firstName: 'test',
                lastName: 'user',
                password: 'ABC',
                email: 'test@user.abc',
                age: '1a0',
            };
            try{
                await controller.registerUser(userData)

            } catch (err) {
                const statusCode = err.statusCode
                expect(err).toBeInstanceOf(ErrorHandler)
                expect(statusCode).toBe(400)

            }
        })
        it('Failure: User already exists', async () => {
            const userData: any = {
                firstName: 'test',
                lastName: 'user',
                password: 'ABC',
                email: 'test@user.abc',
                age: 100,
            };
            (typeorm as any).getRepository.mockReturnValue({
                save: () => Promise.reject(new Error('unique constraint')),
            })
            try{
                await controller.registerUser(userData)

            } catch (err) {
                const statusCode = err.statusCode
                const message = err.message
                expect(err).toBeInstanceOf(ErrorHandler)
                expect(statusCode).toBe(400)
                expect(message).toBe("User already exists.")

            }
        })
        it('Failure: unexpected', async () => {
            const userData: any = {
                firstName: 'test',
                lastName: 'user',
                password: 'ABC',
                email: 'test@user.abc',
                age: 100,
            };
            (typeorm as any).getRepository.mockReturnValue({
                save: () => Promise.reject(new Error('unexpected')),
            })
            try{
                await controller.registerUser(userData)

            } catch (err) {
                const statusCode = err.statusCode
                expect(err).toBeInstanceOf(ErrorHandler)
                expect(statusCode).toBe(500)

            }
        })
    })

    describe('User Get', () => {
        it('Success', async () => {
            const userData: UserCreateDTO = {
                firstName: 'test',
                lastName: 'user',
                password: 'ABC',
                email: 'test@user.abc',
                age: 100
            };
            (typeorm as any).getRepository.mockReturnValue({
                findOne: () => Promise.resolve({...userData, id: 0}),
            })
            const user = await controller.getUser(0)
            expect(user).toBeDefined()
        })
        it('Failure: bad id', async () => {
            try {
                await controller.getUser(parseInt('a'))
            } catch (err) {
                expect(err.statusCode).toBe(400)
            }
        })
        it('Failure: not found', async () => {
            const userData: UserCreateDTO = {
                firstName: 'test',
                lastName: 'user',
                password: 'ABC',
                email: 'test@user.abc',
                age: 100
            };
            (typeorm as any).getRepository.mockReturnValue({
                findOne: () => Promise.resolve()
            })
            try {
                const user = await controller.getUser(0)
            } catch (err) {
                expect(err.statusCode).toBe(404)

            }
        })
    })

    describe('User delete', () => {
        it('Success', async () => {
            const reqUser = {
                id: 1,
                type: UserTypes.User,
            };
            (typeorm as any).getRepository.mockReturnValue({
                findOne: () => Promise.resolve({reqUser}),
                update: () => Promise.resolve({reqUser})
            })
            const res = await controller.deleteUser(1, reqUser as User)
            expect(res).toBe(true)
        })
        it ('Failure: Unauthorized delete', async () => {
            const reqUser = {
                id: 1,
                type: UserTypes.User,
            };
            try {
                await controller.deleteUser(2, reqUser as User)
            } catch (err) {
                expect(err.statusCode).toBe(401)
            }
        })
        it ('Failure: not found', async () => {
            const reqUser = {
                id: 1,
                type: UserTypes.User,
            };
            (typeorm as any).getRepository.mockReturnValue({
                findOne: () => Promise.resolve()
            })
            try {
                await controller.deleteUser(1, reqUser as User)
            } catch (err) {
                expect(err.statusCode).toBe(404)
            }
        })
    })

    describe('User Update', () => {
        it('Success', async () => {
            const userData: UserCreateDTO = {
                firstName: 'test',
                lastName: 'user',
                password: 'ABC',
                email: 'test@user.abc',
                age: 100
            };
            const reqUser = {...userData, id: 1, type: UserTypes.User} as User;
            (typeorm as any).getRepository.mockReturnValue({
                findOne: () => Promise.resolve({...userData, id: 0}),
                update: () => Promise.resolve({...userData, id: 0}),
            })
            const user = await controller.updateUser(1, userData, reqUser)
            expect(user).toBeDefined()
        })
        it('Failure: data validation fail', async () => {
            const userData: any = {
                firstName: 'test',
                lastName: 'user',
                password: 'ABC',
                email: 'test@user.abc',
                age: '1a0',
            };
            const reqUser = {...userData, id: 1, type: UserTypes.User} as User;
            try{
                await controller.updateUser(1, userData, reqUser)

            } catch (err) {
                const statusCode = err.statusCode
                expect(err).toBeInstanceOf(ErrorHandler)
                expect(statusCode).toBe(400)

            }
        })
        it('Failure: User not found', async () => {
            const userData: any = {
                firstName: 'test',
                lastName: 'user',
                password: 'ABC',
                email: 'test@user.abc',
                age: 100,
            };
            const reqUser = {...userData, id: 1, type: UserTypes.User} as User;
            (typeorm as any).getRepository.mockReturnValue({
                findOne: () => Promise.resolve()
            })
            try{
                await controller.updateUser(1, userData, reqUser)

            } catch (err) {
                const statusCode = err.statusCode
                const message = err.message
                expect(err).toBeInstanceOf(ErrorHandler)
                expect(statusCode).toBe(404)

            }
        })
        it('Failure: unauthorized action', async () => {
            const userData: any = {
                firstName: 'test',
                lastName: 'user',
                password: 'ABC',
                email: 'test@user.abc',
                age: 100,
            };
            const reqUser = {...userData, id: 1, type: UserTypes.User} as User;
            (typeorm as any).getRepository.mockReturnValue({
                save: () => Promise.reject(new Error('unexpected')),
            })
            try{
                await controller.updateUser(2, userData, reqUser)

            } catch (err) {
                const statusCode = err.statusCode
                expect(err).toBeInstanceOf(ErrorHandler)
                expect(statusCode).toBe(401)

            }
        })
    })
})