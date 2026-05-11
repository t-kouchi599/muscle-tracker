import { AppDataSource } from "../config/database";
import { Workout } from "../entities/Workout";
import { WorkoutExercise } from "../entities/WorkoutExercise";
import { WorkoutSet } from "../entities/WorkoutSet";

const workoutRepository = AppDataSource.getRepository(Workout);
const workoutExerciseRepository = AppDataSource.getRepository(WorkoutExercise);
const workoutSetRepository = AppDataSource.getRepository(WorkoutSet);

export class WorkoutService {
  static async create(userId: string, date: string, note?: string) {
    const workout = workoutRepository.create({
      user: { id: userId } as any,
      date,
      note: note || undefined,
    });
    await workoutRepository.save(workout);
    return workout;
  }

  static async findAllByUser(userId: string) {
    return await workoutRepository.find({
      where: { user: { id: userId } },
      order: { date: "DESC" },
    });
  }

  static async findById(workoutId: string, userId: string) {
    const workout = await workoutRepository.findOne({
      where: { id: workoutId, user: { id: userId } },
      relations: [
        "workoutExercises",
        "workoutExercises.exercise",
        "workoutExercises.exercise.muscleGroup",
        "workoutExercises.sets",
      ],
      order: {
        workoutExercises: {
          sortOrder: "ASC",
          sets: { setNumber: "ASC" },
        },
      },
    });

    if (!workout) {
      throw new Error("ワークアウトが見つかりません");
    }

    return workout;
  }

  static async addExercise(workoutId: string, exerciseId: number, sortOrder: number) {
    const workoutExercise = workoutExerciseRepository.create({
      workout: { id: workoutId } as any,
      exercise: { id: exerciseId } as any,
      sortOrder,
    });
    await workoutExerciseRepository.save(workoutExercise);
    return workoutExercise;
  }

  static async addSet(
    workoutExerciseId: number,
    setNumber: number,
    weight: number,
    reps: number
  ) {
    const set = workoutSetRepository.create({
      workoutExercise: { id: workoutExerciseId } as any,
      setNumber,
      weight,
      reps,
    });
    await workoutSetRepository.save(set);
    return set;
  }

  static async deleteWorkout(workoutId: string, userId: string) {
    const workout = await workoutRepository.findOne({
      where: { id: workoutId, user: { id: userId } },
      relations: ["workoutExercises", "workoutExercises.sets"],
    });

    if (!workout) {
      throw new Error("ワークアウトが見つかりません");
    }

    for (const we of workout.workoutExercises) {
      await workoutSetRepository.remove(we.sets);
    }
    await workoutExerciseRepository.remove(workout.workoutExercises);
    await workoutRepository.remove(workout);
  }

  static async removeExercise(workoutExerciseId: number) {
    const workoutExercise = await workoutExerciseRepository.findOne({
      where: { id: workoutExerciseId },
    });

    if (!workoutExercise) {
      throw new Error("種目が見つかりません");
    }

    await workoutSetRepository.delete({ workoutExercise: { id: workoutExerciseId } });
    await workoutExerciseRepository.remove(workoutExercise);
  }

  static async removeSet(setId: number) {
    const set = await workoutSetRepository.findOne({
      where: { id: setId },
    });

    if (!set) {
      throw new Error("セットが見つかりません");
    }

    await workoutSetRepository.remove(set);
  }

  static async updateSet(setId: number, weight: number, reps: number) {
    const set = await workoutSetRepository.findOne({
      where: { id: setId },
    });

    if (!set) {
      throw new Error("セットが見つかりません");
    }

    set.weight = weight;
    set.reps = reps;
    await workoutSetRepository.save(set);
    return set;
  }
}