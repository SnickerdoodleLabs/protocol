import { okAsync, ResultAsync } from "neverthrow";
import td from "testdouble";



// Interfaces at top
/*
interface IFooRepository {
  getNumber(): ResultAsync<number, never>;
}

interface IFooService {
  foo(): ResultAsync<number, never>;
}
*/

class FooService implements IFooService {
    public constructor(public fooRepo: IFooRepository) { }

    public foo(): ResultAsync<number, never> {
        return this.fooRepo.getNumber();
    }
}

class FooServiceMocks {
    public fooRepo = td.object<IFooRepository>();

    constructor() {
        td.when(
            this.fooRepo.getNumber(),
        ).thenReturn(okAsync(1));
    }

    public factoryService(): IFooService {
        return new FooService(this.fooRepo);
    }
}

describe("FooService tests", () => {
    test("foo() should return 1", async () => {
        // Arrange
        const mocks = new FooServiceMocks();
        const fooService = mocks.factoryService();

        // Act
        const num =
            await fooService.foo();

        console.log("charlie");
        // Assert
        expect(num.isErr()).toBeFalsy();
        expect(num._unsafeUnwrap()).toStrictEqual(
            1,
        );
    });
});
