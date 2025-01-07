import { pgTable, serial, timestamp, text, integer, varchar, boolean } from 'drizzle-orm/pg-core';
import type { InferSelectModel } from 'drizzle-orm';


export const userTable = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  email: text('email').notNull(),
  passwordHash: text('password_hash').notNull(),
});

export const sessionTable = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
});

export type User = InferSelectModel<typeof userTable>;
export type Session = InferSelectModel<typeof sessionTable>;
