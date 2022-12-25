import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";
import {CreateUserError} from "./CreateUserError"

describe("Create User", () => {
    let createUserUseCase: CreateUserUseCase;
    let inMemoryUsersRepository: InMemoryUsersRepository;

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    });


    it("should be possible to create a new user", async () => {
        const response = await createUserUseCase.execute({name: "test user", email: "test@user.com", password:"1234"});
        expect(response.name).toBe("test user");
    });

    it("should not be possible to create a new user using an email already in use", async () => {
        expect(async () => {
            await createUserUseCase.execute({name: "test user", email: "test@user.com", password:"1234"});
            await createUserUseCase.execute({name: "test user", email: "test@user.com", password:"1234"});
        }).rejects.toBeInstanceOf(CreateUserError);
    });

});