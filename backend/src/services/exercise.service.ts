import { AppDataSource } from "../config/database";
import { Exercise } from "../entities/Exercise";
import { MuscleGroup } from "../entities/MuscleGroup";

const exerciseRepository = AppDataSource.getRepository(Exercise);
const muscleGroupRepository = AppDataSource.getRepository(MuscleGroup);

export class ExerciseService {
  static async findAll() {
    return await exerciseRepository.find({
      relations: ["muscleGroup"],
      order: { muscleGroup: { sortOrder: "ASC" }, name: "ASC" },
    });
  }

  static async findByMuscleGroup(muscleGroupId: number) {
    return await exerciseRepository.find({
      where: { muscleGroup: { id: muscleGroupId } },
      relations: ["muscleGroup"],
      order: { name: "ASC" },
    });
  }

  static async create(name: string, muscleGroupId: number, userId?: string) {
    const muscleGroup = await muscleGroupRepository.findOne({
      where: { id: muscleGroupId },
    });

    if (!muscleGroup) {
      throw new Error("部位が見つかりません");
    }

    const exercise = exerciseRepository.create({
      name,
      muscleGroup,
      isCustom: !!userId,
      createdBy: userId ? { id: userId } as any : null,
    });

    await exerciseRepository.save(exercise);
    return exercise;
  }

  static async seed() {
    const count = await exerciseRepository.count();
    if (count > 0) return;

    const exercises = [
      { name: "ベンチプレス", muscleGroup: { id: 1 } },
      { name: "ダンベルフライ", muscleGroup: { id: 1 } },
      { name: "チェストプレス", muscleGroup: { id: 1 } },
      { name: "デッドリフト", muscleGroup: { id: 2 } },
      { name: "ラットプルダウン", muscleGroup: { id: 2 } },
      { name: "ベントオーバーロウ", muscleGroup: { id: 2 } },
      { name: "ショルダープレス", muscleGroup: { id: 3 } },
      { name: "サイドレイズ", muscleGroup: { id: 3 } },
      { name: "アームカール", muscleGroup: { id: 4 } },
      { name: "トライセプスエクステンション", muscleGroup: { id: 4 } },
      { name: "スクワット", muscleGroup: { id: 5 } },
      { name: "レッグプレス", muscleGroup: { id: 5 } },
      { name: "レッグカール", muscleGroup: { id: 5 } },
      { name: "クランチ", muscleGroup: { id: 6 } },
      { name: "レッグレイズ", muscleGroup: { id: 6 } },
    ];

    await exerciseRepository.save(exercises);
  }
}