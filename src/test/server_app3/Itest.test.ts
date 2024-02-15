import { ReservationsDataAccess } from "../../app/server_app/data/ReservationsDataAccess";
import { Account } from "../../app/server_app/model/AuthModel";
import { Reservation } from "../../app/server_app/model/ReservationModel";
import { HTTP_CODES, HTTP_METHODS } from "../../app/server_app/model/ServerModel";
import { Server } from "../../app/server_app/server/Server"
import { makeAwesomeRequest } from "./utils/http-client";

describe('Server app integration testing', () => {
    let server: Server;

    beforeAll(() => {
        server = new Server();
        server.startServer();
    })

    afterAll(() => {
        server.stopServer();
    })

    const someUser: Account = {
        id: '',
        userName: 'someUserName',
        password: 'somePassword',
    }

    const someReservation: Reservation = {
        id: '',
        room: 'someRoom',
        user: 'someUser',
        startDate: 'someStartDate',
        endDate: 'someEndDate',
    }

    // this test is done using the internal nodejs fetch method
    it('should register new user', async () => {
        const result = await fetch('http://localhost:8080/register', {
            method: HTTP_METHODS.POST,
            body: JSON.stringify(someUser),
        })
        const resultBody = await result.json();

        expect(result.status).toBe(HTTP_CODES.CREATED);
        expect(resultBody.userId).toBeDefined();
    })

    // this test is done using the awesome rrequest module created to make an http request
    it('should register new user with awesomeRequest', async () => {
        const result = await makeAwesomeRequest({
            host: 'localhost',
            port: 8080,
            method: HTTP_METHODS.POST,
            path: '/register'
        }, someUser)

        expect(result.statusCode).toBe(HTTP_CODES.CREATED);
        expect(result.body.userId).toBeDefined();
    })

    let token: string;
    it('should login a regitered user', async () => {
        const result = await fetch('http://localhost:8080/login', {
            method: HTTP_METHODS.POST,
            body: JSON.stringify(someUser),
        })

        const resultBody = await result.json();

        expect(result.status).toBe(HTTP_CODES.CREATED);
        expect(resultBody.token).toBeDefined();
        token = resultBody.token;
    })

    let createdReservationId: string;
    it('should create reservation for a authorized user', async () => {
        const result = await fetch('http://localhost:8080/reservation', {
            method: HTTP_METHODS.POST,
            body: JSON.stringify(someReservation),
            headers: {
                authorization: token,
            }
        })

        const resultBody = await result.json();

        expect(result.status).toBe(HTTP_CODES.CREATED);
        expect(resultBody.reservationId).toBeDefined();
        createdReservationId = resultBody.reservationId;
    });

    it('should get the reservation if authorized', async () => {
        
        const result = await fetch(`http://localhost:8080/reservation/${createdReservationId}`, {
            method: HTTP_METHODS.GET,
            headers: {
                authorization: token,
            }
        })

        const resultBody = await result.json();

        const expectedReservation = structuredClone(someReservation);
        expectedReservation.id = createdReservationId;

        expect(result.status).toBe(HTTP_CODES.OK);
        expect(resultBody).toEqual(expectedReservation);
    });

    it('should create and retrieve multiple reservations if authorized', async () => {
        await fetch('http://localhost:8080/reservation', {
            method: HTTP_METHODS.POST,
            body: JSON.stringify(someReservation),
            headers: {
                authorization: token,
            }
        })

        await fetch('http://localhost:8080/reservation', {
            method: HTTP_METHODS.POST,
            body: JSON.stringify(someReservation),
            headers: {
                authorization: token,
            }
        })

        await fetch('http://localhost:8080/reservation', {
            method: HTTP_METHODS.POST,
            body: JSON.stringify(someReservation),
            headers: {
                authorization: token,
            }
        })
        
        const getAllResults = await fetch('http://localhost:8080/reservation/all', {
            method: HTTP_METHODS.GET,
            headers: {
                authorization: token,
            }
        })

        const resultBody = await getAllResults.json();

        expect(getAllResults.status).toBe(HTTP_CODES.OK);
        expect(resultBody).toHaveLength(4);
    });

    it('should update the reservation for a authorized user', async () => {
        const updateResult = await fetch(`http://localhost:8080/reservation/${createdReservationId}`, {
            method: HTTP_METHODS.PUT,
            body: JSON.stringify({
                startDate: 'someNewDate',
            }),
            headers: {
                authorization: token,
            }
        })
        // asserting that the updation yeild OKAY
        expect(updateResult.status).toBe(HTTP_CODES.OK);

        //getting the updated reservation details
        const getResult = await fetch(`http://localhost:8080/reservation/${createdReservationId}`, {
            method: HTTP_METHODS.GET,
            headers: {
                authorization: token,
            }
        });
        
        const getRequestBody: Reservation = await getResult.json();
        expect(getRequestBody.startDate).toBe('someNewDate');
    });

    it('should delete the reservation for a authorized user', async () => {
        const deleteResult = await fetch(`http://localhost:8080/reservation/${createdReservationId}`, {
            method: HTTP_METHODS.DELETE,
            headers: {
                authorization: token,
            }
        })
        // asserting that the deletion yeild OKAY
        expect(deleteResult.status).toBe(HTTP_CODES.OK);

        //getting the deleted reservation details
        const getResult = await fetch(`http://localhost:8080/reservation/${createdReservationId}`, {
            method: HTTP_METHODS.GET,
            headers: {
                authorization: token,
            }
        });
        
        expect(getResult.status).toBe(HTTP_CODES.NOT_fOUND);
    });
})