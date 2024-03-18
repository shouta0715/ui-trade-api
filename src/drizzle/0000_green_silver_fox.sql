-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
DO $$ BEGIN
 CREATE TYPE "key_status" AS ENUM('expired', 'invalid', 'valid', 'default');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "key_type" AS ENUM('stream_xchacha20', 'secretstream', 'secretbox', 'kdf', 'generichash', 'shorthash', 'auth', 'hmacsha256', 'hmacsha512', 'aead-det', 'aead-ietf');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "request_status" AS ENUM('ERROR', 'SUCCESS', 'PENDING');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "factor_type" AS ENUM('webauthn', 'totp');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "factor_status" AS ENUM('verified', 'unverified');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "aal_level" AS ENUM('aal3', 'aal2', 'aal1');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "code_challenge_method" AS ENUM('plain', 's256');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "Extension" AS ENUM('tsx', 'ts', 'jsx', 'js', 'css', 'html');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"checksum" varchar(64) NOT NULL,
	"finished_at" timestamp with time zone,
	"migration_name" varchar(255) NOT NULL,
	"logs" text,
	"rolled_back_at" timestamp with time zone,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"applied_steps_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"emailVerified" timestamp(3),
	"image" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "categories" (
	"name" text PRIMARY KEY NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "components" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"draft" boolean DEFAULT true NOT NULL,
	"document" text NOT NULL,
	"previewUrl" text NOT NULL,
	"functionName" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"categoryName" text NOT NULL,
	"creatorId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "files" (
	"id" serial PRIMARY KEY NOT NULL,
	"objectId" text NOT NULL,
	"name" text DEFAULT 'index' NOT NULL,
	"extension" "Extension" NOT NULL,
	"componentId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "likes" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"componentId" text NOT NULL,
	"userId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profiles" (
	"userId" text PRIMARY KEY NOT NULL,
	"website" text,
	"github" text,
	"twitter" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "follows" (
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"followerId" text NOT NULL,
	"followingId" text NOT NULL,
	CONSTRAINT "follows_pkey" PRIMARY KEY("followerId","followingId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users" ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "accounts_userId_idx" ON "accounts" ("userId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "accounts_provider_providerAccountId_key" ON "accounts" ("provider","providerAccountId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "components_creatorId_idx" ON "components" ("creatorId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "components_categoryName_idx" ON "components" ("categoryName");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "files_componentId_idx" ON "files" ("componentId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "files_objectId_idx" ON "files" ("objectId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "likes_componentId_idx" ON "likes" ("componentId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "likes_userId_idx" ON "likes" ("userId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "likes_componentId_userId_key" ON "likes" ("componentId","userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "follows_followerId_idx" ON "follows" ("followerId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "follows_followingId_idx" ON "follows" ("followingId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "follows_followerId_followingId_key" ON "follows" ("followerId","followingId");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "components" ADD CONSTRAINT "components_categoryName_fkey" FOREIGN KEY ("categoryName") REFERENCES "public"."categories"("name") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "components" ADD CONSTRAINT "components_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "files" ADD CONSTRAINT "files_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "public"."components"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "likes" ADD CONSTRAINT "likes_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "public"."components"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "likes" ADD CONSTRAINT "likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profiles" ADD CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "follows" ADD CONSTRAINT "follows_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "follows" ADD CONSTRAINT "follows_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

*/