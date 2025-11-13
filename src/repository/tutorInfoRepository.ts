import {
  Op,
  QueryTypes,
  Transaction,
  type CreationAttributes,
  type WhereOptions,
} from "sequelize";
import TutorInfo from "../models/tutorInfoModel.js";
import User from "../models/userModel.js";
import { Certificate } from "crypto";
import Certificates from "../models/certificatesModel.js";
import ReseñasTutor from "../models/reseñasTutorModel.js";
import Roles from "../models/rolesModel.js";
import Cities from "../models/citiesModel.js";
import Areas from "../models/areasModel.js";
import { db } from "../core/db.js";

const excludeInfo = ["createdAt", "updatedAt"];

class TutorInfoRepository {
  async findById(
    id: string,
    options?: { transaction?: Transaction | null }
  ): Promise<TutorInfo | null> {
    return await TutorInfo.findByPk(id, {
      transaction: options?.transaction ?? null,
      attributes: { exclude: excludeInfo },
      include: {
        model: User,
        as: "user",
        attributes: { exclude: excludeInfo },
      },
    });
  }

  async findByUserId(user_id: string): Promise<TutorInfo | null> {
    return await TutorInfo.findOne({
      where: { user_id },
      include: {
        model: User,
        as: "user",
        attributes: { exclude: excludeInfo },
      },
    });
  }

  async getAll(): Promise<TutorInfo[]> {
    return await TutorInfo.findAll({
      attributes: { exclude: excludeInfo },
      include: {
        model: User,
        as: "user",
        attributes: { exclude: excludeInfo },
      },
    });
  }

  async update(
    id: string,
    data: Partial<CreationAttributes<TutorInfo>>,
    options?: { transaction?: Transaction | null }
  ): Promise<number> {
    const [affectedRows] = await TutorInfo.update(data, {
      where: { user_id: id },
      transaction: options?.transaction ?? null,
    });
    return affectedRows;
  }

  async drop(id: string): Promise<number> {
    return await TutorInfo.destroy({ where: { id } });
  }

  async create(
    data: Partial<CreationAttributes<TutorInfo>>,
    options?: { transaction?: Transaction | null }
  ): Promise<TutorInfo | null> {
    return await TutorInfo.create(
      data, // el id debe estar dentro del objeto
      { transaction: options?.transaction || null }
    );
  }

  async upsert(
    data: Partial<CreationAttributes<TutorInfo>>,
    options?: { transaction?: Transaction | null }
  ): Promise<TutorInfo | null> {
    const [record] = await TutorInfo.upsert(data, {
      transaction: options?.transaction || null,
      returning: true, // asegura que Sequelize devuelva el registro
    });

    return record;
  }

  async getTutors(
    page = 1,
    limit = 10 ,
    filters?: {
      cityId?: string | undefined;
      areaIds?: string[] | undefined;
      orderBy?: "precio" | "promedio" | undefined;
      orderDir?: "ASC" | "DESC" | undefined;
      name?: string | undefined;
      minPrice?: number | undefined;
      maxPrice?: number | undefined;
    } 
  ): Promise<{
    data: TutorInfo[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    const offset = (page - 1) * limit;

    // 🔹 Filtros para TutorInfo
    const tutorWhere: WhereOptions = {};
    if (filters?.minPrice || filters?.maxPrice) {
      tutorWhere["precio_hora"] = {
        ...(filters.minPrice ? { [Op.gte]: filters.minPrice } : {}),
        ...(filters.maxPrice ? { [Op.lte]: filters.maxPrice } : {}),
      };
    }

    // 🔹 Filtros para el usuario asociado
    const userWhere: WhereOptions = {
      ...(filters?.cityId && { city_id: filters.cityId }),
      ...(filters?.name && {
        [Op.or]: [
          { name: { [Op.iLike]: `%${filters.name}%` } },
          { last_name: { [Op.iLike]: `%${filters.name}%` } },
        ],
      }),
    };

    // 🔹 Orden base
    const order: any[] = [];
    if (filters?.orderBy === "precio") {
      order.push(["precio_hora", filters.orderDir || "ASC"]);
    } else {
      order.push(["createdAt", "DESC"]);
    }

    // ✅ Consulta principal
    const { count, rows } = await TutorInfo.findAndCountAll({
      where: tutorWhere,
      include: [
        {
          model: User,
          as: "user",
          where: userWhere,
          attributes: ["id", "name", "last_name", "photo_url", "cellphone", "city_id"],
          include: [
            {
              model: Roles,
              as: "rol",
              where: { name: "tutor" },
              attributes: [],
            },
            {
              model: Cities,
              as: "city",
              attributes: ["id", "name"],
            },
            {
              model: Areas,
              as: "areas",
              attributes: ["id", "name"],
              through: { attributes: [] },
              ...(filters?.areaIds?.length
                ? { where: { id: { [Op.in]: filters.areaIds } } }
                : {}),
            },
          ],
        },
        {
          model: Certificates,
          as: "certificates",
          attributes: ["id", "name", "url_resource"],
        },
        {
          model: ReseñasTutor,
          as: "reviews",
          attributes: ["id", "rating", "text"],
          include: [
            {
              model: User,
              as: "student",
              attributes: ["id", "name", "last_name", "photo_url"],
            },
          ],
        },
      ],
      limit,
      offset,
      distinct: true,
      order,
    });

    // ✅ Calcular promedio de reseñas (subconsulta aparte)
    const tutorIds = (rows as any[]).map((t) => t.id);
    const ratings =
      tutorIds.length > 0
        ? await db.query(
            `
          SELECT tutor_id, COALESCE(AVG(rating), 0)::float AS promedio
          FROM reseñas_tutor
          WHERE tutor_id IN (:ids)
          GROUP BY tutor_id
        `,
            {
              replacements: { ids: tutorIds },
              type: QueryTypes.SELECT,
            }
          )
        : [];

    const ratingMap = Object.fromEntries(
      ratings.map((r: any) => [r.tutor_id, r.promedio])
    );

    // ✅ Añadir promedio a cada tutor
    for (const tutor of rows as (TutorInfo & { id: string })[]) {
      tutor.setDataValue("promedio", ratingMap[tutor.id] || 0);
    }

    // ✅ Ordenar por promedio si aplica
    if (filters?.orderBy === "promedio") {
      rows.sort((a, b) => {
        const aAvg = a.getDataValue("promedio") ?? 0;
        const bAvg = b.getDataValue("promedio") ?? 0;
        return filters.orderDir === "ASC" ? aAvg - bAvg : bAvg - aAvg;
      });
    }

    return {
      data: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    };
  }
}

export default new TutorInfoRepository();
