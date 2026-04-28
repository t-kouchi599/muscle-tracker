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
    });

    if (!workout) {
      throw new Error("ワークアウトが見つかりません");
    }

    await workoutRepository.remove(workout);
  }
}