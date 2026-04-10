import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from "typeorm";
import { Exercise } from "./Exercise";

@Entity("muscle_groups")
export class MuscleGroup {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ default: 0 })
  sortOrder!: number;

  @OneToMany(() => Exercise, (exercise) => exercise.muscleGroup)
  exercises!: Exercise[];
}