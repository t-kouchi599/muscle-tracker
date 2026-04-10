import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Workout } from "./Workout";
import { Exercise } from "./Exercise";
import { WorkoutSet } from "./WorkoutSet";

@Entity("workout_exercises")
export class WorkoutExercise {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Workout, (workout) => workout.workoutExercises)
  workout!: Workout;

  @ManyToOne(() => Exercise)
  exercise!: Exercise;

  @Column({ default: 0 })
  sortOrder!: number;

  @OneToMany(() => WorkoutSet, (set) => set.workoutExercise)
  sets!: WorkoutSet[];
}