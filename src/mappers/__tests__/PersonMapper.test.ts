import PersonBuilder from "../../Builders/Person/PersonBuilder";
import PersonInputDTOBuilder from "../../Builders/Person/PersonInputDTOBuilder";
import Person from "../../types/Person/Person";
import PersonDTO from "../../types/Person/PersonDTO";
import PersonInputDTO from "../../types/Person/PersonInputDTO";
import PersonMapper from "../PersonMapper";

describe('Testing PersonMapper', () => {

    let personMapper: PersonMapper;
    let person: Person;

    beforeEach(() => {
        personMapper = new PersonMapper();
        person = PersonBuilder.aPerson().build();
    });

    test('mapToPersonDTO should map correctly', () => {
        const result: PersonDTO = personMapper.mapToPersonDTO(person);

        expect(result.id).toBe(PersonBuilder.id);
        expect(result.firstName).toBe(PersonBuilder.firstName);
        expect(result.lastName).toBe(PersonBuilder.lastName);
    });

    
    test('mapToPersonDTOs should map the collection', () => {
        const otherPerson = PersonBuilder.aPerson().withSecondaryValues().build();
        const people = new Array<Person>(person, otherPerson);

        const result: Array<PersonDTO> = personMapper.mapToPersonDTOs(people);

        expect(result).toHaveLength(2);
        expect(result.some((dto) => 
                dto.id === PersonBuilder.id && 
                dto.firstName === PersonBuilder.firstName && 
                dto.lastName === PersonBuilder.lastName)
        ).toBeTruthy();
        expect(result.some((dto) => 
                dto.id === PersonBuilder.secondaryId && 
                dto.firstName === PersonBuilder.secondaryFirstName && 
                dto.lastName === PersonBuilder.secondaryLastName)
        ).toBeTruthy();
    });
    

    test('copy to Person should copy values correctly but no change the id', () => {
        const personInputDTO: PersonInputDTO = PersonInputDTOBuilder.aPersonInputDTO().build();

        personMapper.copyToPerson(personInputDTO, person);

        expect(person.id).toBe(PersonBuilder.id);
        expect(person.firstName).toBe(PersonInputDTOBuilder.firstName);
        expect(person.lastName).toBe(PersonInputDTOBuilder.lastName);
    });
});