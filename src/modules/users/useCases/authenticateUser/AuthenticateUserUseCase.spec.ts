import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import {IncorrectEmailOrPasswordError} from "./IncorrectEmailOrPasswordError";

describe("Authenticate User", () => {
    let authenticateUserUseCase: AuthenticateUserUseCase;
    let inMemoryUsersRepository: InMemoryUsersRepository;
    let createUserUseCase: CreateUserUseCase;

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    });


    it("should be possible to authenticate an existing user", async () => {
        await createUserUseCase.execute({name: "test user", email: "test@user.com", password:"1234"});
        const response = await authenticateUserUseCase.execute({email: "test@user.com", password:"1234"});
        expect(response).toHaveProperty("token");
    });

    it("should not be possible to authenticate a user that doesn't exist", async () => {
        expect(async () => {
            await authenticateUserUseCase.execute({email: "test@user.com", password:"1234"});
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    });

    it("should not be possible to authenticate a user with wrong password", async () => {
        expect(async () => {
            await createUserUseCase.execute({name: "test user", email: "test@user.com", password:"1234"});
            await authenticateUserUseCase.execute({email: "test@user.com", password:"12345"});
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    });

});