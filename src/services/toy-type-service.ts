import fs from "fs";
import path from "path";
import {Types} from 'mongoose';
import ApiError from '../exceptions/api-error';
import {IToyType, IToyTypeDB} from "../shared/interfaces/toy-type-interfaces";
import ToyTypeModel from '../models/toy-type-model';

class ToyTypeService {
    async create(toyType: IToyType): Promise<IToyTypeDB> {
        try {
            const candidateWithName: IToyTypeDB | null = await ToyTypeModel.findOne({name: toyType.name});
            if (candidateWithName) {
                throw ApiError.BadRequest(`Tou type with this name ${toyType.name} already exists.`);
            }

            const toyTypeDB = new ToyTypeModel(toyType);
            await toyTypeDB.save();
            let newPath: string = "";
            if (toyTypeDB._doc.imageSrc) {
                newPath = `${toyTypeDB._id}%${toyTypeDB._doc.imageSrc.split("%")[1]}`;
                fs.renameSync(`uploads-image\\${toyTypeDB._doc.imageSrc}`, `uploads-image\\${newPath}`);
            }

            const toyTypeDBUpdate: IToyTypeDB | null = await ToyTypeModel.findOneAndUpdate(
                {_id: toyTypeDB._id},
                {$set: {imageSrc: newPath}},
                {new: true}
            );
            if (!toyTypeDBUpdate) {
                throw ApiError.BadRequest(`Tou type with id ${toyTypeDB._id} not found.`);
            }

            return toyTypeDBUpdate;
        } catch (error) {
            throw error;
        }
    }

    async getAll(): Promise<IToyTypeDB[]> {
        try {
            const ToyTypesDB: IToyTypeDB[] = await ToyTypeModel.find();
            return ToyTypesDB;
        } catch (error) {
            throw error;
        }
    }

    async getById(id: Types.ObjectId): Promise<IToyTypeDB> {
        try {
            const toyTypeDB: IToyTypeDB | null = await ToyTypeModel.findById(id);
            if (!toyTypeDB) {
                throw ApiError.BadRequest(`Tou type with ID ${id} not found.`);
            }
            return toyTypeDB;
        } catch (error) {
            throw error;
        }
    }

    async update(id: Types.ObjectId, toyType: IToyType): Promise<IToyTypeDB> {
        try {
            const candidateWithName: IToyTypeDB | null = await ToyTypeModel.findOne({name: toyType.name});
            if (candidateWithName && id.toString() !== candidateWithName._id.toString()) {
                throw ApiError.BadRequest(`Toy type with this name ${name} already exists.`);
            }

            const toyTypeDB: IToyTypeDB | null = await ToyTypeModel.findById(id);
            if (!toyTypeDB) {
                throw ApiError.BadRequest(`ToyType with ID ${id} not found.`);
            }

            if (toyTypeDB._doc.imageSrc !== toyType.imageSrc) {
                const filePath: string = path.resolve(`uploads-image\\${toyTypeDB._doc.imageSrc}`);
                fs.unlink(filePath, (error) => {
                    if (error) {
                        console.error(`Failed to delete file ${filePath}: ${error.message}`);
                    }
                });
            }

            const toyTypeDBUpdated: IToyTypeDB | null = await ToyTypeModel.findByIdAndUpdate(
                {_id: id},
                {$set: toyType},
                {new: true}
            );

            if (!toyTypeDBUpdated) {
                throw ApiError.BadRequest(`Tou type with ID ${id} not found.`);
            }
            return toyTypeDBUpdated;
        } catch (error) {
            throw error;
        }
    }

    async delete(id: Types.ObjectId): Promise<string> {
        try {
            const toyTypeDB: IToyTypeDB | null = await ToyTypeModel.findById(id);
            if (!toyTypeDB) {
                throw ApiError.BadRequest(`Tou type with ID ${id} not found.`);
            }

            const result = await ToyTypeModel.findByIdAndDelete(id);
            if (!result) {
                throw ApiError.BadRequest(`Toy type with ID ${id} not found.`);
            }

            const filePath: string = path.resolve(`uploads-image\\${toyTypeDB._doc.imageSrc}`);
            fs.unlink(filePath, (error) => {
                if (error) {
                    console.error(`Failed to delete file ${filePath}: ${error.message}`);
                }
            });

            return "Toy type is delete";
        } catch (error) {
            throw error;
        }
    }

    async deleteMany(ids: Types.ObjectId[]): Promise<string> {
        try {
            let deletedCount: number = 0;

            for (const id of ids) {
                const toyTypeDB: IToyTypeDB | null = await ToyTypeModel.findById(id);
                if (!toyTypeDB) {
                    throw ApiError.BadRequest(`Tou type with ID ${id} not found.`);
                }

                const filePath: string = path.resolve(`uploads-image\\${toyTypeDB._doc.imageSrc}`);
                fs.unlink(filePath, (error) => {
                    if (error) {
                        console.error(`Failed to delete file ${filePath}: ${error.message}`);
                    }
                });

                const result = await ToyTypeModel.deleteOne({_id: id});
                if (result.deletedCount === 0) {
                    throw ApiError.BadRequest(`Failed to delete audio file with id ${id}.`);
                }

                deletedCount += result.deletedCount;
            }

            return `${deletedCount} audio file(s) deleted successfully.`;
        } catch (error) {
            throw error;
        }
    }

    async searchByPriceRange(minPrice: number, maxPrice: number) {
        try {
            return await ToyTypeModel.find({
                price: {$gte: minPrice, $lte: maxPrice}
            }).populate('supplier_id personage_obj_state_id default_scenario_id');
        } catch (error) {
            throw error;
        }
    }
}

export default new ToyTypeService();
