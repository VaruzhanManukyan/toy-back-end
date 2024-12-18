import {Request, Response, NextFunction} from "express";
import {Types} from "mongoose";
import ApiError from "../exceptions/api-error";
import {IPersonageObjectState, IPersonageObjectStateAllResponse, IPersonageObjectStateDB, IPersonageObjectStateResponse} from "../shared/interfaces/personage-object-state-interfaes";
import PersonageObjectStateService from "../services/personage-object-state-service";

class PersonageObjectStateController {
    async create(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const {name, personage_object_id, description_state_ids} = request.body;

            if (!name) {
                return next(ApiError.BadRequest("Name is required."));
            }

            if (!Types.ObjectId.isValid(personage_object_id)) {
                return next(ApiError.BadRequest(`Invalid ID format: ${personage_object_id}`));
            }

            const personageObjectState: IPersonageObjectState = {
                name,
                personage_object_id,
                description_state_ids
            }

            const personageObjectStateDB: IPersonageObjectStateDB = await PersonageObjectStateService.create(personageObjectState);
            const personageObjectResponse: IPersonageObjectStateResponse = {
                id: personageObjectStateDB._id,
                ...personageObjectStateDB._doc
            }

            response.status(201).json(personageObjectResponse);
        } catch (error) {
            next(error);
        }
    }

    async getAll(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const personageObjectStates: IPersonageObjectStateDB[] = await PersonageObjectStateService.getAll();
            const personageObjectStatesResponse: IPersonageObjectStateAllResponse = {
                data: personageObjectStates.map((item: IPersonageObjectStateDB) => ({
                    id: item._id,
                    personage_object_id: item._doc.personage_object_id,
                    description_state_ids: item._doc.description_state_ids.map((id: Types.ObjectId) => id),
                    name: item._doc.name
                })),
                total: personageObjectStates.length
            }

            response.status(200).json(personageObjectStatesResponse);
        } catch (error) {
            next(error);
        }
    }

    async getById(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const {id} = request.body;
            if (!Types.ObjectId.isValid(id)) {
                return next(ApiError.BadRequest(`Invalid ID format: ${id}`));
            }

            const personageObjectStateDB: IPersonageObjectStateDB = await PersonageObjectStateService.getById(id);
            const personageObjectStateResponse: IPersonageObjectStateResponse = {
                id: personageObjectStateDB._id,
                ...personageObjectStateDB._doc
            }
            response.status(200).json(personageObjectStateResponse);
        } catch (error) {
            next(error);
        }
    }

    async update(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const {id, name, personage_object_id, description_state_ids} = request.body;

            if (!Types.ObjectId.isValid(id)) {
                return next(ApiError.BadRequest(`Invalid ID format: ${id}`));
            }

            if (!name) {
                return next(ApiError.BadRequest("Name is required."));
            }

            if (!Types.ObjectId.isValid(personage_object_id)) {
                return next(ApiError.BadRequest(`Invalid ID format: ${personage_object_id}`));
            }

            const personageObjectStateUpdate: IPersonageObjectState = {
                name,
                personage_object_id,
                description_state_ids
            }

            const personageObjectStateDB: IPersonageObjectStateDB = await PersonageObjectStateService.update(id, personageObjectStateUpdate);
            const personageObjectStateResponse: IPersonageObjectStateResponse = {
                id: personageObjectStateDB._id,
                ...personageObjectStateDB._doc
            }

            response.status(200).json(personageObjectStateResponse);
        } catch (error) {
            next(error);
        }
    }

    async delete(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const {id} = request.body;
            if (!Types.ObjectId.isValid(id)) {
                return next(ApiError.BadRequest(`Invalid ID format: ${id}`));
            }

            const message: string = await PersonageObjectStateService.delete(id);
            response.status(200).json({message});
        } catch (error) {
            next(error);
        }
    }

    async deleteMany(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const { ids } = request.body;
            if (!Array.isArray(ids) || ids.some((id: string) => !Types.ObjectId.isValid(id))) {
                return next(ApiError.BadRequest(`Invalid ID format in array: ${JSON.stringify(ids)}`));
            }

            const message: string = await PersonageObjectStateService.deleteMany(ids);
            response.status(200).json({ message });
        } catch (error) {
            next(error);
        }
    }
}

export default new PersonageObjectStateController();