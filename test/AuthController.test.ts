import * as typeorm from 'typeorm';
import {ErrorHandler} from "../src/middleware/ErrorMiddleware";
import {User, UserTypes} from "../src/entity/User";
import AuthController from "../src/controller/AuthController";
import {AuthRequestDTO} from "../src/dto/AuthDTO";

(typeorm as any).getRepository = jest.fn();


describe('Auth Controller', () => {
    let controller: AuthController;
    beforeEach(() => {
        controller = new AuthController();
    })

    describe('Authenticate', () => {
        it('Success', async () => {
            const authData: AuthRequestDTO = {
                email: 'test@user.abc',
                password: 'testpwd'
            };
            (typeorm as any).getRepository.mockReturnValue({
                findOne: () => Promise.resolve({...authData, id: 0}),
            })
            const user = await controller.authenticate(authData)
            expect(user).toBeDefined()
        })
        it('Failure: not found', async () => {
            const authData: any = {
                email: 'test@user.abc',
                password: 'testpwd'
            };
            (typeorm as any).getRepository.mockReturnValue({
                findOne: () => Promise.resolve()
            })
            try{
                await controller.authenticate(authData)
            } catch (err) {
                const statusCode = err.statusCode
                expect(err).toBeInstanceOf(ErrorHandler)
                expect(statusCode).toBe(404)

            }
        })
        it('Failure: data validation fail', async () => {
            const authData: any = {
                email: 'test@user.abc',
                password: 123
            };
            try{
                await controller.authenticate(authData)
            } catch (err) {
                const statusCode = err.statusCode
                expect(err).toBeInstanceOf(ErrorHandler)
                expect(statusCode).toBe(400)

            }
        })
    })

})