import IPersonMapper from "../interfaces/IPersonMapper";
import Person from "../types/Person/Person";
import PersonDTO from "../types/Person/PersonDTO";
import PersonInputDTO from "../types/Person/PersonInputDTO";

class PersonMapper implements IPersonMapper {

    mapToPersonDTO = (person: Person): PersonDTO => {
        return {
            ...person
        } as PersonDTO
    }

    mapToPersonDTOs = (people: Array<Person>): Array<PersonDTO> => {
        return people.map((person) => this.mapToPersonDTO(person));
    }

    copyToPerson = (personInputDTO: PersonInputDTO, person: Person): void => {
        person.firstName = personInputDTO.firstName!;
        person.lastName = personInputDTO.lastName!;
    }
}

export default PersonMapper;