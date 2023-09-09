import Person from "../types/Person/Person";

interface IPersonRepository {

    findById(id: number): Promise<Person | null>;

    findAll(): Promise<Array<Person>>;

    save(person: Person): Promise<Person>;

    update(person: Person): Promise<Person>;

    delete(Person: Person): Promise<void>;
}

export default IPersonRepository;