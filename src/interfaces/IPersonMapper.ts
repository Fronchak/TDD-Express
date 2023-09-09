import Person from "../types/Person/Person";
import PersonDTO from "../types/Person/PersonDTO";
import PersonInputDTO from "../types/Person/PersonInputDTO";

interface IPersonMapper {
    
    mapToPersonDTO(person: Person): PersonDTO;

    mapToPersonDTOs(people: Array<Person>): Array<PersonDTO>

    copyToPerson(personInputDTO: PersonInputDTO, person: Person): void
}

export default IPersonMapper;
