import { AppDataSource } from "../config/database";
import { MuscleGroup } from "../entities/MuscleGroup";

const muscleGroupRepository = AppDataSource.getRepository(MuscleGroup);

export class MuscleGroupService {
  static async findAll() {
    return await muscleGroupRepository.find({
      order: { sortOrder: "ASC" },
    });
  }

  static async seed() {
    const count = await muscleGroupRepository.count();
    if (count > 0) return;

    const groups = [
      { name: "胸", sortOrder: 1 },
      { name: "背中", sortOrder: 2 },
      { name: "肩", sortOrder: 3 },
      { name: "腕", sortOrder: 4 },
      { name: "脚", sortOrder: 5 },
      { name: "腹", sortOrder: 6 },
    ];

    await muscleGroupRepository.save(groups);
  }
}