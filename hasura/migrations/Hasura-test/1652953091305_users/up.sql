


CREATE TABLE "public"."users" ("id" serial NOT NULL, "name" text NOT NULL, "email" text NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") );
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_users_updated_at"
BEFORE UPDATE ON "public"."users"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_users_updated_at" ON "public"."users" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

INSERT INTO "public"."users"("id", "name", "email", "created_at", "updated_at") VALUES (1, E'Demo user 1', E'demoemail1@domain.com', E'2022-05-19T09:37:46.250791+00:00', E'2022-05-19T09:37:46.250791+00:00');

INSERT INTO "public"."users"("id", "name", "email", "created_at", "updated_at") VALUES (2, E'Demo user 2', E'demoemail2@domain.com', E'2022-05-19T09:37:55.471197+00:00', E'2022-05-19T09:37:55.471197+00:00');

INSERT INTO "public"."users"("id", "name", "email", "created_at", "updated_at") VALUES (3, E'Demo user 3', E'demoemail3@domain.com', E'2022-05-19T09:38:01.858341+00:00', E'2022-05-19T09:38:01.858341+00:00');

INSERT INTO "public"."users"("id", "name", "email", "created_at", "updated_at") VALUES (4, E'Demo user 4', E'demoemail4@domain.com', E'2022-05-19T09:38:06.79263+00:00', E'2022-05-19T09:38:06.79263+00:00');

INSERT INTO "public"."users"("id", "name", "email", "created_at", "updated_at") VALUES (5, E'Demo user 5', E'demoemail5@domain.com', E'2022-05-19T09:38:11.294273+00:00', E'2022-05-19T09:38:11.294273+00:00');
