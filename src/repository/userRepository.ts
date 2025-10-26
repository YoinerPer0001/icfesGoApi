import type { CreationAttributes, Transaction } from "sequelize";
import User from "../models/userModel.js";
import Roles from "../models/rolesModel.js";

const excludeInfo = ["createdAt", "updatedAt"]

class UserRepository {
    async findById(id:string, options?: {transaction:Transaction | null}): Promise<User | null>  {
        return await User.findByPk(id, {transaction: options?.transaction ?? null, attributes: {exclude: ["createdAt", "updatedAt", "password"]}})
    }

    async findByFirebaseId(id:string): Promise<User | null>  {
        return await User.findOne({where: {firebase_uid: id}, include: {model: Roles, as: "rol", attributes: {exclude: excludeInfo}}})
    }

    async findByEmail(email:string, options?: {transaction:Transaction | null}): Promise<User | null>  {
        return await User.findOne({where: {email:email}, include: {model: Roles, as: "rol", attributes: {exclude: excludeInfo}}})
    }

    async getAll() {
        return await User.findAll()
    }

    async create(user:CreationAttributes<User>) : Promise<User | null> {
        return await User.create(user)
    }

    async update(id:string, data:Partial<CreationAttributes<User>>, options?:{transaction:Transaction | null}) : Promise<number> {
        const [affectedRows] = await User.update(data, {where: {id: id}, transaction: options?.transaction ?? null})
        return affectedRows
    }

    async drop(id:string) : Promise<number> {
        return await User.destroy({where: {user_id : id}})
    }
}

export default new UserRepository;