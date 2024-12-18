import {Request, Response, NextFunction} from "express";
import {Types} from "mongoose";
import ApiError from "../exceptions/api-error";
import {IToy, IToyAllResponse, IToyDB, IToyResponse} from "../shared/interfaces/toy-interfaces";
import ToyService from "../services/toy-service";

class ToyController {
    async create(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const {toy_type_id, RFID} = request.body;
            if (!Types.ObjectId.isValid(toy_type_id)) {
                return next(ApiError.BadRequest(`Invalid ID format: ${toy_type_id}`));
            }

            if (!toy_type_id) {
                return next(ApiError.BadRequest("Toy type ID is required"));
            }

            if (!RFID) {
                return next(ApiError.BadRequest("RFID is required"));
            }

            const toy: IToy = {toy_type_id, RFID};
            const toyDB: IToyDB = await ToyService.create(toy);
            const toyResponse: IToyResponse = {
                id: toyDB._id,
                ...toyDB._doc,
            }

            response.status(201).json(toyResponse);
        } catch (error) {
            next(error);
        }
    }

    async getAll(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const toysDB: IToyDB[] = await ToyService.getAll();
            const toysResponse: IToyAllResponse = {
                data: toysDB.map((item: IToyDB) => ({
                    id: item._id,
                    ...item._doc
                })),
                total: toysDB.length
            }

            response.status(200).json(toysResponse);
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

            const toyDB: IToyDB = await ToyService.getById(id);
            const toyResponse: IToyResponse = {
                id: toyDB._id,
                ...toyDB._doc
            }

            response.status(200).json(toyResponse);
        } catch (error) {
            next(error);
        }
    }

    async update(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const {id, toy_type_id, RFID} = request.body;
            if (!Types.ObjectId.isValid(id)) {
                return next(ApiError.BadRequest(`Invalid ID format: ${id}`));
            }

            if (!Types.ObjectId.isValid(toy_type_id)) {
                return next(ApiError.BadRequest(`Invalid ID format: ${toy_type_id}`));
            }

            if (!toy_type_id) {
                return next(ApiError.BadRequest("Toy type ID is required"));
            }

            if (!RFID) {
                return next(ApiError.BadRequest("RFID is required"));
            }

            const toy: IToy = {toy_type_id, RFID};
            const toyDB: IToyDB = await ToyService.update(id, toy);
            const toyResponse: IToyResponse = {
                id: toyDB._id,
                ...toyDB._doc
            }

            response.status(200).json(toyResponse);
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

            const message: string = await ToyService.delete(id);
            response.status(200).json({message});
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

            const message: string = await ToyService.deleteMany(ids);
            response.status(200).json({message});
        } catch (error) {
            next(error);
        }
    }
}

export default new ToyController();
