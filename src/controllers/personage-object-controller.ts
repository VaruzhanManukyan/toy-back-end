import {Request, Response, NextFunction} from "express";
import {Types} from "mongoose";
import ApiError from "../exceptions/api-error";
import {IPersonageObject, IPersonageObjectAllResponse, IPersonageObjectDB, IPersonageObjectResponse} from "../shared/interfaces/personage-object-interfaces";
import PersonageObjectService from "../services/personage-object-service";

class PersonageObjectController {
    async create(request: Request, response: Response, next: NextFunction) {
        try {
            const {name} = request.body;
            if (!name) {
                return next(ApiError.BadRequest("Name is required."));
            }

            const personageObject: IPersonageObject = {name}
            const personageObjectDB: IPersonageObjectDB = await PersonageObjectService.create(personageObject);
            const personageObjectResponse: IPersonageObjectResponse = {
                id: personageObjectDB._id,
                ...personageObjectDB._doc
            }

            response.status(201).json(personageObjectResponse);
        } catch (error) {
            next(error);
        }
    }

    async getAll(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const personageObjects: IPersonageObjectDB[] = await PersonageObjectService.getAll();
            const personageObjectsResponse: IPersonageObjectAllResponse = {
                data: personageObjects.map((item: IPersonageObjectDB) => ({
                    id: item._id,
                    ...item._doc
                })),
                total: personageObjects.length
            }

            response.status(200).json(personageObjectsResponse);
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

            const personageObjectDB: IPersonageObjectDB = await PersonageObjectService.getById(id);
            const personageObjectResponse: IPersonageObjectResponse = {
                id: personageObjectDB._id,
                ...personageObjectDB._doc
            }

            response.status(200).json(personageObjectResponse);
        } catch (error) {
            next(error);
        }
    }

    async update(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const {id, name} = request.body;
            if (!Types.ObjectId.isValid(id)) {
                return next(ApiError.BadRequest(`Invalid ID format: ${id}`));
            }

            if (!name) {
                return next(ApiError.BadRequest("Name is required."));
            }

            const personageObject: IPersonageObject = {name}
            const personageObjectDB: IPersonageObjectDB = await PersonageObjectService.update(id, personageObject);
            const personageObjectResponse = {
                id: personageObjectDB._id,
                ...personageObjectDB._doc
            }

            response.status(200).json(personageObjectResponse);
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

            const message: string = await PersonageObjectService.delete(id);
            response.status(200).json({message});
        } catch (error) {
            next(error);
        }
    }

    async deleteMany(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const {ids} = request.body;
            for (const id of ids) {
                if (!Types.ObjectId.isValid(id)) {
                    return next(ApiError.BadRequest(`Invalid ID format: ${id}`));
                }
            }

            const message: string = await PersonageObjectService.deleteMany(ids);
            response.status(200).json({message});
        } catch (error) {
            next(error);
        }
    }
}

export default new PersonageObjectController();