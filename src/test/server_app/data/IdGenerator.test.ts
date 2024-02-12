import { generateRandomId } from "../../../app/server_app/data/IdGenerator"

jest.mock('crypto', () => ({
    randomBytes: () => {return '865f38a9950699794e81fcd91584f8612f5a42aec5b7bbed48c1683832c519c22c836c91fe1afc0330a2ea02dea0a31a1f509dfde1a780ce82ec0eb1'}
}))

describe('generateRandomId test Suite', () => {
    
    test("should generate a random number", () => {
        // jest.spyOn(global.crypto, randomBytes).mockReturnValue(0)
        const actual = generateRandomId();
        expect(actual.length).toBe(120);
        // expect(actual).toBe('865f38a9950699794e81fcd91584f8612f5a42aec5b7bbed48c1683832c519c22c836c91fe1afc0330a2ea02dea0a31a1f509dfde1a780ce82ec0eb1');
    })
})