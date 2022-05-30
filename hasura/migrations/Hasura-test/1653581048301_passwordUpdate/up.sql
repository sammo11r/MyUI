
alter table "public"."users" add column "password" text
 null;

alter table "public"."users" drop column "email" cascade;

INSERT INTO "public"."users"("id", "name", "created_at", "updated_at", "password") VALUES (6, E'admin', E'2022-05-26T16:03:09.052673+00:00', E'2022-05-26T16:03:09.052673+00:00', E'$2b$10$owg26lz6BEqx2IpdMCfwo.2oPyMU2CFlgBs565sSOy82p5RF2GybG');

INSERT INTO "public"."users"("id", "name", "created_at", "updated_at", "password") VALUES (7, E'editor', E'2022-05-26T16:03:25.037335+00:00', E'2022-05-26T16:03:25.037335+00:00', E'$2b$10$.q5d8gdb4oR/kDi.dzLHv.Bd/ReLgipOJLxayyt7/lwa6u59sNDee');

INSERT INTO "public"."users"("id", "name", "created_at", "updated_at", "password") VALUES (8, E'user', E'2022-05-26T16:04:08.282555+00:00', E'2022-05-26T16:04:08.282555+00:00', E'$2b$10$ABzgtZoFp2WqDhKGPD41MesAxgCToFVn0lmdpK2KXgDOznQsXnlLC');
