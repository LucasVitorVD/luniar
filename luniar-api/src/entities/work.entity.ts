import { Column, Entity } from "typeorm";
import { Content } from "./content.entity.js";

@Entity({ name: "works_tb" })
export class Work extends Content {
  @Column({ name: "external_source_id" })
  externalSourceId: string

  @Column({ length: 50, name: "external_source_type" })
  externalSourceType: string
}