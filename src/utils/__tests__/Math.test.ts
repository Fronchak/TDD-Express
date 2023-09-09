import { sum } from "../Math";

describe('Testing Math', () => {

    test('Sum should return the correctly sum', () => {
        const result = sum(2, 3);
        expect(result).toBe(5);
    });
});