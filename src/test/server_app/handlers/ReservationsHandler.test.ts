import { Authorizer } from "../../../app/server_app/auth/Authorizer";
import { ReservationsDataAccess } from "../../../app/server_app/data/ReservationsDataAccess";
import { ReservationsHandler } from "../../../app/server_app/handlers/ReservationsHandler"
import { IncomingMessage, ServerResponse } from "http";
import { HTTP_CODES, HTTP_METHODS } from "../../../app/server_app/model/ServerModel";
import { Reservation } from "../../../app/server_app/model/ReservationModel";

const getRequestBodyMock = jest.fn();
jest.mock('../../../app/server_app/utils/Utils', () => ({
    getRequestBody: () => getRequestBodyMock()
}))

describe('ReservationsHandler test suite', () =>{
    let sut: ReservationsHandler;

    const request = {
        method: undefined,
        headers: {
            authorization: undefined
        },
        url: undefined,
    }

    const responseMock = {
        statusCode: 0,
        write: jest.fn(),
        writeHead: jest.fn(),
    }

    const authorizerMock = {
        validateToken: jest.fn()
    }

    const reservationsDataAccessMock = {
        createReservation: jest.fn(),
        getAllReservations: jest.fn(),
        getReservation: jest.fn(),
        updateReservation: jest.fn(),
        deleteReservation: jest.fn(),
    }

    const someReservation: Reservation = {
        id: undefined,
        room: 'someRoom',
        user: 'someUser',
        startDate: new Date().toDateString(),
        endDate: new Date().toDateString(),
    }

    const someReservationId = '1234';

    beforeEach(() => {
        sut = new ReservationsHandler(
            request as IncomingMessage,
            responseMock as any as ServerResponse,
            authorizerMock as any as Authorizer,
            reservationsDataAccessMock as any as ReservationsDataAccess,
        );
        request.headers.authorization = 'abcd';
        authorizerMock.validateToken.mockResolvedValueOnce(true);
    })

    afterEach(() => {
        jest.clearAllMocks();
        request.url = undefined;
        responseMock.statusCode = 0;
    });

    describe('POST Requests Test Suite', () => {~
        beforeEach(() => {
            request.method = HTTP_METHODS.POST;
        })

        it('should create a reservation for valid request', async () => {
            getRequestBodyMock.mockResolvedValueOnce(someReservation);
            reservationsDataAccessMock.createReservation.mockResolvedValueOnce(someReservationId);

            await sut.handleRequest();

            expect(responseMock.statusCode).toBe(HTTP_CODES.CREATED);
            expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.CREATED, { 'Content-Type': 'application/json' })
            expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify({ reservationId : someReservationId }));
        })

        it('should not create reservation for invalid request', async () => {
            getRequestBodyMock.mockResolvedValueOnce({});

            await sut.handleRequest();

            expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
            expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify('Incomplete reservation!'));
        })

        it('should not create reservation for invalid fields in request', async () => {
            const moreThanSomeReservation = {...someReservation, someField: '123'};
            getRequestBodyMock.mockResolvedValueOnce(moreThanSomeReservation);

            await sut.handleRequest();

            expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
            expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify('Incomplete reservation!'));
        })
    });
    
    describe('GET Requests Test Suite', () => {
        beforeEach(() => {
            request.method = HTTP_METHODS.GET;
        })

        it('should get all reservations for valid request', async () => {
            request.url = '/reservations/all';
            reservationsDataAccessMock.getAllReservations.mockResolvedValueOnce([someReservation]);

            await sut.handleRequest();

            expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.OK, { 'Content-Type': 'application/json' });
            expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify([someReservation]));
        })

        it('should get a reservation for existing id', async () => {
            request.url = `/reservations/${someReservation}`;
            reservationsDataAccessMock.getReservation.mockResolvedValueOnce(someReservation);

            await sut.handleRequest();

            expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.OK, { 'Content-Type': 'application/json' });
            expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify(someReservation));
        })

        it('should return not found for non-existing id', async () => {
            request.url = `/reservations/${someReservationId}`;
            reservationsDataAccessMock.getReservation.mockResolvedValueOnce(undefined);

            await sut.handleRequest();

            expect(responseMock.statusCode).toBe(HTTP_CODES.NOT_fOUND);
            expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify(`Reservation with id ${someReservationId} not found`));
        })

        it('should return bad request if no id is provided', async () => {
            request.url = `/reservations`;

            await sut.handleRequest();

            expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
            expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify(`Please provide an ID!`));
        })
    });

    describe('PUT Requests Test Suite', () => {
        beforeEach(() => {
            request.method = HTTP_METHODS.PUT;
        });

        it('should return not found for non-existing id', async () => {
            request.url = `/reservations/${someReservationId}`
            reservationsDataAccessMock.getReservation.mockResolvedValueOnce(undefined);

            await sut.handleRequest();

            expect(responseMock.statusCode).toBe(HTTP_CODES.NOT_fOUND);
            expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify(`Reservation with id ${someReservationId} not found`));
        });

        it('should return bad request if not id is provided', async () => {
            request.url = `/reservations`

            await sut.handleRequest();

            expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
            expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify(`Please provide an ID!`));
        });

        it('should return bad request for invalid field', async () => {
            request.url = `/reservations/${someReservationId}`
            reservationsDataAccessMock.getReservation.mockResolvedValueOnce(someReservation);
            getRequestBodyMock.mockResolvedValueOnce({
                startDate1: 'someDate',
            })
            await sut.handleRequest();

            expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
            expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify(`Please provide valid fields to update!`));
        });

        it('should return bad request if not field is provided', async () => {
            request.url = `/reservations/${someReservationId}`
            reservationsDataAccessMock.getReservation.mockResolvedValueOnce(someReservation);
            getRequestBodyMock.mockResolvedValueOnce({})

            await sut.handleRequest();

            expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
            expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify(`Please provide valid fields to update!`));
        });

        it('should update the reservations for the all valid fields provided', async () => {
            request.url = `/reservations/${someReservationId}`
            reservationsDataAccessMock.getReservation.mockResolvedValueOnce(someReservation);

            const updateObj = {
                startDate: 'someDate1',
                endDate: 'someDate2',
            }

            getRequestBodyMock.mockResolvedValueOnce(updateObj);

            await sut.handleRequest();

            expect(reservationsDataAccessMock.updateReservation).toHaveBeenCalledTimes(2);
            expect(reservationsDataAccessMock.updateReservation).toHaveBeenCalledWith(
                someReservationId,
                'startDate',
                updateObj.startDate,
            )
            expect(reservationsDataAccessMock.updateReservation).toHaveBeenCalledWith(
                someReservationId,
                'endDate',
                updateObj.endDate,
            )
            expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.OK, { 'Content-Type': 'application/json' });
            expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify(`Updated ${Object.keys(updateObj)} of reservation ${someReservationId}`));
        });
    });

    describe('DELETE Requests Test Suite', () => {
        beforeEach(() => {
            request.method = HTTP_METHODS.DELETE;
        });

        it('should delete the reservation for a valid entry', async () => {
            request.url = `/reservations/${someReservationId}`;

            await sut.handleRequest();

            expect(reservationsDataAccessMock.deleteReservation).toHaveBeenCalledWith(someReservationId);
            expect(responseMock.statusCode).toBe(HTTP_CODES.OK);
            expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify(`Deleted reservation with id ${someReservationId}`))
        });

        it('should return bad request if no id is provided', async () => {
            request.url = `/reservations`;

            await sut.handleRequest();

            expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
            expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify('Please provide an ID!'));
        });
    });

    it('should return nothing for unauthorized requests', async () => {
        request.headers.authorization = '1234';
        authorizerMock.validateToken.mockReset();
        authorizerMock.validateToken.mockResolvedValueOnce(false);

        await sut.handleRequest();

        expect(responseMock.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
        expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify('Unauthorized operation!'))
    })

    it('should return nothing if no authorization error is there', async() => {
        request.headers.authorization = undefined;

        await sut.handleRequest();

        expect(responseMock.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
        expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify('Unauthorized operation!'))
    });

    it('should return nothing for invalid HTTP methods', async () => {
        request.method = 'some-method';
        
        await sut.handleRequest();

        expect(responseMock.writeHead).not.toHaveBeenCalled();
        expect(responseMock.write).not.toHaveBeenCalled();
    });
});
