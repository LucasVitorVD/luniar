import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Work } from "./work.entity.js";

@Entity({ name: "trails_tb" })
export class Trail {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "work_id" })
  workId: string;

  @ManyToOne(() => Work)
  @JoinColumn({ name: "work_id" })
  work: Work;

  @CreateDateColumn()
  createdAt: Date;
}
