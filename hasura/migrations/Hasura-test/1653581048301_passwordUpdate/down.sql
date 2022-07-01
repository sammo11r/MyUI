
DELETE FROM "public"."users" WHERE "id" = 1;

DELETE FROM "public"."users" WHERE "id" = 2;

DELETE FROM "public"."users" WHERE "id" = 3;

alter table "public"."users" drop column "role";

alter table "public"."users" drop column "password";