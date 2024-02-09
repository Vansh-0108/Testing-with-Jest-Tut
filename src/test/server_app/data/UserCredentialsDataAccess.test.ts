import { DataBase } from "../../../app/server_app/data/DataBase";
import { UserCredentialsDataAccess } from "../../../app/server_app/data/UserCredentialsDataAccess";

const insertMock = jest.fn();
const getByMock =  jest.fn();

// ReferenceError: Cannot access 'insertMock' before initialization
// Thus we mock the jest.fn for DATABASE and then make it return the reqrired functions
// So that we can access them further in our tests

// ADDING MOCKS TO CONSUMER CLASSES
jest.mock('../../../app/server_app/data/DataBase', () => {
    return {
        DataBase: jest.fn().mockImplementation(() => {
            return {
                insert: insertMock,
                getBy: getByMock,
            }
        }) 
    }
})

describe("UserCredentialsDataAccess Tests suite", () => {

    let sut: UserCredentialsDataAccess;

    const someAccount = {
        id: '',
        userName: 'someUserName',
        password: 'somePassword'
    }
    
    const someId = '1234';

    beforeEach(() => {
        sut = new UserCredentialsDataAccess();
        expect(DataBase).toHaveBeenCalledTimes(1);
    })

    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should insert user and return id',async () =>{
        // insertMock.mockReturnValue // usually used
        // but we'll use this as async calls are involved
        insertMock.mockResolvedValueOnce(someId);
        const actualId = await sut.addUser(someAccount);
        expect(actualId).toBe(someId);
        expect(insertMock).toHaveBeenCalledWith(someAccount);
    })

    it('should return user by id',async () =>{
        getByMock.mockResolvedValueOnce(someAccount);

        const actualUser = await sut.getUserById(someId);
        expect(actualUser).toEqual(someAccount);
        expect(getByMock).toHaveBeenCalledWith('id', someId);
    })

    it('should return user by id',async () =>{
        getByMock.mockResolvedValueOnce(someAccount);

        const actualUser = await sut.getUserByUserName(someAccount.userName);
        expect(actualUser).toEqual(someAccount);
        expect(getByMock).toHaveBeenCalledWith('userName', someAccount.userName);
    })
})