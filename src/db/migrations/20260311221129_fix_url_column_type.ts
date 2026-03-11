import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('bookmarks', (table) => {
    table.text('url').alter();
    table.text('og_image').alter();
    table.text('favicon').alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('bookmarks', (table) => {
    table.string('url').alter();
    table.string('og_image').alter();
    table.string('favicon').alter();
  });
}
