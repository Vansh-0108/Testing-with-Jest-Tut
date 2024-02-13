import { DataBase } from "../../../app/server_app/data/DataBase";
import { Account } from "../../../app/server_app/model/AuthModel";
import { HTTP_CODES, HTTP_METHODS } from "../../../app/server_app/model/ServerModel";
import { Server } from "../../../app/server_app/server/Server";
import { RequestTestWrapper } from "./RequestTestWrapper"
import { ResponseTestWrapper } from "./ResponseTestWrapper";

jest.mock('../../../app/server_app/data/DataBase');

const requestWrapper = new RequestTestWrapper();
const responseWrapper = new ResponseTestWrapper();

const fakeServer = {
    listen: () => {},
    close: () => {},
};

jest.mock('http', () => ({
    createServer: (cb: Function) => {
        cb(requestWrapper, responseWrapper)
        return fakeServer;
    }
}));

const someAccount: Account = {
    id: '',
    userName: 'someUserName',
    password: 'somePassword',
};

const someToken = '1234';

const JSONHeader = {'Content-Type': 'application/json'};

describe('Login Request test suite', () => {

    const insertSpy = jest.spyOn(DataBase.prototype, 'insert');
    const getBySpy = jest.spyOn(DataBase.prototype, 'getBy');

    beforeEach(() => {
        requestWrapper.headers['user-agents'] = 'jest tests';
    })

    afterEach(() => {
        requestWrapper.clearFields();
        responseWrapper.clearFields();
        jest.clearAllMocks();
    })

    it('should login the user with valid credentials', async () => {
        requestWrapper.method = HTTP_METHODS.POST;
        requestWrapper.body = someAccount;
        requestWrapper.url = 'localhost:8080/login';
        insertSpy.mockResolvedValueOnce(someToken);
        getBySpy.mockResolvedValueOnce(someAccount);

        await new Server().startServer();
        await new Promise(process.nextTick);

        expect(responseWrapper.statusCode).toBe(HTTP_CODES.CREATED);
        expect(responseWrapper.body).toEqual({token: someToken});
        expect(responseWrapper.headers).toContainEqual(JSONHeader);
    });

    it('should return bad request when missing credentials', async () => {
        requestWrapper.method = HTTP_METHODS.POST;
        requestWrapper.body = {};
        requestWrapper.url = 'localhost:8080/login';

        await new Server().startServer();
        await new Promise(process.nextTick);

        expect(responseWrapper.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
        expect(responseWrapper.body).toBe('userName and password required');
        expect(responseWrapper.headers).toContainEqual(JSONHeader);
    });

    it('should do nothing for invalid methods', async () => {
        requestWrapper.method = HTTP_METHODS.DELETE;
        requestWrapper.body = {};
        requestWrapper.url = 'localhost:8080/login';

        await new Server().startServer();
        await new Promise(process.nextTick);

        expect(responseWrapper.statusCode).toBeUndefined();
        expect(responseWrapper.body).toBeUndefined();
        expect(responseWrapper.headers).toHaveLength(0);
    });
});