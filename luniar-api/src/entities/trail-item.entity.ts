import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Trail } from "./trail.entity.js";
import { Material } from "./material.entity.js";

export type TrailItemLevel = "light" | "medium" | "dense";

@Entity({ name: "trail_items_tb" })
export class TrailItem {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "trail_id" })
  trailId: string;

  @ManyToOne(() => Trail)
  @JoinColumn({ name: "trail_id" })
  trail: Trail;

  @Column({ name: "material_id" })
  materialId: string;

  @ManyToOne(() => Material)
  @JoinColumn({ name: "material_id" })
  material: Material;

  @Column({ name: "order_position" })
  orderPosition: number;

  @Column({ type: "enum", enum: ["light", "medium", "dense"], name: "level" })
  level: TrailItemLevel;

  @Column("text", { name: "why_included" })
  whyIncluded: string;

  @CreateDateColumn()
  createdAt: Date;
}
