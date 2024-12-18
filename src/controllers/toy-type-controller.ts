import {Request, Response, NextFunction} from 'express';
import {Types} from "mongoose";
import ApiError from "../exceptions/api-error";
import {IToyType, IToyTypeAllResponse, IToyTypeDB, IToyTypeResponse} from "../shared/interfaces/toy-type-interfaces";
import ToyTypeService from '../services/toy-type-service';

class ToyTypeController {
    async create(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const {
                supplier_id,
                personage_object_state_id,
                default_scenario_id,
                name,
                price,
                description
            } = request.body;

            const imageFile: Express.Multer.File = request.file as Express.Multer.File;

            if (!Types.ObjectId.isValid(supplier_id)) {
                return next(ApiError.BadRequest(`Invalid ID format: ${supplier_id}`));
            }

            if (!Types.ObjectId.isValid(personage_object_state_id)) {
                return next(ApiError.BadRequest(`Invalid ID format: ${personage_object_state_id}`));
            }

            if (!Types.ObjectId.isValid(default_scenario_id)) {
                return next(ApiError.BadRequest(`Invalid ID format: ${default_scenario_id}`));
            }

            if (!price) {
                return next(ApiError.BadRequest("Price is required."));
            }

            if (!name) {
                return next(ApiError.BadRequest("Name is required."));
            }

            if (!description) {
                return next(ApiError.BadRequest("Description is required."));
            }

            const toyType: IToyType = {
                supplier_id,
                personage_object_state_id,
                default_scenario_id,
                name,
                price,
                description,
                imageSrc: imageFile?.path.split("\\")[1]
            };

            const toyTypeDB: IToyTypeDB = await ToyTypeService.create(toyType);
            const toyTypeResponse: IToyTypeResponse = {
                id: toyTypeDB._id,
                ...toyTypeDB._doc
            }

            response.status(201).json(toyTypeResponse);
        } catch (error) {
            next(error);
        }
    }

    async getAll(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const toyTypesDB: IToyTypeDB[] = await ToyTypeService.getAll();
            const toyTypesResponse: IToyTypeAllResponse = {
                data: toyTypesDB.map((item: IToyTypeDB) => ({
                    id: item._id,
                    ...item._doc
                })),
                total: toyTypesDB.length
            };

            response.status(200).json(toyTypesResponse);
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

            const toyTypeDB: IToyTypeDB = await ToyTypeService.getById(id);
            const toyTypeResponse: IToyTypeResponse = {
                id: toyTypeDB._id,
                ...toyTypeDB._doc
            }

            response.status(200).json(toyTypeResponse);
        } catch (error) {
            next(error);
        }
    }

    async update(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const {
                id,
                supplier_id,
                personage_object_state_id,
                default_scenario_id,
                name,
                price,
                description
            } = request.body;
            const imageFile: Express.Multer.File = request.file as Express.Multer.File;

            if (!Types.ObjectId.isValid(id)) {
                return next(ApiError.BadRequest(`Invalid ID format: ${id}`));
            }

            if (!Types.ObjectId.isValid(supplier_id)) {
                return next(ApiError.BadRequest(`Invalid ID format: ${supplier_id}`));
            }

            if (!Types.ObjectId.isValid(personage_object_state_id)) {
                return next(ApiError.BadRequest(`Invalid ID format: ${personage_object_state_id}`));
            }

            if (!Types.ObjectId.isValid(default_scenario_id)) {
                return next(ApiError.BadRequest(`Invalid ID format: ${default_scenario_id}`));
            }

            if (!price) {
                return next(ApiError.BadRequest("Price is required."));
            }

            if (!name) {
                return next(ApiError.BadRequest("Name is required."));
            }

            if (!description) {
                return next(ApiError.BadRequest("Description is required."));
            }

            if (imageFile) {
                const toyTypeDB: IToyTypeDB = await ToyTypeService.getById(id);

            }

            const toyType: IToyType = {
                supplier_id,
                personage_object_state_id,
                default_scenario_id,
                name,
                price,
                description,
                imageSrc: imageFile?.path.split("\\")[1]
            };

            const toyTypeDB: IToyTypeDB = await ToyTypeService.update(id, toyType);
            const toyTypeResponse: IToyTypeResponse = {
                id: toyTypeDB._id,
                ...toyTypeDB._doc
            }

            response.status(200).json(toyTypeResponse);
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

            const message: string = await ToyTypeService.delete(id);
            response.status(200).json(message);
        } catch (error) {
            next(error);
        }
    }

    async deleteMany(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const {ids} = request.body;
            if (!Array.isArray(ids) || !ids.every(id => Types.ObjectId.isValid(id))) {
                return next(ApiError.BadRequest("Invalid ID format(s) in the request."));
            }

            const message: string = await ToyTypeService.deleteMany(ids);
            response.status(200).json(message);
        } catch (error) {
            next(error);
        }
    }

    async searchByPriceRange(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const {minPrice, maxPrice} = request.query;
            if (!minPrice || !maxPrice) {
                return next(ApiError.BadRequest('Min price and max price are required.'));
            }
            const toyTypes = await ToyTypeService.searchByPriceRange(Number(minPrice), Number(maxPrice));
            response.status(200).json(toyTypes);
        } catch (error) {
            next(error);
        }
    }
}

export default new ToyTypeController();
