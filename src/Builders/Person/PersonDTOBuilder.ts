import PersonDTO from "../../types/Person/PersonDTO";

class PersonDTOBuilder {

    private person: PersonDTO;

    static id = 15;
    static firstName = 'Ana';
    static lastName = 'Beatriz';

    private constructor() {
        this.person = {
            id: PersonDTOBuilder.id,
            firstName: PersonDTOBuilder.firstName,
            lastName: PersonDTOBuilder.lastName
        }
    }

    static aPersonDTO = (): PersonDTOBuilder => {
        return new PersonDTOBuilder();
    }

    build = (): PersonDTO => {
        return this.person;
    }
}

export default PersonDTOBuilder;