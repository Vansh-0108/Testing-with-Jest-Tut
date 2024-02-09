import { ReservationsDataAccess } from "../../../app/server_app/data/ReservationsDataAccess"
import { DataBase } from "../../../app/server_app/data/DataBase";

const insertMock = jest.fn();
const getByMock = jest.fn();
const updateMock = jest.fn();
const deleteMock = jest.fn();
const getAllMock = jest.fn();

jest.mock('../../../app/server_app/data/DataBase', () => {
    return{
        DataBase: jest.fn().mockImplementation(() =>{
            return {
                insert: insertMock,
                getBy: getByMock,
                update: updateMock,
                delete: deleteMock,
                getAllElements: getAllMock,
            }
        })
    }
})

describe('ReservationsDataAccess tests suite', () => {
    let sut: ReservationsDataAccess;
    
    const someReservation = {
        id: '',
        room: 'someRoom',
        user: 'someUser',
        startDate: 'someStart',
        endDate: 'someEnd'
    }

    const someId = '1234';

    beforeEach(() => {
        sut = new ReservationsDataAccess();
        expect(DataBase).toHaveBeenCalledTimes(1);
    })

    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should create a reservation and return a id', async () => {
        insertMock.mockReturnValueOnce(someId);

        const actualId = await sut.createReservation(someReservation);
        expect(actualId).toBe(someId);
        expect(insertMock).toBeCalledWith(someReservation);
    })

    it('should update a reservation', async () => {
        const expectedRoom = 'otherRoom';
        await sut.updateReservation(someId, 'room', expectedRoom)
        expect(updateMock).toBeCalledWith(someId, 'room', expectedRoom);
    })

    it('should delete a reservation', async () => {
        await sut.deleteReservation(someId);
        expect(deleteMock).toBeCalledWith(someId);
    })

    it('should get a reservation', async () => {
        getByMock.mockResolvedValueOnce(someReservation);

        const actual = await sut.getReservation(someId);

        expect(actual).toEqual(someReservation);
        expect(getByMock).toHaveBeenCalledWith('id', someId);
    })

    it('should get all reservations', async () => {
        getAllMock.mockResolvedValueOnce([someReservation, someReservation]);
        const actual = await sut.getAllReservations();

        expect(actual).toEqual([someReservation, someReservation]);
        expect(getAllMock).toBeCalledTimes(1);
    })
})