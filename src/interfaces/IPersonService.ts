import PersonDTO from "../types/Person/PersonDTO";
import PersonInputDTO from "../types/Person/PersonInputDTO";

interface IPersonService {

    findById(id: number): Promise<PersonDTO>;

    save(personInputDTO: PersonInputDTO): Promise<PersonDTO>;

    update(personInputDTO: PersonInputDTO, id: number): Promise<PersonDTO>;

    findAll(): Promise<Array<PersonDTO>>;

    deleteById(id: number): Promise<void>;
}

export default IPersonService;