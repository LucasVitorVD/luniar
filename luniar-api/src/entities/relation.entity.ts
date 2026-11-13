import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from "typeorm";

export type RelationFromToType = "work" | "material";

export type RelationType =
  | "inspired_by"
  | "treats_theme"
  | "dialogues_with"
  | "references"
  | "deepens";

@Entity({ name: "relations_tb" })
export class Relation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "enum", enum: ["work", "material"], name: "from_type" })
  fromType: RelationFromToType;

  @Column({ name: "from_id" })
  fromId: string;

  @Column({ type: "enum", enum: ["work", "material"], name: "to_type" })
  toType: RelationFromToType;

  @Column({ name: "to_id" })
  toId: string;

  @Column({ type: "enum", enum: ["inspired_by", "treats_theme", "dialogues_with", "references", "deepens"], name: "relation_type" })
  relationType: RelationType;

  @CreateDateColumn()
  createdAt: Date;
}
