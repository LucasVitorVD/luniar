import { Column, CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";

export abstract class Content {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  title: string

  @Column({ length: 50 })
  type: string

  @Column("integer", { nullable: true })
  year: number

  @Column("text", { name: "cover_url", nullable: true })
  coverUrl: string

  @Column("text", { nullable: true })
  synopsis: string

  @Column({ nullable: true })
  author: string

  @CreateDateColumn()
  createdAt: Date
}