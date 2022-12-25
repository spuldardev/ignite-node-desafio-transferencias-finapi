import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

describe("Show user balance", () => {
    let getBalanceUseCase: GetBalanceUseCase;
    let inMemoryUsersRepository: InMemoryUsersRepository;
    let inMemoryStatementsRepository: InMemoryStatementsRepository;

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
    });

    it("should be possible to see an existing user's balance", async () => {
        const userInDb = await inMemoryUsersRepository.create({email: "test", name: "test", password: "123"});
        const response = await getBalanceUseCase.execute({user_id: userInDb.id});
        expect(response.balance).toEqual(0);
    });

    it("should not be possible to see the balance from a user that doesn't exist", async () => {
        expect(async () => {
            await getBalanceUseCase.execute({user_id: "invalid"});
        }).rejects.toBeInstanceOf(GetBalanceError);
    });
});