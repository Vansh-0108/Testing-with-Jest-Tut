import { Authorizer } from "../../../app/server_app/auth/Authorizer";
import { SessionTokenDataAccess } from "../../../app/server_app/data/SessionTokenDataAccess";
import { UserCredentialsDataAccess } from "../../../app/server_app/data/UserCredentialsDataAccess";

const isValidTokenMock = jest.fn();
const invalidateTokenMock = jest.fn();
const generateTokenMock = jest.fn();
jest.mock('../../../app/server_app/data/SessionTokenDataAccess', () => {
    return {
        SessionTokenDataAccess: jest.fn().mockImplementation(() => {
            return {
                isValidToken: isValidTokenMock,
                invalidateToken: invalidateTokenMock,
                generateToken: generateTokenMock,
            }
        })
    }
})

const addUserMock = jest.fn();
const getUserByUserNameMock = jest.fn();

jest.mock('../../../app/server_app/data/UserCredentialsDataAccess', () => {
    return{
        UserCredentialsDataAccess: jest.fn().mockImplementation(() => {
            return {
                addUser: addUserMock,
                getUserByUserName: getUserByUserNameMock, 
            }
        })
    }
})

describe('Authorizer test suite', () => {
    let sut: Authorizer;

    beforeEach(() => {
        sut = new Authorizer();
        expect(SessionTokenDataAccess).toHaveBeenCalledTimes(1);
        expect(UserCredentialsDataAccess).toHaveBeenCalledTimes(1);
    })
    
    afterEach(() => {
        jest.clearAllMocks();
    })

    const someUserName = "someUserName";
    const somePassword = "somePassword";
    const someId = "1234";

    it('should validate token', async () => {
        isValidTokenMock.mockResolvedValueOnce(false);
        const actual = await sut.validateToken(someId);
        expect(actual).toBe(false)
    })

    it('should register user and return id', async () => {
        addUserMock.mockResolvedValueOnce(someId);

        const actual = await sut.registerUser(someUserName, somePassword);

        expect(actual).toBe(someId);
        expect(addUserMock).toHaveBeenCalledWith({
            id: '',
            password: somePassword,
            userName: someUserName,
        });
    });

    it('should login and return tokenId', async () => {
        getUserByUserNameMock.mockResolvedValueOnce({password: somePassword})
        generateTokenMock.mockResolvedValueOnce(someId);

        const actual = await sut.login(someUserName, somePassword);

        expect(actual).toBe(someId);
    })

    it('should return invalid for wrong credentials', async () => {
        getUserByUserNameMock.mockResolvedValueOnce({password: somePassword})

        const actual = await sut.login(someUserName, somePassword);

        expect(actual).toBeUndefined();
    })

    it('should invalidate the token on logout', async () => {
        const actual = await sut.logout(someId);

        expect(invalidateTokenMock).toHaveBeenCalledWith(someId);
    })
})

