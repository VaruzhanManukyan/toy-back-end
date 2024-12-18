import {Request, Response, NextFunction} from "express";
import {Types} from "mongoose";
import ApiError from "../exceptions/api-error";
import {IDescriptionState, IDescriptionStateAllResponse, IDescriptionStateDB, IDescriptionStateResponse} from "../shared/interfaces/description-state-interfaces";
import DescriptionStateService from "../services/description-state-service";

class DescriptionStateController {
    async create(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const {name} = request.body;
            if (!name) {
                return next(ApiError.BadRequest("Name is required."));
            }

            const descriptionState: IDescriptionState = {name}
            const descriptionStateDB: IDescriptionStateDB = await DescriptionStateService.create(descriptionState);
            const descriptionStateResponse: IDescriptionStateResponse = {
                id: descriptionStateDB._id,
                ...descriptionStateDB._doc
            }

            response.status(201).json(descriptionStateResponse);
        } catch (error) {
            next(error);
        }
    }

    async getAll(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const descriptionStatesDB: IDescriptionStateDB[] = await DescriptionStateService.getAll();
            const descriptionStatesResponse: IDescriptionStateAllResponse = {
                data: descriptionStatesDB.map((item: IDescriptionStateDB) => ({
                    id: item._id,
                    ...item._doc
                })),
                total: descriptionStatesDB.length
            }

            response.status(200).json(descriptionStatesResponse);
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

            const descriptionStateDB: IDescriptionStateDB = await DescriptionStateService.getById(id);
            const descriptionStatesResponse: IDescriptionStateResponse = {
                id: descriptionStateDB._id,
                ...descriptionStateDB._doc
            }

            response.status(200).json(descriptionStatesResponse);
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

            const descriptionState: IDescriptionState = {name}
            const descriptionStateDB: IDescriptionStateDB = await DescriptionStateService.update(id, descriptionState);
            const descriptionStateResponse: IDescriptionStateResponse = {
                id: descriptionStateDB._id,
                ...descriptionStateDB._doc
            }

            response.status(200).json(descriptionStateResponse);
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

            const message: string = await DescriptionStateService.delete(id);
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

            const message: string = await DescriptionStateService.deleteMany(ids);
            response.status(200).json({message});
        } catch (error) {
            next(error);
        }
    }
}

export default new DescriptionStateController();
