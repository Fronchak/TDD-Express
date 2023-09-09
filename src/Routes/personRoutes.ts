import { Request, Response, Router } from "express";
import PersonController from "../controllers/PersonController";
import resolver from "./controllerAdapter";
import checkIdParam from "../middlewares/checkIdParam";
import personInputValidator from "../validators/Person/personInputValidator";
import checkValidationErrors from "../middlewares/checkValidationErrors";

const makePersonRoutes = (personController: PersonController) => {
    const personRoutes: Router = Router();

    personRoutes.get('/:id', 
        checkIdParam,
        resolver(personController.findById));

    personRoutes.post('/', 
        personInputValidator,
        checkValidationErrors,
        resolver(personController.save));

    personRoutes.put('/:id', 
        checkIdParam,
        personInputValidator,
        checkValidationErrors,
        resolver(personController.update));

    personRoutes.delete('/:id', 
        checkIdParam,
        resolver(personController.deleteById));

    return personRoutes;
}


export default makePersonRoutes;