

alter table "public"."user_versioned_config" drop constraint "user_versioned_config_user_id_fkey",
  add constraint "user_versioned_config_user_id_fkey"
  foreign key ("user_id")
  references "public"."users"
  ("id") on update cascade on delete cascade;

alter table "public"."user_versioned_config" drop constraint "user_versioned_config_user_id_fkey",
  add constraint "user_versioned_config_user_id_fkey"
  foreign key ("user_id")
  references "public"."users"
  ("id") on update cascade on delete cascade;

alter table "public"."user_versioned_config" drop constraint "user_versioned_config_user_id_fkey",
  add constraint "user_versioned_config_user_id_fkey"
  foreign key ("user_id")
  references "public"."users"
  ("id") on update restrict on delete restrict;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."users" add column "role" text
--  null default 'user';
