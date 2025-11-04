import {
  literal,
  Sequelize,

  type CreationAttributes,
  type Transaction,
  Op, type WhereOptions
} from "sequelize";
import User from "../models/userModel.js";
import Roles from "../models/rolesModel.js";
import Cities from "../models/citiesModel.js";
import TutorInfo from "../models/tutorInfoModel.js";
import ReseñasTutor from "../models/reseñasTutorModel.js";
import UserAreas from "../models/userAreasModel.js";
import Areas from "../models/areasModel.js";
import Certificates from "../models/certificatesModel.js";

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
    limit = 10,
    filters?: {
      cityId?: string | undefined;
      areaIds?: string[];
      orderBy?: "precio" | "promedio";
      orderDir?: "ASC" | "DESC";
      name?: string;
      minPrice?: number;
      maxPrice?: number;
    }
  ): Promise<{
    data: User[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    const offset = (page - 1) * limit;
    const where: WhereOptions = {};

    // 🔹 Filtro por ciudad
    if (filters?.cityId) {
      where["city_id"] = filters.cityId;
    }

    // 🔹 Filtro por nombre (name o last_name)
    if (filters?.name) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${filters.name}%` } },
        { last_name: { [Op.iLike]: `%${filters.name}%` } },
      ];
    }

    // 🔹 Orden dinámico
    const order: any[] = [];

    if (filters?.orderBy === "precio") {
      order.push([
        { model: TutorInfo, as: "tutor_info" },
        "precio_hora",
        filters.orderDir || "ASC",
      ]);
    } else if (filters?.orderBy === "promedio") {
      order.push([
        literal(`(
          SELECT COALESCE(AVG(r.rating), 0)
          FROM reseñas_tutor AS r
          WHERE r.tutor_id = "tutor_info"."id"
        )`),
        filters.orderDir || "DESC",
      ]);
    } else {
      order.push(["createdAt", "DESC"]); // orden por defecto
    }

    // 🔹 Filtro por rango de precios
    const tutorWhere: WhereOptions = {};
    if (filters?.minPrice || filters?.maxPrice) {
      tutorWhere["precio_hora"] = {
        ...(filters.minPrice ? { [Op.gte]: filters.minPrice } : {}),
        ...(filters.maxPrice ? { [Op.lte]: filters.maxPrice } : {}),
      };
    }

    // 🔹 Filtro por áreas (many-to-many)
    const includeAreas = {
      model: Areas,
      as: "areas",
      attributes: ["id", "name"],
      through: { attributes: [] },
      ...(filters?.areaIds?.length
        ? { where: { id: { [Op.in]: filters.areaIds } } }
        : {}),
    };

    // ✅ Consulta principal
    const { count, rows } = await User.findAndCountAll({
      subQuery: false,
      where,
      include: [
        {
          model: Roles,
          as: "rol",
          where: { name: "tutor" },
          attributes: [],
        },
        includeAreas,
        {
          model: Cities,
          as: "city",
          attributes: { exclude: excludeInfo },
        },
        {
          model: TutorInfo,
          as: "tutor_info",
          where: tutorWhere,
          attributes: [
            "id",
            "verified",
            "precio_hora",
            "biografia",
            "sobre_mi",
            "sesiones_type",
            [
              literal(`(
                SELECT COALESCE(AVG(r.rating), 0)
                FROM reseñas_tutor AS r
                WHERE r.tutor_id = "tutor_info"."id"
              )`),
              "promedio",
            ],
          ],
          include: [
            {
              model: ReseñasTutor,
              as: "reviews",
              separate: true,
              attributes: ["id", "rating", "text"],
              include:{
                model: User,
                as: "student",
                attributes: ["id", "name", "last_name", "photo_url" ]
              }
            },
            {
              model:Certificates, as: "certificates",
              attributes: ["id", "name", "url_resource"]
            }
          ]
        },
      ],
      attributes: ["id", "name", "last_name", "photo_url", "cellphone"],
      limit,
      offset,
      distinct: true,
      order,
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
