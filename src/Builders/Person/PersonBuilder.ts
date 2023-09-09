import Person from "../../types/Person/Person";

class PersonBuilder {

    private person: Person;

    static id = 10;
    static firstName = 'Maria';
    static lastName = 'Clara';

    static secondaryId = 11;
    static secondaryFirstName = 'Claudia';
    static secondaryLastName = 'da Silva';

    private constructor() {
        this.person = {
            id: PersonBuilder.id,
            firstName: PersonBuilder.firstName,
            lastName: PersonBuilder.lastName
        }
    }

    static aPerson = (): PersonBuilder => {
        return new PersonBuilder();
    }

    withSecondaryValues = ():PersonBuilder => {
        this.person.id = PersonBuilder.secondaryId;
        this.person.firstName = PersonBuilder.secondaryFirstName;
        this.person.lastName = PersonBuilder.secondaryLastName;
        return this;
    }

    build = (): Person => {
        return this.person;
    }
}

export default PersonBuilder;