import argon2 from "argon2";
import {Types} from "mongoose";
import ApiError from "../exceptions/api-error";
import {IPublisher, IPublisherDB, IPublisherTemp} from "../shared/interfaces/publisher-interfaces";
import PublisherModel from "../models/publisher-model";

class PublisherService {
    async create(publisher: IPublisher): Promise<IPublisherDB> {
        try {
            const {name, email, phone} = publisher;

            const candidateWithName: IPublisherDB | null = await PublisherModel.findOne({name});
            if (candidateWithName) {
                throw ApiError.BadRequest(`Publisher with this name ${name} already exists.`);
            }

            const candidateWithEmail: IPublisherDB | null = await PublisherModel.findOne({email});
            if (candidateWithEmail) {
                throw ApiError.BadRequest(`Publisher with this email address ${email} already exists`);
            }

            const candidateWithPhone: IPublisherDB | null = await PublisherModel.findOne({phone});
            if (candidateWithPhone) {
                throw ApiError.BadRequest(`Publisher with the same phone number ${phone} already exists.`);
            }

            const hashPassword: string = await argon2.hash(publisher.password);
            const publisherDB = new PublisherModel({
                scenario_ids: [],
                name: publisher.name,
                email: publisher.email,
                password: hashPassword,
                phone: publisher.phone
            });

            await publisherDB.save();
            return publisherDB;
        } catch (error) {
            throw error;
        }
    }

    async getAll(): Promise<IPublisherDB[]> {
        try {
            const publishersDB: IPublisherDB[] = await PublisherModel.find();
            return publishersDB;
        } catch (error) {
            throw error;
        }
    }

    async getById(id: Types.ObjectId): Promise<IPublisherDB> {
        try {
            const publisherDB: IPublisherDB | null = await PublisherModel.findById(id);
            if (!publisherDB) {
                throw ApiError.BadRequest(`Publisher with id ${id} not found.`);
            }
            return publisherDB;
        } catch (error) {
            throw error;
        }
    }

    async update(id: Types.ObjectId, publisher: IPublisherTemp): Promise<IPublisherDB> {
        try {
            const {name, email, phone} = publisher;

            const candidateWithName: IPublisherDB | null = await PublisherModel.findOne({name});
            if (candidateWithName && id.toString() !== candidateWithName._id.toString()) {
                throw ApiError.BadRequest(`A publisher with this name ${name} already exists.`);
            }

            const candidateWithEmail: IPublisherDB | null = await PublisherModel.findOne({email});
            if (candidateWithEmail && id.toString() !== candidateWithEmail._id.toString()) {
                throw ApiError.BadRequest(`A publisher with this email address ${email} already exists`);
            }

            const candidateWithPhone: IPublisherDB | null = await PublisherModel.findOne({phone});
            if (candidateWithPhone && id.toString() !== candidateWithPhone._id.toString()) {
                throw ApiError.BadRequest(`A publisher with the same phone number ${phone} already exists.`);
            }

            const publisherDB: IPublisherDB | null = await PublisherModel.findOneAndUpdate(
                {_id: id},
                {$set: publisher},
                {new: true}
            );
            if (!publisherDB) {
                throw ApiError.BadRequest(`Publishers not found.`);
            }
            return publisherDB;
        } catch (error) {
            throw error;
        }
    }

    async delete(id: Types.ObjectId): Promise<string> {
        try {
            const result = await PublisherModel.deleteOne({_id: id});
            if (!result) {
                throw ApiError.BadRequest(`Publisher with id ${id} not found.`);
            }
            return "Publisher is delete";
        } catch (error) {
            throw error;
        }
    }

    async deleteMany(ids: Types.ObjectId[]): Promise<string> {
        try {
            const result = await PublisherModel.deleteMany({_id: {$in: ids}});
            if (result.deletedCount === 0) {
                throw ApiError.BadRequest(`No Publishers found for the provided IDs.`);
            }
            return `${result.deletedCount} Publisher(s) deleted successfully.`;
        } catch (error) {
            throw error;
        }
    }
}

export default new PublisherService();