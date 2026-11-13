import { MigrationInterface, QueryRunner } from "typeorm";

export default class InitialMigration1731400000000 implements MigrationInterface {
  name = "InitialMigration1731400000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "works_tb" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying(255) NOT NULL,
        "type" character varying(50) NOT NULL,
        "year" integer,
        "cover_url" text,
        "synopsis" text,
        "author" character varying(255),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "external_source_id" character varying,
        "external_source_type" character varying(50),
        CONSTRAINT "PK_works_tb" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "materials_tb" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying(255) NOT NULL,
        "type" character varying(50) NOT NULL,
        "year" integer,
        "cover_url" text,
        "synopsis" text,
        "author" character varying(255),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "level" character varying(20) NOT NULL,
        "why_it_fits" text,
        "where_to_find" text,
        CONSTRAINT "PK_materials_tb" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "relations_tb_relation_type_enum" AS ENUM('inspired_by', 'treats_theme', 'dialogues_with', 'references', 'deepens')
    `);

    await queryRunner.query(`
      CREATE TABLE "relations_tb" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "from_type" character varying(20) NOT NULL,
        "from_id" uuid NOT NULL,
        "to_type" character varying(20) NOT NULL,
        "to_id" uuid NOT NULL,
        "relation_type" "relations_tb_relation_type_enum" NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_relations_tb" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "trails_tb" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "work_id" uuid NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_trails_tb" PRIMARY KEY ("id"),
        CONSTRAINT "FK_trails_tb_work" FOREIGN KEY ("work_id") REFERENCES "works_tb"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "trail_items_tb_level_enum" AS ENUM('light', 'medium', 'dense')
    `);

    await queryRunner.query(`
      CREATE TABLE "trail_items_tb" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "trail_id" uuid NOT NULL,
        "material_id" uuid NOT NULL,
        "order_position" integer NOT NULL,
        "level" "trail_items_tb_level_enum" NOT NULL,
        "why_included" text NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_trail_items_tb" PRIMARY KEY ("id"),
        CONSTRAINT "FK_trail_items_tb_trail" FOREIGN KEY ("trail_id") REFERENCES "trails_tb"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_trail_items_tb_material" FOREIGN KEY ("material_id") REFERENCES "materials_tb"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_relations_tb_from" ON "relations_tb" ("from_type", "from_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_relations_tb_to" ON "relations_tb" ("to_type", "to_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_trails_tb_work" ON "trails_tb" ("work_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_trail_items_tb_trail" ON "trail_items_tb" ("trail_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_trail_items_tb_trail"`);
    await queryRunner.query(`DROP INDEX "IDX_trails_tb_work"`);
    await queryRunner.query(`DROP INDEX "IDX_relations_tb_to"`);
    await queryRunner.query(`DROP INDEX "IDX_relations_tb_from"`);
    await queryRunner.query(`DROP TABLE "trail_items_tb"`);
    await queryRunner.query(`DROP TYPE "trail_items_tb_level_enum"`);
    await queryRunner.query(`DROP TABLE "trails_tb"`);
    await queryRunner.query(`DROP TABLE "relations_tb"`);
    await queryRunner.query(`DROP TYPE "relations_tb_relation_type_enum"`);
    await queryRunner.query(`DROP TABLE "materials_tb"`);
    await queryRunner.query(`DROP TABLE "works_tb"`);
  }
}
