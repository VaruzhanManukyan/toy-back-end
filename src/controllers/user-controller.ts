import {Request, Response, NextFunction} from "express";
import {Types} from "mongoose";
import ApiError from "../exceptions/api-error";
import {IUser, IUserAllResponse, IUserDB, IUserResponse} from "../shared/interfaces/user-interfaces";
import UserService from "../services/user-service";

class UserController {
    async create(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const {email, password} = request.body;

            if (!email) {
                return next(ApiError.BadRequest("Email is required"));
            }

            if (!password) {
                return next(ApiError.BadRequest("Password is required"));
            }

            const user: IUser = {
                email,
                password,
                role: "USER",
                device_ids: [],
                scenario_ids: []
            }
            const userDB: IUserDB = await UserService.create(user);
            const userResponse: IUserResponse = {
                id: userDB._id,
                ...userDB._doc,
            }

            response.status(201).json(userResponse);
        } catch (error) {
            next(error);
        }
    }

    async getAll(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const usersDB: IUserDB[] = await UserService.getAll();
            const toysResponse: IUserAllResponse = {
                data: usersDB.map((item: IUserDB) => ({
                    id: item._id,
                    ...item._doc
                })),
                total: usersDB.length
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


            const userDB: IUserDB = await UserService.getById(id);
            const userResponse: IUserResponse = {
                id: userDB._id,
                ...userDB._doc
            }

            response.status(200).json(userResponse);
        } catch (error) {
            next(error);
        }
    }

    async update(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const {id, email, password, device_ids, scenario_ids} = request.body;
            if (!Types.ObjectId.isValid(id)) {
                return next(ApiError.BadRequest(`Invalid ID format: ${id}`));
            }

            if (!email) {
                return next(ApiError.BadRequest("Email is required"));
            }

            const user: IUser = {
                email,
                password,
                role: "USER",
                device_ids,
                scenario_ids
            }
            const userDB: IUserDB = await UserService.update(id, user);
            const userResponse: IUserResponse = {
                id: userDB._id,
                ...userDB._doc
            }

            response.status(200).json(userResponse);
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

            const message: string = await UserService.delete(id);
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

            const message: string = await UserService.deleteMany(ids);
            response.status(200).json({message});
        } catch (error) {
            next(error);
        }
    }
}

export default new UserController();