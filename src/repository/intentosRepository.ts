import { Op, type CreationAttributes, type Transaction, fn, col, literal } from "sequelize";
import Intentos from "../models/intentosModel.js";
import User from "../models/userModel.js";

const excludeInfo = ["createdAt", "updatedAt"];

class IntentosRepository {
  /**
   * Create a new intento
   */
  async createIntento(
    data: CreationAttributes<Intentos>,
    options?: { transaction?: Transaction | null }
  ): Promise<Intentos> {
    const intento = await Intentos.create(data, {
      transaction: options?.transaction || null,
    });
    return intento;
  }

  /**
   * Find intento by ID
   */
  async findById(
    id: string,
    options?: { transaction?: Transaction | null }
  ): Promise<Intentos | null> {
    return await Intentos.findByPk(id, {
      attributes: { exclude: excludeInfo },
      transaction: options?.transaction || null,
    });
  }

  /**
   * Find all intentos of a specific user
   */
  async findByUserId(
    id_user: string,
    options?: { transaction?: Transaction | null }
  ): Promise<Intentos[]> {
    return await Intentos.findAll({
      where: { id_user },
      attributes: { exclude: excludeInfo },
      transaction: options?.transaction || null,
    });
  }

  /**
   * Find all intentos for a specific simulacro
   */
  async findBySimulacroId(
    simulacro_id: string,
    options?: { transaction?: Transaction | null }
  ): Promise<Intentos[]> {
    return await Intentos.findAll({
      where: { simulacro_id },
      attributes: { exclude: excludeInfo },
      transaction: options?.transaction || null,
    });
  }

  /**
   * Get all intentos
   */
  async findAll(options?: {
    transaction?: Transaction | null;
  }): Promise<Intentos[]> {
    return await Intentos.findAll({
      attributes: { exclude: excludeInfo },
      transaction: options?.transaction || null,
    });
  }

  /**
   * Update an intento
   */
  async updateIntento(
    id: string,
    data: Partial<CreationAttributes<Intentos>>,
    options?: { transaction?: Transaction | null }
  ): Promise<[affectedCount: number]> {
    return await Intentos.update(data, {
      where: { id },
      transaction: options?.transaction || null,
    });
  }

  /**
   * Delete an intento
   */
  async deleteIntento(
    id: string,
    options?: { transaction?: Transaction | null }
  ): Promise<number> {
    return await Intentos.destroy({
      where: { id },
      transaction: options?.transaction || null,
    });
  }

  
  
async getRankingGlobal(userId: string): Promise<{
  position: number | null;
  bestScore: number;
  ranking: Intentos[];
}> {

  // 1. Obtener mejor score del usuario (puede ser null)
  const userBest = await Intentos.findOne({
    attributes: [[fn("MAX", col("score")), "bestScore"]],
    where: { id_user: userId }
  });

  let bestScore = 0;

  // Si el usuario tiene algún intento
  if (userBest && userBest.get("bestScore") !== null) {
    bestScore = Number(userBest.get("bestScore"));
  }

  let position: number | null = null;

  // Si tiene intento, calcular su posición
  if (bestScore > 0) {
    const higherUsers = await Intentos.findAll({
      attributes: [
        "id_user",
        [fn("MAX", col("score")), "bestScore"]
      ],
      group: ["id_user"],
      having: literal(`MAX(score) > ${bestScore}`)
    });

    position = higherUsers.length + 1;
  }

  // 3. Obtener TOP 30 siempre, haya o no intentos del usuario
  const ranking = await Intentos.findAll({
    attributes: [
      "id_user",
      [fn("MAX", col("score")), "bestScore"]
    ],
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "last_name", "photo_url"]
      }
    ],
    group: ["id_user", "user.id"],
    order: [[fn("MAX", col("score")), "DESC"]],
    limit: 30
  });

  return {
    position,   // null si no tiene intentos
    bestScore,  // 0 si no tiene intentos
    ranking     // SIEMPRE lleno
  };
}


}

export default new IntentosRepository();
