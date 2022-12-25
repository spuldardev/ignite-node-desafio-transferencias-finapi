import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "@modules/statements/entities/Statement";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";

describe("Get user statement", () => {
    let getStatementOperationUseCase: GetStatementOperationUseCase;
    let inMemoryUsersRepository: InMemoryUsersRepository;
    let inMemoryStatementsRepository: InMemoryStatementsRepository;

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    });

    it("should be possible to show an existing statement from to an existent user's account", async () => {
        const userInDb = await inMemoryUsersRepository.create({email: "test", name: "test", password: "123"});
        const statement = await inMemoryStatementsRepository.create({user_id: userInDb.id, amount: 100, description: "deposit", type: OperationType.DEPOSIT});
        const response = await getStatementOperationUseCase.execute({user_id: userInDb.id, statement_id: statement.id});
        expect(response.id).toEqual(statement.id);
    });

    it("should not be possible to show a non existing statement from an existing user", async () => {
        expect(async () => {
            const userInDb = await inMemoryUsersRepository.create({email: "test", name: "test", password: "123"});
            await getStatementOperationUseCase.execute({user_id: userInDb.id, statement_id: "invalid"});
        }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
    });

    it("should not be possible to show a non existing statement from a non existing user", async () => {
        expect(async () => {
            await getStatementOperationUseCase.execute({user_id: "invalid", statement_id: "invalid"});
        }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
    });
});

