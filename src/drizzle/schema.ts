import {
  pgTable,
  pgEnum,
  varchar,
  timestamp,
  text,
  integer,
  uniqueIndex,
  index,
  boolean,
  serial,
  primaryKey,
} from "drizzle-orm/pg-core";

export const keyStatus = pgEnum("key_status", [
  "expired",
  "invalid",
  "valid",
  "default",
]);
export const keyType = pgEnum("key_type", [
  "stream_xchacha20",
  "secretstream",
  "secretbox",
  "kdf",
  "generichash",
  "shorthash",
  "auth",
  "hmacsha256",
  "hmacsha512",
  "aead-det",
  "aead-ietf",
]);
export const requestStatus = pgEnum("request_status", [
  "ERROR",
  "SUCCESS",
  "PENDING",
]);
export const factorType = pgEnum("factor_type", ["webauthn", "totp"]);
export const factorStatus = pgEnum("factor_status", ["verified", "unverified"]);
export const aalLevel = pgEnum("aal_level", ["aal3", "aal2", "aal1"]);
export const codeChallengeMethod = pgEnum("code_challenge_method", [
  "plain",
  "s256",
]);
export const extension = pgEnum("Extension", [
  "tsx",
  "ts",
  "jsx",
  "js",
  "css",
  "html",
]);

export const prismaMigrations = pgTable("_prisma_migrations", {
  id: varchar("id", { length: 36 }).primaryKey().notNull(),
  checksum: varchar("checksum", { length: 64 }).notNull(),
  finishedAt: timestamp("finished_at", { withTimezone: true, mode: "string" }),
  migrationName: varchar("migration_name", { length: 255 }).notNull(),
  logs: text("logs"),
  rolledBackAt: timestamp("rolled_back_at", {
    withTimezone: true,
    mode: "string",
  }),
  startedAt: timestamp("started_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  appliedStepsCount: integer("applied_steps_count").default(0).notNull(),
});

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey().notNull(),
    name: text("name"),
    email: text("email"),
    emailVerified: timestamp("emailVerified", { precision: 3, mode: "string" }),
    image: text("image"),
  },
  (table) => {
    return {
      emailKey: uniqueIndex("users_email_key").on(table.email),
    };
  }
);

export const accounts = pgTable(
  "accounts",
  {
    id: text("id").primaryKey().notNull(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refreshToken: text("refresh_token"),
    accessToken: text("access_token"),
    expiresAt: integer("expires_at"),
    tokenType: text("token_type"),
    scope: text("scope"),
    idToken: text("id_token"),
    sessionState: text("session_state"),
  },
  (table) => {
    return {
      userIdIdx: index("accounts_userId_idx").on(table.userId),
      providerProviderAccountIdKey: uniqueIndex(
        "accounts_provider_providerAccountId_key"
      ).on(table.provider, table.providerAccountId),
    };
  }
);

export const categories = pgTable("categories", {
  name: text("name").primaryKey().notNull(),
  description: text("description"),
});

export const components = pgTable(
  "components",
  {
    id: text("id").primaryKey().notNull(),
    name: text("name").notNull(),
    description: text("description"),
    draft: boolean("draft").default(true).notNull(),
    document: text("document").notNull(),
    previewUrl: text("previewUrl").notNull(),
    functionName: text("functionName"),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", {
      precision: 3,
      mode: "string",
    }).notNull(),
    categoryName: text("categoryName")
      .notNull()
      .references(() => categories.name, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
    creatorId: text("creatorId")
      .notNull()
      .references(() => users.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
  },
  (table) => {
    return {
      creatorIdIdx: index("components_creatorId_idx").on(table.creatorId),
      categoryNameIdx: index("components_categoryName_idx").on(
        table.categoryName
      ),
    };
  }
);

export const files = pgTable(
  "files",
  {
    id: serial("id").primaryKey().notNull(),
    objectId: text("objectId").notNull(),
    name: text("name").default("index").notNull(),
    extension: extension("extension").notNull(),
    componentId: text("componentId")
      .notNull()
      .references(() => components.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
  },
  (table) => {
    return {
      componentIdIdx: index("files_componentId_idx").on(table.componentId),
      objectIdIdx: index("files_objectId_idx").on(table.objectId),
    };
  }
);

export const likes = pgTable(
  "likes",
  {
    id: serial("id").primaryKey().notNull(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    componentId: text("componentId")
      .notNull()
      .references(() => components.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
    userId: text("userId")
      .notNull()
      .references(() => users.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
  },
  (table) => {
    return {
      componentIdIdx: index("likes_componentId_idx").on(table.componentId),
      userIdIdx: index("likes_userId_idx").on(table.userId),
      componentIdUserIdKey: uniqueIndex("likes_componentId_userId_key").on(
        table.componentId,
        table.userId
      ),
    };
  }
);

export const profiles = pgTable("profiles", {
  userId: text("userId")
    .primaryKey()
    .notNull()
    .references(() => users.id, { onDelete: "restrict", onUpdate: "cascade" }),
  website: text("website"),
  github: text("github"),
  twitter: text("twitter"),
});

export const follows = pgTable(
  "follows",
  {
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    followerId: text("followerId")
      .notNull()
      .references(() => users.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
    followingId: text("followingId")
      .notNull()
      .references(() => users.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
  },
  (table) => {
    return {
      followerIdIdx: index("follows_followerId_idx").on(table.followerId),
      followingIdIdx: index("follows_followingId_idx").on(table.followingId),
      followerIdFollowingIdKey: uniqueIndex(
        "follows_followerId_followingId_key"
      ).on(table.followerId, table.followingId),
      followsPkey: primaryKey({
        columns: [table.followerId, table.followingId],
        name: "follows_pkey",
      }),
    };
  }
);
