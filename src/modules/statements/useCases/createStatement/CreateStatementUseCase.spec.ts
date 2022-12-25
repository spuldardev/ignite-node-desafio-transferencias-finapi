import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { OperationType } from "@modules/statements/entities/Statement";
import { CreateStatementError } from "./CreateStatementError";


describe("Make deposits or withdrawals", () => {
    let createStatementUseCase: CreateStatementUseCase;
    let inMemoryUsersRepository: InMemoryUsersRepository;
    let inMemoryStatementsRepository: InMemoryStatementsRepository;

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        createStatementUseCase = new CreateStatementUseCase( inMemoryUsersRepository, inMemoryStatementsRepository);
    });

    it("should be possible to deposit to an existent user's account", async () => {
        const userInDb = await inMemoryUsersRepository.create({email: "test", name: "test", password: "123"});
        const response = await createStatementUseCase.execute({user_id: userInDb.id, amount: 100, description: "deposit", type: OperationType.DEPOSIT});
        expect(response.amount).toEqual(100);
    });

    it("should be possible to withdraw from an existent user's account with sufficient balance", async () => {
        const userInDb = await inMemoryUsersRepository.create({email: "test", name: "test", password: "123"});
        await inMemoryStatementsRepository.create({user_id: userInDb.id, amount: 100, description: "deposit", type: OperationType.DEPOSIT})
        const response = await createStatementUseCase.execute({user_id: userInDb.id, amount: 100, description: "deposit", type: OperationType.WITHDRAW});
        expect(response.amount).toEqual(100);
    });

    it("should not be possible to deposit to a non existent user's account", async () => {
        expect(async () => {
            await createStatementUseCase.execute({user_id: "invalid", amount: 100, description: "deposit", type: OperationType.DEPOSIT});
        }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
    });

    it("should not be possible to withdraw from a non existent user's account", async () => {
        expect(async () => {
            await createStatementUseCase.execute({user_id: "invalid", amount: 100, description: "deposit", type: OperationType.WITHDRAW});
        }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
    });

    it("should not be possible to withdraw from a user without sufficient funds", async () => {
        expect(async () => {
            const userInDb = await inMemoryUsersRepository.create({email: "test", name: "test", password: "123"});
            await inMemoryStatementsRepository.create({user_id: userInDb.id, amount: 100, description: "deposit", type: OperationType.DEPOSIT})
            await createStatementUseCase.execute({user_id: userInDb.id, amount: 200, description: "deposit", type: OperationType.WITHDRAW});
        }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
    });
});

