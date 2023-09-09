import request from 'supertest';
import IPersonService from "../../interfaces/IPersonService"
import PersonDTOBuilder from '../../Builders/Person/PersonDTOBuilder';
import EntityNotFoundError from '../../errors/EntityNotFoundError';
import App, { AppConfig } from '../../App';
import PersonController from '../PersonController';
import PersonInputDTOBuilder from '../../Builders/Person/PersonInputDTOBuilder';
import FieldError from '../../errorHandling/fieldError';
import { assertIsBadRequestForInvalidIdParam, assertIsErrorResponse } from '../../TestUtils/CustomAssertions';

describe('Unit test to people endpoint', () => {

    let personService: jest.Mocked<IPersonService>;
    let personController;
    let config: AppConfig;
    let app: Express.Application;

    let existingId: number;
    let nonExistingId: number;
    
    beforeEach(() => {
        existingId = 1;
        nonExistingId = 2;

        personService = {
            findById: jest.fn(async (id) => {
                if(id === existingId) {
                    const personDTO = PersonDTOBuilder.aPersonDTO().build();
                    return Promise.resolve(personDTO);
                }
                throw new EntityNotFoundError('Not found');
            }),
            findAll: jest.fn(),
            save: jest.fn(),
            update: jest.fn(async (personInputDTO, id) => {
                if(id === nonExistingId) {
                    throw new EntityNotFoundError('Not found');
                }
                const personDTO = PersonDTOBuilder.aPersonDTO().build();
                return Promise.resolve(personDTO);
            }),
            deleteById: jest.fn((id) => {
                if(id === existingId) {
                    return Promise.resolve();
                }
                throw new EntityNotFoundError('Not found');
            })
        }
        personController = new PersonController(personService);
        config = {
            personController
        }
        app = App(config);
    });
    
    test('findById should return badRequest when id is not a number', async () => {
        const response = await request(app).get('/people/A');

        assertIsBadRequestForInvalidIdParam(response);
    });

    test('findById should return notFound when is does not exist', async () => {
        const response = await request(app).get(`/people/${nonExistingId}`);

        expect(personService.findById).toHaveBeenCalledWith(nonExistingId);
        expect(response.statusCode).toBe(404);
        assertIsErrorResponse(response);
    })

    test('findById should return success when id exits', async () => {
        const response = await request(app).get(`/people/${existingId}`);

        expect(response.statusCode).toBe(200);
        expect(personService.findById).toHaveBeenCalledWith(existingId);
        expect(response.body.id).toBe(PersonDTOBuilder.id);
    });

    test('save should return unprocessable when firstName is null', async () => {
        const personInputDTO = PersonInputDTOBuilder.aPersonInputDTO().withANullFirstName().build();
        const response = await request(app).post('/people')
                .send(personInputDTO);

        expect(response.statusCode).toBe(422);
        const body = response.body;
        assertIsErrorResponse(response);
        const errors = body.errors as Array<FieldError>;
        expect(errors).toBeDefined();
        expect(errors.length).toBeGreaterThan(0);
        expect(errors.some((f) => f.fieldName === 'firstName' && f.message === 'First name is required')).toBeTruthy();
        expect(personService.save).not.toHaveBeenCalled();
    });

    test('save should return unprocessable when firstName is empty', async () => {
        const personInputDTO = PersonInputDTOBuilder.aPersonInputDTO().withAnEmptyFirstName().build();
        const response = await request(app).post('/people')
                .send(personInputDTO);

        expect(response.statusCode).toBe(422);
        assertIsErrorResponse(response);
        const errors = response.body.errors as Array<FieldError>;
        expect(errors).toBeDefined();
        expect(errors.length).toBeGreaterThan(0);
        expect(errors.some((f) => f.fieldName === 'firstName' && f.message === 'First name is required')).toBeTruthy();
        expect(personService.save).not.toHaveBeenCalled();
    });

    test('save should return unprocessable when firstName is blank', async () => {
        const personInputDTO = PersonInputDTOBuilder.aPersonInputDTO().withABlankFirstName().build();
        const response = await request(app).post('/people')
                .send(personInputDTO);

        expect(response.statusCode).toBe(422);
        assertIsErrorResponse(response);
        const errors = response.body.errors as Array<FieldError>;
        expect(errors).toBeDefined();
        expect(errors.length).toBeGreaterThan(0);
        expect(errors.some((f) => f.fieldName === 'firstName' && f.message === 'First name cannot be blank')).toBeTruthy();
        expect(personService.save).not.toHaveBeenCalled();
    });

    test('save should return unprocessable when lastName is null', async () => {
        const personInputDTO = PersonInputDTOBuilder.aPersonInputDTO().withANullLastName().build();
        const response = await request(app).post('/people')
                .send(personInputDTO);

        expect(response.statusCode).toBe(422);
        assertIsErrorResponse(response);
        const errors = response.body.errors as Array<FieldError>;
        expect(errors).toBeDefined();
        expect(errors.length).toBeGreaterThan(0);
        expect(errors.some((f) => f.fieldName === 'lastName' && f.message === 'Last name is required')).toBeTruthy();
        expect(personService.save).not.toHaveBeenCalled();
    });

    test('save should return unprocessable when lastName is empty', async () => {
        const personInputDTO = PersonInputDTOBuilder.aPersonInputDTO().withAnEmptyLastName().build();
        const response = await request(app).post('/people')
                .send(personInputDTO);

        expect(response.statusCode).toBe(422);
        assertIsErrorResponse(response);
        const errors = response.body.errors as Array<FieldError>;
        expect(errors).toBeDefined();
        expect(errors.length).toBeGreaterThan(0);
        expect(errors.some((f) => f.fieldName === 'lastName' && f.message === 'Last name is required')).toBeTruthy();
        expect(personService.save).not.toHaveBeenCalled();
    });

    test('save should return unprocessable when lastName is blank', async () => {
        const personInputDTO = PersonInputDTOBuilder.aPersonInputDTO().withABlankLastName().build();
        const response = await request(app).post('/people')
                .send(personInputDTO);

        expect(response.statusCode).toBe(422);
        assertIsErrorResponse(response);
        const errors = response.body.errors as Array<FieldError>;
        expect(errors).toBeDefined();
        expect(errors.length).toBeGreaterThan(0);
        expect(errors.some((f) => f.fieldName === 'lastName' && f.message === 'Last name cannot be blank')).toBeTruthy();
        expect(personService.save).not.toHaveBeenCalled();
    });

    test('save should call service and return created when data is valid', async () => {
        const personInputDTO = PersonInputDTOBuilder.aPersonInputDTO().build();
        const personDTO = PersonDTOBuilder.aPersonDTO().build();
        personService.save.mockResolvedValueOnce(personDTO);

        const response = await request(app).post('/people')
                .send(personInputDTO);

        expect(response.statusCode).toBe(201);
        expect(personService.save).toHaveBeenCalledTimes(1);
        expect(personService.save).toHaveBeenCalledWith(personInputDTO);
        expect(response.body.id).toBe(PersonDTOBuilder.id);
    });

    test('update should return badRequest when id is not a number', async () => {
        const personInputDTO = PersonInputDTOBuilder.aPersonInputDTO().build();
        
        const response = await request(app).put('/people/A')
                .send(personInputDTO);

        assertIsBadRequestForInvalidIdParam(response);
        expect(personService.update).not.toHaveBeenCalled();
    });

    test('update should return unprocessable when firstName is null', async () => {
        const personInputDTO = PersonInputDTOBuilder.aPersonInputDTO().withANullFirstName().build();
        const response = await request(app).put(`/people/${nonExistingId}`)
                .send(personInputDTO);

        expect(response.statusCode).toBe(422);
        const body = response.body;
        assertIsErrorResponse(response);
        const errors = body.errors as Array<FieldError>;
        expect(errors).toBeDefined();
        expect(errors.length).toBeGreaterThan(0);
        expect(errors.some((f) => f.fieldName === 'firstName' && f.message === 'First name is required')).toBeTruthy();
        expect(personService.update).not.toHaveBeenCalled();
    });

    test('update should return unprocessable when firstName is empty', async () => {
        const personInputDTO = PersonInputDTOBuilder.aPersonInputDTO().withAnEmptyFirstName().build();
        const response = await request(app).put(`/people/${nonExistingId}`)
                .send(personInputDTO);

        expect(response.statusCode).toBe(422);
        const body = response.body;
        assertIsErrorResponse(response);
        const errors = body.errors as Array<FieldError>;
        expect(errors).toBeDefined();
        expect(errors.length).toBeGreaterThan(0);
        expect(errors.some((f) => f.fieldName === 'firstName' && f.message === 'First name is required')).toBeTruthy();
        expect(personService.update).not.toHaveBeenCalled();
    });

    test('update should return unprocessable when firstName is blank', async () => {
        const personInputDTO = PersonInputDTOBuilder.aPersonInputDTO().withABlankFirstName().build();
        const response = await request(app).put(`/people/${nonExistingId}`)
                .send(personInputDTO);

        expect(response.statusCode).toBe(422);
        const body = response.body;
        assertIsErrorResponse(response);
        const errors = body.errors as Array<FieldError>;
        expect(errors).toBeDefined();
        expect(errors.length).toBeGreaterThan(0);
        expect(errors.some((f) => f.fieldName === 'firstName' && f.message === 'First name cannot be blank')).toBeTruthy();
        expect(personService.update).not.toHaveBeenCalled();
    });

    test('update should return unprocessable when lastName is null', async () => {
        const personInputDTO = PersonInputDTOBuilder.aPersonInputDTO().withANullLastName().build();
        const response = await request(app).put(`/people/${nonExistingId}`)
                .send(personInputDTO);

        expect(response.statusCode).toBe(422);
        const body = response.body;
        assertIsErrorResponse(response);
        const errors = body.errors as Array<FieldError>;
        expect(errors).toBeDefined();
        expect(errors.length).toBeGreaterThan(0);
        expect(errors.some((f) => f.fieldName === 'lastName' && f.message === 'Last name is required')).toBeTruthy();
        expect(personService.update).not.toHaveBeenCalled();
    });

    test('update should return unprocessable when lastName is empty', async () => {
        const personInputDTO = PersonInputDTOBuilder.aPersonInputDTO().withAnEmptyLastName().build();
        const response = await request(app).put(`/people/${nonExistingId}`)
                .send(personInputDTO);

        expect(response.statusCode).toBe(422);
        const body = response.body;
        assertIsErrorResponse(response);
        const errors = body.errors as Array<FieldError>;
        expect(errors).toBeDefined();
        expect(errors.length).toBeGreaterThan(0);
        expect(errors.some((f) => f.fieldName === 'lastName' && f.message === 'Last name is required')).toBeTruthy();
        expect(personService.update).not.toHaveBeenCalled();
    });

    test('update should return unprocessable when lastName is blank', async () => {
        const personInputDTO = PersonInputDTOBuilder.aPersonInputDTO().withABlankLastName().build();
        const response = await request(app).put(`/people/${nonExistingId}`)
                .send(personInputDTO);

        expect(response.statusCode).toBe(422);
        const body = response.body;
        assertIsErrorResponse(response);
        const errors = body.errors as Array<FieldError>;
        expect(errors).toBeDefined();
        expect(errors.length).toBeGreaterThan(0);
        expect(errors.some((f) => f.fieldName === 'lastName' && f.message === 'Last name cannot be blank')).toBeTruthy();
        expect(personService.update).not.toHaveBeenCalled();
    });

    test('update should return nonFound when id does not exist', async () => {
        const personInputDTO = PersonInputDTOBuilder.aPersonInputDTO().build();
        const response = await request(app).put(`/people/${nonExistingId}`)
                .send(personInputDTO);

        expect(response.statusCode).toBe(404);
        assertIsErrorResponse(response);
        expect(personService.update).toHaveBeenCalledWith(personInputDTO, nonExistingId);
    });

    test('update should return success when data is valid and id exists', async () => {
        const personInputDTO = PersonInputDTOBuilder.aPersonInputDTO().build();
        const response = await request(app).put(`/people/${existingId}`)
                .send(personInputDTO);

        expect(response.statusCode).toBe(200);
        expect(personService.update).toHaveBeenCalledWith(personInputDTO, existingId);
        expect(response.body.id).toBe(PersonDTOBuilder.id);
    });

    test('delete should return badRequest when id is not a number', async () => {
        const response = await request(app).delete('/people/C');

        assertIsBadRequestForInvalidIdParam(response);
        expect(personService.deleteById).not.toHaveBeenCalled();
    });

    test('delete should return badRequest when does not exist', async () => {
        const response = await request(app).delete(`/people/${nonExistingId}`);

        expect(response.statusCode).toBe(404);
        assertIsErrorResponse(response);
        expect(personService.deleteById).toHaveBeenCalledWith(nonExistingId);
    });

    test('delete should return noContent when id exists', async () => {
        const response = await request(app).delete(`/people/${existingId}`);

        expect(response.statusCode).toBe(204);
        expect(personService.deleteById).toHaveBeenCalledWith(existingId);
    })
});