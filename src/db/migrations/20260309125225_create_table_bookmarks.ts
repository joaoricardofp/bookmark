import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .createTable('collections', (table) => {
      table.string('id').primary().defaultTo(knex.fn.uuid()).notNullable();
      table.string('user_id').notNullable();

      table.string('name').notNullable();
      table.string('slug').notNullable();

      table.boolean('is_public').defaultTo(false).notNullable();
      table.integer('order').defaultTo(0).notNullable();

      table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
      table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();

      table.foreign('user_id').references('id').inTable('user').onDelete('CASCADE');
      table.unique(['user_id', 'slug']);
    })
    .createTable('bookmarks', (table) => {
      table.string('id').primary().defaultTo(knex.fn.uuid()).notNullable();
      table.string('user_id').notNullable();
      table
        .string('collection_id')
        .references('id')
        .inTable('collections')
        .onDelete('SET NULL')
        .nullable();

      table.text('title').notNullable();
      table.string('url').notNullable();
      table.text('description').nullable();
      table.string('favicon').nullable();
      table.string('og_image').nullable();

      table.boolean('is_favorite').defaultTo(false).notNullable();
      table.boolean('is_public').defaultTo(false).notNullable();

      table.integer('click_count').defaultTo(0).notNullable();
      table.integer('order').defaultTo(0).notNullable();

      table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
      table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();

      table.foreign('user_id').references('id').inTable('user').onDelete('CASCADE');
    })
    .createTable('tags', (table) => {
      table.string('id').primary().defaultTo(knex.fn.uuid()).notNullable();
      table.string('user_id').notNullable();

      table.string('name').notNullable();
      table.string('color').defaultTo('#6366f1').notNullable();

      table.foreign('user_id').references('id').inTable('user').onDelete('CASCADE');
      table.unique(['user_id', 'name']);
    })
    .createTable('bookmark_tags', (table) => {
      table.string('bookmark_id').notNullable();
      table.string('tag_id').notNullable();

      table.foreign('bookmark_id').references('id').inTable('bookmarks').onDelete('CASCADE');
      table.foreign('tag_id').references('id').inTable('tags').onDelete('CASCADE');

      table.primary(['bookmark_id', 'tag_id']);
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .dropTableIfExists('bookmark_tags')
    .dropTableIfExists('bookmarks')
    .dropTableIfExists('tags')
    .dropTableIfExists('collections');
}
