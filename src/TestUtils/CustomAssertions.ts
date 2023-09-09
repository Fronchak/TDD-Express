import { Response } from 'supertest'

export const assertIsErrorResponse = (response: Response) => {
    const body = response.body;
    expect(body.message).toBeDefined();
    expect(body.message.length).toBeGreaterThan(0);
}

export const assertIsBadRequestForInvalidIdParam = (response: Response) => {
    expect(response.statusCode).toBe(400);
    assertIsErrorResponse(response);
    expect(response.body.message).toBe('Id must be a number');
}