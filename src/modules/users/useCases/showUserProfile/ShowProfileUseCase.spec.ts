import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

describe("Show Profile", () => {
    let showUserProfileUseCase: ShowUserProfileUseCase;
    let inMemoryUsersRepository: InMemoryUsersRepository;

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
    });

    it("should be possible to see a valid profile", async () => {
        const userInDb = await inMemoryUsersRepository.create({email: "test", name: "test", password: "123"});
        const response = await showUserProfileUseCase.execute(userInDb.id);
        expect(response.name).toBe("test");
    });

    it("should not be possible to see a profile from a user that doesn't exist", async () => {
        expect(async () => {
            await showUserProfileUseCase.execute("invalid");
        }).rejects.toBeInstanceOf(ShowUserProfileError);
    });
});