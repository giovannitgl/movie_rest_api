import * as typeorm from 'typeorm';
import {ErrorHandler} from "../src/middleware/ErrorMiddleware";
import AuthController from "../src/controller/AuthController";
import {AuthRequestDTO} from "../src/dto/AuthDTO";
import * as bcrypt from 'bcrypt'
import {hashPassword} from "../src/shared/auth";

(typeorm as any).getRepository = jest.fn();


describe('Auth Controller', () => {
    let controller: AuthController;
    beforeEach(() => {
        controller = new AuthController();
    })

    describe('Authenticate', () => {
        it('Success', async () => {
            const usrPwd = 'testPwd'
            const usrHash = hashPassword(usrPwd)
            const authData: AuthRequestDTO = {
                email: 'test@user.abc',
                password: usrPwd,
            };
            (typeorm as any).getRepository.mockReturnValue({
                findOne: () => Promise.resolve({...authData, password: usrHash, id: 0}),
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
                expect(statusCode).toBe(401)

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
        it('Failure: Password mismatch', async () => {
            const authData: any = {
                email: 'test@user.abc',
                password: '123'
            };
            (typeorm as any).getRepository.mockReturnValue({
                findOne: () => Promise.resolve({...authData, password: 'def', id: 0}),
            })
            try{
                await controller.authenticate(authData)
            } catch (err) {
                const statusCode = err.statusCode
                expect(err).toBeInstanceOf(ErrorHandler)
                expect(statusCode).toBe(401)

            }
        })
    })

})