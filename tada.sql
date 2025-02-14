------- PLEASE NOTE: THIS IS THE DB BRAD SET UP FOR THIS PROJECT----
---Create User Table
CREATE TABLE IF NOT EXISTS "user" (
	"id" serial NOT NULL UNIQUE,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"username" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"user_is_admin" boolean NOT NULL,
	PRIMARY KEY ("id")
);
---Create designs table
CREATE TABLE IF NOT EXISTS "designs" (
	"id" serial NOT NULL UNIQUE,
	"name" varchar(255) NOT NULL,
	"for_product" bigint NOT NULL,
	"height_in_inches" numeric(10,0) NOT NULL,
	"width_in_inches" numeric(10,0) NOT NULL,
	"belongs_to_user" bigint NOT NULL,
	"design_created_by" bigint NOT NULL,
	"time_of_creation" timestamp with time zone NOT NULL DEFAULT now(),
	"image_file_name" varchar(255) NOT NULL,
	PRIMARY KEY ("id")
);
---Product type table, only a stump for now
CREATE TABLE IF NOT EXISTS "product_type" (
	"id" serial NOT NULL UNIQUE,
	"name" varchar(255) NOT NULL,
	PRIMARY KEY ("id")
);
---Database relationships
ALTER TABLE "designs" ADD CONSTRAINT "designs_fk5" FOREIGN KEY ("belongs_to_user") REFERENCES "user"("id");

ALTER TABLE "designs" ADD CONSTRAINT "designs_fk2" FOREIGN KEY ("for_product") REFERENCES "product_type"("id");

ALTER TABLE "designs" ADD CONSTRAINT "designs_fk6" FOREIGN KEY ("design_created_by") REFERENCES "user"("id");

---Seed data for users
INSERT INTO "user" ("first_name","last_name","login_email",
	"password","user_is_admin")
	VALUES ('Joely','Atkrsm','joely@krsm.com','test',FALSE),('Bobby','Thetreeguy','bobby@thetreeguy.com','test',FALSE),('Chuck','Industrialguy','chuck@industry.com','test',FALSE);

----THIS IS THE END OF THE DB STUFF THAT BRAD USED
