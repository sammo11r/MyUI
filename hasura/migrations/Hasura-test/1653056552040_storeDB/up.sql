
CREATE TABLE "public"."Customer" ("id" serial NOT NULL, "name" text NOT NULL, "address" text, "dateOfBirth" date, PRIMARY KEY ("id") , UNIQUE ("id"));

CREATE TABLE "public"."Product" ("id" serial NOT NULL, "name" text NOT NULL, "category" text, "description" text, PRIMARY KEY ("id") , UNIQUE ("id"));

CREATE TABLE "public"."Store" ("id" serial NOT NULL, "name" text NOT NULL, "address" text, PRIMARY KEY ("id") , UNIQUE ("id"));

CREATE TABLE "public"."Inventory" ("id" serial NOT NULL, "store" integer NOT NULL, "date" date NOT NULL, "product" integer NOT NULL, "price" integer NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("store") REFERENCES "public"."Store"("id") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("product") REFERENCES "public"."Product"("id") ON UPDATE cascade ON DELETE cascade, UNIQUE ("id"));

CREATE TABLE "public"."Purchase" ("id" serial NOT NULL, "product" integer NOT NULL, "customer" integer NOT NULL, "store" integer NOT NULL, "date" date NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("customer") REFERENCES "public"."Customer"("id") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("product") REFERENCES "public"."Product"("id") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("store") REFERENCES "public"."Store"("id") ON UPDATE cascade ON DELETE cascade, UNIQUE ("id"));

INSERT INTO "public"."Customer"("id", "name", "address", "dateOfBirth") VALUES (1, E'Demo Customer 1', E'Demostraat 1', E'2000-01-01');

INSERT INTO "public"."Customer"("id", "name", "address", "dateOfBirth") VALUES (2, E'Demo Customer 2', E'Demostraat 2', E'2000-02-01');

INSERT INTO "public"."Customer"("id", "name", "address", "dateOfBirth") VALUES (3, E'Demo Customer 3', E'Demostraat 3', E'2000-03-01');

INSERT INTO "public"."Customer"("id", "name", "address", "dateOfBirth") VALUES (4, E'Demo Customer 4', E'Demostraat 4', E'2000-04-01');

INSERT INTO "public"."Customer"("id", "name", "address", "dateOfBirth") VALUES (5, E'Demo Customer 5', E'Demostraat 5', E'2000-05-01');

INSERT INTO "public"."Product"("id", "name", "category", "description") VALUES (1, E'Demo Product 1', E'Demo Category 1', E'Demo Description');

INSERT INTO "public"."Product"("id", "name", "category", "description") VALUES (2, E'Demo Product 2', E'Demo Category 2', E'Demo Description');

INSERT INTO "public"."Product"("id", "name", "category", "description") VALUES (3, E'Demo Product 3', E'Demo Category 3', E'Demo Description');

INSERT INTO "public"."Product"("id", "name", "category", "description") VALUES (4, E'Demo Product 4', E'Demo Category 4', E'Demo Description');

INSERT INTO "public"."Product"("id", "name", "category", "description") VALUES (5, E'Demo Product 5', E'Demo Category 5', E'Demo Description');

INSERT INTO "public"."Store"("id", "name", "address") VALUES (1, E'Demo Store 1', E'Demo Store Address 1');

INSERT INTO "public"."Store"("id", "name", "address") VALUES (2, E'Demo Store 2', E'Demo Store Address 2');

INSERT INTO "public"."Store"("id", "name", "address") VALUES (3, E'Demo Store 3', E'Demo Store Address 3');

INSERT INTO "public"."Store"("id", "name", "address") VALUES (4, E'Demo Store 4', E'Demo Store Address 4');

INSERT INTO "public"."Store"("id", "name", "address") VALUES (5, E'Demo Store 5', E'Demo Store Address 5');

INSERT INTO "public"."Inventory"("id", "store", "date", "product", "price") VALUES (1, 1, E'2022-01-01', 1, 100);

INSERT INTO "public"."Inventory"("id", "store", "date", "product", "price") VALUES (2, 2, E'2022-02-01', 2, 101);

INSERT INTO "public"."Inventory"("id", "store", "date", "product", "price") VALUES (3, 3, E'2022-03-01', 3, 102);

INSERT INTO "public"."Inventory"("id", "store", "date", "product", "price") VALUES (4, 4, E'2022-04-01', 4, 103);

INSERT INTO "public"."Inventory"("id", "store", "date", "product", "price") VALUES (5, 5, E'2022-05-01', 5, 104);

INSERT INTO "public"."Purchase"("id", "product", "customer", "store", "date") VALUES (1, 1, 1, 1, E'2022-01-02');

INSERT INTO "public"."Purchase"("id", "product", "customer", "store", "date") VALUES (2, 2, 2, 2, E'2022-02-02');

INSERT INTO "public"."Purchase"("id", "product", "customer", "store", "date") VALUES (3, 3, 3, 3, E'2022-03-02');

INSERT INTO "public"."Purchase"("id", "product", "customer", "store", "date") VALUES (4, 4, 4, 4, E'2022-04-02');

INSERT INTO "public"."Purchase"("id", "product", "customer", "store", "date") VALUES (5, 5, 5, 5, E'2022-05-02');
