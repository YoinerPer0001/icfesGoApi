import type { CreationAttributes } from "sequelize";
import User from "../models/userModel.js";

const dataExclude = ["createdAt", "updatedAt", "last_attempt_reset"]

class AuthRepository {

    async findUserById(user_id: string) {
        const userInfo = await User.findByPk(user_id, { attributes: { exclude: dataExclude } });
        return userInfo
    }

    async createUser(data:CreationAttributes<User>) {
        const createdUser = await User.create(data);
        return createdUser
    }

    async resetUserAttempts(user_id: string) {
        const updated = await User.update({ attempts_remaining: 1, last_attempt_reset: new Date() }, { where: { user_id: user_id } });
    }

}

export default new AuthRepository();