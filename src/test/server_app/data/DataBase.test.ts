import { DataBase } from "../../../app/server_app/data/DataBase"
import * as idGenerator from '../../../app/server_app/data/IdGenerator'

// jest.mock('idGenerator', () => ({
//     generateRandomId: () => {return '123'}
// }))

type someTypeWithId = {
    id: string,
    name: string,
    color: string,
}

describe('Database Test Suite', () => {
    let sut: DataBase<someTypeWithId>;

    let fakeId = '1234';

    let someObject1 = {
        id: '',
        name: 'testName1',
        color: 'red',
    }

    let someObject2 = {
        id: '',
        name: 'testName2',
        color: 'red',
    }

    beforeEach(() => {
        sut = new DataBase<someTypeWithId>();
        jest.spyOn(idGenerator, 'generateRandomId').mockReturnValue(fakeId);
    })

    it('should return id after insert', async () => {
        const actual = await sut.insert({
            id: '',
        } as any)
        expect(actual).toBe(fakeId);
    })

    it('should get element after insert', async () => {
        const id = await sut.insert(someObject1);
        const actual = await sut.getBy('id', id);
        expect(actual).toBe(someObject1);
    })

    it('should get all elements by search', async () => {
        await sut.insert(someObject1);
        await sut.insert(someObject2);

        const expected = [someObject1, someObject2];
        const actual = await sut.findAllBy('color', 'red');

        expect(actual).toEqual(expected);
    })

    it('should update the color', async () => {
        const id = await sut.insert(someObject1);
        const expectedColor = 'blue'
        const obj = await sut.getBy('id', id);
        obj.color = expectedColor;
        await sut.update(id, 'color', expectedColor);
        const actual = await sut.getBy('id', id);
        expect(actual).toEqual(obj);
        expect(actual.color).toBe(expectedColor);
    })

    it('should delete the object', async () => {
        const id = await sut.insert(someObject1);
        await sut.delete(id);

        const actual = await sut.getBy('id', id);
        expect(actual).toBeUndefined();
    })

    it('should get all elements', async () => {
        await sut.insert(someObject1);
        await sut.insert(someObject2);

        const expected = [someObject1, someObject2];
        const actual = await sut.getAllElements();

        expect(actual).toEqual(expected);
    })
})