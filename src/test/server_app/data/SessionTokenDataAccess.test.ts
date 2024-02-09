import { DataBase } from "../../../app/server_app/data/DataBase";
import { SessionTokenDataAccess } from "../../../app/server_app/data/SessionTokenDataAccess"
import { Account } from "../../../app/server_app/model/AuthModel";

const insertMock = jest.fn();
const getByMock = jest.fn();
const updateMock = jest.fn();

jest.mock('../../../app/server_app/data/DataBase', () => {
    return {
        DataBase: jest.fn().mockImplementation(() => {
            return {
                insert: insertMock,
                getBy: getByMock,
                update: updateMock,
            }
        })
    }
})

describe.only('SessionTokenDataAccess tests suite', () => {
    let sut: SessionTokenDataAccess;

    const someTokenId = '1234';

    const someAccount: Account = {
        id: '',
        userName: 'someUserName',
        password: 'somePassword'
    }

    beforeEach(() => {
        sut = new SessionTokenDataAccess();
        expect(DataBase).toHaveBeenCalledTimes(1);
        jest.spyOn(global.Date, 'now').mockReturnValue(0);
    })

    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should generate token and return tokenId ', async () => {
        insertMock.mockResolvedValueOnce(someTokenId);
        const actualTokenId = await sut.generateToken(someAccount);

        expect(actualTokenId).toBe(someTokenId);
        expect(insertMock).toHaveBeenCalledWith({
            id: '',
            userName: someAccount.userName,
            valid: true,
            expirationDate: new Date(60 * 60 * 1000),
        });
    })

    it('should invalidate a token ', async () => {
        await sut.invalidateToken(someTokenId);
        expect(updateMock).toBeCalledWith(someTokenId, 'valid', false);
    })

    it('should check for the valid token', async () => {
        getByMock.mockResolvedValueOnce({'valid': true});
        // const actual = await sut.isValidToken(someTokenId);
        const actual = await sut.isValidToken({} as any);
        expect(actual).toBe(true);
    })   
    
    it('should check for the invalid token', async () => {
        getByMock.mockResolvedValueOnce({'valid': false});
        const actual = await sut.isValidToken(someTokenId);
        // const actual = await sut.isValidToken({} as any);
        expect(actual).toBe(false);
    })  

    it('should check for the non-existing token', async () => {
        getByMock.mockResolvedValueOnce(undefined);
        const actual = await sut.isValidToken(someTokenId);
        // const actual = await sut.isValidToken({} as any);
        expect(actual).toBe(false);
    })  
})
