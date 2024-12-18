import {Request, Response, NextFunction} from "express";
import {Types} from "mongoose";
import ApiError from "../exceptions/api-error";
import {
    IPublisher,
    IPublisherAllResponse,
    IPublisherDB,
    IPublisherResponse,
    IPublisherTemp
} from "../shared/interfaces/publisher-interfaces";
import PublisherService from "../services/publisher-service";

class PublisherController {
    async create(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const {name, email, password, phone} = request.body;

            if (!name) {
                return next(ApiError.BadRequest("Name is required."));
            }

            if (!email) {
                return next(ApiError.BadRequest("Email is required."));
            }

            if (!password) {
                return next(ApiError.BadRequest("Password is required."));
            }

            if (!phone) {
                return next(ApiError.BadRequest("Phone is required."));
            }

            const publisher: IPublisher = {
                scenario_ids: [],
                name,
                email,
                password,
                phone
            }

            const publisherDB: IPublisherDB = await PublisherService.create(publisher);
            const publisherResponse: IPublisherResponse = {
                id: publisherDB._id,
                ...publisherDB._doc
            }

            response.status(201).json(publisherResponse);
        } catch (error) {
            next(error);
        }
    }

    async getAll(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const publishersDB: IPublisherDB[] = await PublisherService.getAll();
            const publisherAllResponse: IPublisherAllResponse = {
                data: publishersDB.map(item => ({
                    id: item._id,
                    ...item._doc
                })),
                total: publishersDB.length
            };

            response.status(200).json(publisherAllResponse);
        } catch (error) {
            next(error);
        }
    }

    async getById(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = request.body;
            if (!Types.ObjectId.isValid(id)) {
                return next(ApiError.BadRequest(`Invalid ID format: ${id}`));
            }

            const publisherDB: IPublisherDB = await PublisherService.getById(id);
            const publisherResponse: IPublisherResponse = {
                id: publisherDB._id,
                ...publisherDB._doc
            };

            response.status(200).json(publisherResponse);
        } catch (error) {
            next(error);
        }
    }

    async update(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {

            const {id, name, email, phone} = request.body;

            if (!name) {
                return next(ApiError.BadRequest("Name is required."));
            }
            if (!email) {
                return next(ApiError.BadRequest("Email is required."));
            }

            if (!phone) {
                return next(ApiError.BadRequest("Phone is required."));
            }
            if (!Types.ObjectId.isValid(id)) {
                return next(ApiError.BadRequest(`Invalid ID format: ${id}`));
            }

            const publisher: IPublisherTemp = {
                scenario_ids: [],
                name,
                email,
                phone
            }

            const publisherDB: IPublisherDB = await PublisherService.update(id, publisher);
            const publisherResponse: IPublisherResponse = {
                id: publisherDB._id,
                ...publisherDB._doc
            };

            response.status(200).json(publisherResponse);
        } catch (error) {
            next(error);
        }
    }

    async delete(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = request.body;
            if (!Types.ObjectId.isValid(id)) {
                return next(ApiError.BadRequest(`Invalid ID format: ${id}`));
            }

            const message: string = await PublisherService.delete(id);
            response.status(200).json({ message });
        } catch (error) {
            next(error);
        }
    }

    async deleteMany(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const { ids } = request.body;
            if (!Array.isArray(ids) || !ids.every(id => Types.ObjectId.isValid(id))) {
                return next(ApiError.BadRequest("Invalid ID format(s) in the request."));
            }

            const messages: string = await PublisherService.deleteMany(ids);
            response.status(200).json({ messages });
        } catch (error) {
            next(error);
        }
    }
}

export default new PublisherController();