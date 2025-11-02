import {
  literal,
  Sequelize,
  type CreationAttributes,
  type Transaction,
} from "sequelize";
import User from "../models/userModel.js";
import Roles from "../models/rolesModel.js";
import Cities from "../models/citiesModel.js";
import TutorInfo from "../models/tutorInfoModel.js";
import ReseñasTutor from "../models/reseñasTutorModel.js";
import UserAreas from "../models/userAreasModel.js";
import Areas from "../models/areasModel.js";

const excludeInfo = ["createdAt", "updatedAt"];

class UserRepository {
  async findById(
    id: string,
    options?: { transaction: Transaction | null }
  ): Promise<User | null> {
    return await User.findByPk(id, {
      transaction: options?.transaction ?? null,
      attributes: { exclude: ["createdAt", "updatedAt", "password"] },
    });
  }

  async findByFirebaseId(id: string): Promise<User | null> {
    return await User.findOne({
      where: { firebase_uid: id },
      include: {
        model: Roles,
        as: "rol",
        attributes: { exclude: excludeInfo },
      },
    });
  }

  async findByEmail(
    email: string,
    options?: { transaction: Transaction | null }
  ): Promise<User | null> {
    return await User.findOne({
      where: { email: email },
      include: {
        model: Roles,
        as: "rol",
        attributes: { exclude: excludeInfo },
      },
    });
  }

  async getAll() {
    return await User.findAll();
  }

  async getTutors(
    page = 1,
    limit = 10
  ): Promise<{
    data: User[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      subQuery: false,
      where: {}, // puedes agregar filtros si lo necesitas
      include: [
        {
          model: Roles,
          as: "rol",
          where: { name: "tutor" },
          attributes: [],
        },
        {
          model: Areas,
          as: "areas",
          attributes: ["id", "name"],
          through: { attributes: [] },
        },
        {
          model: Cities,
          as: "city",
          attributes: { exclude: excludeInfo },
        },
        {
          model: TutorInfo,
          as: "tutor_info",
          attributes: [
            "id",
            "verified",
            "precio_hora",
            [
              literal(`(
              SELECT COALESCE(AVG(r.rating), 0)
              FROM reseñas_tutor AS r
              WHERE r.tutor_id = "tutor_info"."id"
            )`),
              "promedio",
            ],
          ],
        },
      ],
      attributes: ["name", "last_name", "id", "photo_url"],
      limit,
      offset,
      distinct: true, // 👈 importante cuando hay relaciones hasMany
      order: [["createdAt", "DESC"]], // opcional: ordena por fecha o nombre
    });

    return {
      data: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    };
  }

  async create(user: CreationAttributes<User>): Promise<User | null> {
    return await User.create(user);
  }

  async update(
    id: string,
    data: Partial<CreationAttributes<User>>,
    options?: { transaction: Transaction | null }
  ): Promise<number> {
    const [affectedRows] = await User.update(data, {
      where: { id: id },
      transaction: options?.transaction ?? null,
      returning: true,
    });
    return affectedRows;
  }

  async drop(id: string): Promise<number> {
    return await User.destroy({ where: { user_id: id } });
  }
}

export default new UserRepository();
