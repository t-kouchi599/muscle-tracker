import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { WorkoutExercise } from "./WorkoutExercise";

@Entity("workout_sets")
export class WorkoutSet {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => WorkoutExercise, (we) => we.sets)
  workoutExercise!: WorkoutExercise;

  @Column()
  setNumber!: number;

  @Column({ type: "decimal", precision: 5, scale: 2 })
  weight!: number;

  @Column()
  reps!: number;

  @Column({ default: false })
  isPr!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}