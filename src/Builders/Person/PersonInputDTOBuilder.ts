import PersonInputDTO from "../../types/Person/PersonInputDTO";

class PersonInputDTOBuilder {

    private person: PersonInputDTO;

    static firstName = 'Fernando';
    static lastName = 'Luiz';

    private constructor() {
        this.person = {
            firstName: PersonInputDTOBuilder.firstName,
            lastName: PersonInputDTOBuilder.lastName
        }
    }

    static aPersonInputDTO = (): PersonInputDTOBuilder => {
        return new PersonInputDTOBuilder();
    }

    withANullFirstName = (): PersonInputDTOBuilder => {
        this.person.firstName = null;
        return this;
    }

    withAnEmptyFirstName = (): PersonInputDTOBuilder => {
        this.person.firstName = '';
        return this;
    }

    withABlankFirstName = (): PersonInputDTOBuilder => {
        this.person.firstName = '    ';
        return this;
    }

    withANullLastName = (): PersonInputDTOBuilder => {
        this.person.lastName = null;
        return this;
    }

    withAnEmptyLastName = (): PersonInputDTOBuilder => {
        this.person.lastName = '';
        return this;
    }

    withABlankLastName = (): PersonInputDTOBuilder => {
        this.person.lastName = '    ';
        return this;
    }

    build = (): PersonInputDTO => {
        return this.person;
    }
}

export default PersonInputDTOBuilder;