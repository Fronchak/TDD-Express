import PersonBuilder from "../../Builders/Person/PersonBuilder";
import PersonDTOBuilder from "../../Builders/Person/PersonDTOBuilder";
import PersonInputDTOBuilder from "../../Builders/Person/PersonInputDTOBuilder";
import EntityNotFoundError from "../../errors/EntityNotFoundError";
import IPersonMapper from "../../interfaces/IPersonMapper";
import IPersonRepository from "../../interfaces/IPersonRepository";
import Person from "../../types/Person/Person";
import PersonDTO from "../../types/Person/PersonDTO";
import PersonInputDTO from "../../types/Person/PersonInputDTO";
import PersonService from "../PersonService";

describe('Testing PersonService', () => {

    const existingId = 1;
    const nonExistingId = 2;

    let person: Person;
    let personDTO: PersonDTO;

    let personRepositoryMock: jest.Mocked<IPersonRepository>;
    let personMapper: jest.Mocked<IPersonMapper>;
    let personService: PersonService;

    beforeEach(() => {
        person = PersonBuilder.aPerson().build();
        personDTO = PersonDTOBuilder.aPersonDTO().build();

        personRepositoryMock = {
            findById: jest.fn((id) => {
                if(id === existingId) return Promise.resolve(person);
                return Promise.resolve(null);
            }),
            save: jest.fn(),
            update: jest.fn(),
            findAll: jest.fn(),
            delete: jest.fn()
        };
        personMapper = {
            mapToPersonDTO: jest.fn((personParam) => {
                if(personParam === person) return personDTO;
                return {} as PersonDTO;
            }),
            mapToPersonDTOs: jest.fn(),
            copyToPerson: jest.fn()
        }
        personService = new PersonService(personRepositoryMock, personMapper);
    });

    test('findById should throw EntityNotFoundErrorWhenIdDoesNotExits', async () => {
        expect.assertions(1);
        try {
            await personService.findById(nonExistingId);
        }
        catch(e) {
            expect(e).toBeInstanceOf(EntityNotFoundError);
        }
    });

    test('findById should return PersonDTO when id exists', async () => {
        const result: PersonDTO = await personService.findById(existingId);
        expect(personMapper.mapToPersonDTO).toHaveBeenCalledTimes(1);
        expect(result).toBe(personDTO);
    });

    test('save should save entity in the database and return PersonDTO', async () => {
        const personAfterSave: Person = PersonBuilder.aPerson().build();
        const personInputDTO: PersonInputDTO = PersonInputDTOBuilder.aPersonInputDTO().build();
        personRepositoryMock.save.mockResolvedValueOnce(personAfterSave);
        personMapper.mapToPersonDTO.mockReturnValueOnce(personDTO);

        const result: PersonDTO = await personService.save(personInputDTO);

        expect(personMapper.copyToPerson.mock.calls[0][0]).toBe(personInputDTO);
        expect(personRepositoryMock.save).toHaveBeenCalledTimes(1);
        expect(personMapper.mapToPersonDTO).toHaveBeenCalledWith(personAfterSave);
        expect(result).toBe(personDTO);
    });

    test('update should throw EntityNotFoundError when id does not exist', async () => {
        expect.assertions(2);
        try {
            await personService.update({} as PersonInputDTO, nonExistingId);
        }
        catch(e) {
            expect(e).toBeInstanceOf(EntityNotFoundError);
        }
        expect(personRepositoryMock.update).toHaveBeenCalledTimes(0);
    });

    test('update should update entity in the database and return PersonDTO', async () => {
        const personAfterUpdate: Person = PersonBuilder.aPerson().build();
        const personInputDTO: PersonInputDTO = PersonInputDTOBuilder.aPersonInputDTO().build();
        personRepositoryMock.update.mockResolvedValueOnce(personAfterUpdate);
        personMapper.mapToPersonDTO.mockReturnValueOnce(personDTO);

        const result: PersonDTO = await personService.update(personInputDTO, existingId);

        expect(personMapper.copyToPerson).toHaveBeenCalledWith(personInputDTO, person);
        expect(personRepositoryMock.update).toHaveBeenCalledWith(person);
        expect(personMapper.mapToPersonDTO).toHaveBeenCalledWith(personAfterUpdate);
        expect(result).toBe(personDTO);
    });

    test('findAll should return an array of PersonDTO', async () => {
        const otherPersonDTO: PersonDTO = PersonDTOBuilder.aPersonDTO().build();
        const people: Array<Person> = [person];
        const personDTOs: Array<PersonDTO> = [personDTO, otherPersonDTO];
        personRepositoryMock.findAll.mockResolvedValueOnce(people);
        personMapper.mapToPersonDTOs.mockReturnValueOnce(personDTOs);

        const result: Array<PersonDTO> = await personService.findAll();

        expect(personMapper.mapToPersonDTOs).toHaveBeenCalledWith(people);
        expect(result.length).toBe(2);
        expect(result).toBe(personDTOs);
    });

    test('deleteById should throw EntityNotFoundError when id does not exist', async () => {
        expect.assertions(2);
        try {
            await personService.deleteById(nonExistingId);
        }
        catch(e) {
            expect(e).toBeInstanceOf(EntityNotFoundError);
        }
        expect(personRepositoryMock.delete).toHaveBeenCalledTimes(0);
    });

    test('deleteById should delete from database when id exists', async () => {
        await personService.deleteById(existingId);
        expect(personRepositoryMock.delete).toHaveBeenCalledTimes(1);
        expect(personRepositoryMock.delete).toHaveBeenCalledWith(person);
    })
})