import EntityNotFoundError from "../errors/EntityNotFoundError";
import IPersonMapper from "../interfaces/IPersonMapper";
import IPersonRepository from "../interfaces/IPersonRepository";
import IPersonService from "../interfaces/IPersonService";
import Person from "../types/Person/Person";
import PersonDTO from "../types/Person/PersonDTO";
import PersonInputDTO from "../types/Person/PersonInputDTO";

class PersonService implements IPersonService {

    private readonly personRepository: IPersonRepository;
    private readonly personMapper: IPersonMapper;

    constructor(personRepository: IPersonRepository, personMapper: IPersonMapper) {
        this.personRepository = personRepository;
        this.personMapper = personMapper;
    }

    findById = async (id: number): Promise<PersonDTO> => {
        const person = await this.personRepository.findById(id);
        if(!person) {
            throw new EntityNotFoundError('Person no found');
        }
        return this.personMapper.mapToPersonDTO(person);
    }

    save = async (personInputDTO: PersonInputDTO): Promise<PersonDTO> => {
        const person = {};
        this.personMapper.copyToPerson(personInputDTO, person);
        const personSaved = await this.personRepository.save(person);
        return this.personMapper.mapToPersonDTO(personSaved);
    }

    update = async (personInputDTO: PersonInputDTO, id: number): Promise<PersonDTO> => {
        const person = await this.personRepository.findById(id);
        if(!person) {
            throw new EntityNotFoundError('Person no found');
        }
        this.personMapper.copyToPerson(personInputDTO, person);
        const personUpdated = await this.personRepository.update(person);
        return this.personMapper.mapToPersonDTO(personUpdated);
    }

    findAll = async(): Promise<Array<PersonDTO>> => {
        const people = await this.personRepository.findAll();
        return this.personMapper.mapToPersonDTOs(people);
    }

    deleteById = async(id: number): Promise<void> => {
        const person = await this.personRepository.findById(id);
        if(!person) {
            throw new EntityNotFoundError('Person no found');
        }
        await this.personRepository.delete(person);
    }
}

export default PersonService;