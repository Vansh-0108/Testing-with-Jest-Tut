import { getRequestBody } from "../../../app/server_app/utils/Utils";
import { IncomingMessage } from 'http';

const requestMock = {
    on: jest.fn(),
}

const someObj = {
    name: 'hello',
    field2: 'someValue',
}

const someObjAsString = JSON.stringify(someObj);

describe('Utils test suite', () => {

    it('should return the object for valid JSON', async () => {
        requestMock.on.mockImplementation((event, cb) => {
            if(event == 'data')
                cb(someObjAsString);
            else
                cb();
        })

        const actual = await getRequestBody(
            requestMock as any as IncomingMessage
        )

        expect(actual).toEqual(someObj);
    })

    it('should throw error for invalid JSON', async () => {
        const someOtherObjAsString = 'a' + someObjAsString;
        requestMock.on.mockImplementation((event, cb) => {
            if(event == 'data')
                cb('a' + someObjAsString);
            else
                cb();
        })

        // const actual = await getRequestBody(requestMock as any);
        // expect(actual).rejects.toThrow('Unexpected toke a in JSON at position 0');
        await expect(getRequestBody(requestMock as any)).rejects.
            toThrow(`Unexpected token`);
        // the .rejects.toThrow() matches the 'unexpected tokem' string with any part of the error caught

    })

    it('should throw error for unexpected error', async () => {
        const someError = new Error('Something went wrong');

        requestMock.on.mockImplementation((event, cb) => {
            if(event == 'error')
                cb(someError);
        });
        // const actual = await getRequestBody(requestMock as any);
        // await expect(actual).rejects.toThrow(someError.message);   
        await expect(getRequestBody(requestMock as any)).rejects.
        toThrow(someError.message);
    })
})