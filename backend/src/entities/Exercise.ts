import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { MuscleGroup } from "./MuscleGroup";
import { User } from "./User";

@Entity("exercises")
export class Exercise {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @ManyToOne(() => MuscleGroup, (mg) => mg.exercises)
  muscleGroup!: MuscleGroup;

  @Column({ default: false })
  isCustom!: boolean;

  @ManyToOne(() => User, { nullable: true })
  createdBy!: User | null;

  @CreateDateColumn()
  createdAt!: Date;
}