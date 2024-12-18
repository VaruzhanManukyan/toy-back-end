import {Types} from "mongoose";
import argon2 from "argon2";
import ApiError from "../exceptions/api-error";
import {IUser, IUserDB} from "../shared/interfaces/user-interfaces";
import UserModel from "../models/user-model";

class UserService {
    async create(user: IUser): Promise<IUserDB> {
        const candidateWithEmail: IUserDB | null = await UserModel.findOne({email: user.email});
        if (candidateWithEmail) {
            throw ApiError.BadRequest(`User with this email address ${user.email} already exists`);
        }

        const hashPassword: string = await argon2.hash(user.password);
        user.password = hashPassword;
        const userDB = new UserModel(user);

        userDB.save();
        return userDB;
    }

    async getAll(): Promise<IUserDB[]> {
        try {
            const usersDB: IUserDB[] = await UserModel.find();
            return usersDB;
        } catch (error) {
            throw error;
        }
    }

    async getById(id: Types.ObjectId): Promise<IUserDB> {
        try {
            const userDB: IUserDB | null = await UserModel.findById(id);
            if (!userDB) {
                throw ApiError.BadRequest(`User with ID ${id} not found.`);
            }
            return userDB;
        } catch (error) {
            throw error;
        }
    }

    async update(id: Types.ObjectId, user: IUser): Promise<IUserDB> {
        try {
            const candidateWithEmail: IUserDB | null = await UserModel.findOne({email: user.email});
            if (candidateWithEmail && id.toString() !== candidateWithEmail._id.toString()) {
                throw ApiError.BadRequest(`User with this email address ${user.email} already exists`);
            }

            const userDB: IUserDB | null = await UserModel.findByIdAndUpdate(
                {_id: id},
                {$set: user},
                {new: true}
            );
            if (!userDB) {
                throw ApiError.BadRequest(`User with ID ${id} not found.`);
            }
            return userDB;
        } catch (error) {
            throw error;
        }
    }

    async delete(id: Types.ObjectId): Promise<string> {
        try {
            const result = await UserModel.deleteOne({_id: id});
            if (result.deletedCount === 0) {
                throw ApiError.BadRequest(`No user found for the provided IDs.`);
            }
            return `${result.deletedCount} User deleted successfully.`;
        } catch (error) {
            throw error;
        }
    }

    async deleteMany(ids: Types.ObjectId[]): Promise<string> {
        try {
            const result = await UserModel.deleteMany({_id: {$in: ids}});
            if (result.deletedCount === 0) {
                throw ApiError.BadRequest(`No Users found for the provided IDs.`);
            }
            return `${result.deletedCount} Users deleted successfully.`;
        } catch (error) {
            throw error;
        }
    }
}

export default new UserService();