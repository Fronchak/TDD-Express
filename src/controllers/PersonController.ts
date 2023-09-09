import { Request, Response } from "express";
import IPersonService from "../interfaces/IPersonService";

class PersonController {

    private readonly personService: IPersonService;

    constructor(personService: IPersonService) {
        this.personService = personService;
    }

    findById = async(req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const personDTO = await this.personService.findById(id);
        res.status(200).json(personDTO);
    }

    save = async(req: Request, res: Response) => {
        const personDTO = await this.personService.save(req.body);
        res.status(201).json(personDTO);
    }

    update = async(req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const body = req.body;
        const personDTO = await this.personService.update(body, id);
        res.status(200).json(personDTO);
    }

    deleteById = async(req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        await this.personService.deleteById(id);
        res.status(204).json();
    }
}

export default PersonController;