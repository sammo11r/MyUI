
DELETE FROM "public"."users" WHERE "id" = 8;

DELETE FROM "public"."users" WHERE "id" = 7;

DELETE FROM "public"."users" WHERE "id" = 6;

alter table "public"."users" alter column "email" drop not null;
alter table "public"."users" add column "email" text;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."users" add column "password" text
--  null;
