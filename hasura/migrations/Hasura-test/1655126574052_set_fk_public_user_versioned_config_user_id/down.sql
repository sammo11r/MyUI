alter table "public"."user_versioned_config" drop constraint "user_versioned_config_user_id_fkey",
  add constraint "user_versioned_config_user_id_fkey"
  foreign key ("user_id")
  references "public"."users"
  ("id") on update restrict on delete restrict;