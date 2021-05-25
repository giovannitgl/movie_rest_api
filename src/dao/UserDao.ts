import {getRepository} from "typeorm";
import {User, UserTypes} from "../entity/User";
import {UserDTO} from "../dto/UserDTO";

/**
 * Gets an user by id filtering by type
 * @param id {number} - Int id for the user
 * @param type {admin|user} - type of user
 */
export async function getUserById(id: number, type?: UserTypes): Promise<User | null> {
    const filter = {id}
    if (type) {
        filter['type'] = type
    }
    const userRepo = getRepository(User)
    return userRepo.findOne(filter)
}


export async function createUser(payload: UserDTO): Promise<User | null> {
    /**
     * Creates an user
     * @param payload {user DTO} user information to be created
     * @returns {User} - User created
     */
    const userRepo = getRepository(User)
    return userRepo.save(payload)
        .then((partial) => {
            return getUserById(partial.id)
        })
}

export async function updateUser(id: number, payload: UserDTO): Promise<User | null> {
    /**
     * Updates an existing user
     * @param {number} id - Int id for the user to be found
     * @param {UserDTO} payload - User data to update
     * @returns {User} - User with id or null
     */
    const userRepo = getRepository(User)
    return userRepo.update(id, payload)
        .then(() => {
            return getUserById(id)
        })
}
