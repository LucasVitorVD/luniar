import { Column, Entity } from "typeorm";
import { Content } from "./content.entity.js";

export enum Level {
  LIGHT = "light",
  MEDIUM = "medium",
  DENSE = "dense"
}

@Entity({ name: "materials_tb" })
export class Material extends Content {
  @Column({ type: "enum", enum: Level })
  level: Level

  @Column("text", { name: "why_it_fits", nullable: true })
  whyItFits: string

  @Column("text", { name: "where_to_find", nullable: true })
  whereToFind: string
}