import type { CreationAttributes } from "sequelize";
import User from "../models/userModel.js";
import Roles from "../models/rolesModel.js";

const dataExclude = ["createdAt", "updatedAt", "last_attempt_reset"]

class AuthRepository {

    async findUserById(user_id: string) {
        const userInfo = await User.findByPk(user_id, { attributes: { exclude: dataExclude}, include: [{model: Roles, as: "rol"}]});
        return userInfo
    }

    async createUser(data:CreationAttributes<User>) {
        const createdUser = await User.create(data, {include: {model: Roles, as: "rol"}});
        const userInfo = this.findUserById(createdUser.dataValues.id)
        return userInfo
    }

    async resetUserAttempts(user_id: string) {
        const updated = await User.update({ attempts_remaining: 1, last_attempt_reset: new Date() }, { where: { user_id: user_id } });
    }

}

export default new AuthRepository();