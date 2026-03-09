import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .createTable('collection', (table) => {
      table.string('id').primary().defaultTo(knex.fn.uuid()).notNullable();
      table.string('userId').notNullable();

      table.string('name').notNullable();
      table.string('slug').notNullable();

      table.boolean('isPublic').defaultTo(false).notNullable();

      table.integer('order').defaultTo(0).notNullable();

      table.timestamp('createdAt').defaultTo(knex.fn.now()).notNullable();
      table.timestamp('updatedAt').defaultTo(knex.fn.now()).notNullable();

      table.foreign('userId').references('id').inTable('user');

      table.unique(['userId', 'slug']);
    })
    .createTable('bookmark', (table) => {
      table.string('id').primary().defaultTo(knex.fn.uuid()).notNullable();
      table.string('userId').notNullable();
      table.string('collectionId').notNullable();

      table.text('text').notNullable();
      table.string('url').notNullable();

      table.text('description');

      table.boolean('isFavorite').defaultTo(false).notNullable();
      table.boolean('isPublic').defaultTo(false).notNullable();

      table.integer('clickCount').defaultTo(0).notNullable();
      table.integer('order').defaultTo(0).notNullable();

      table.foreign('userId').references('id').inTable('user');
      table.foreign('collectionId').references('id').inTable('collection');

      table.timestamp('createdAt').defaultTo(knex.fn.now()).notNullable();
      table.timestamp('updatedAt').defaultTo(knex.fn.now()).notNullable();
    })
    .createTable('tag', (table) => {
      table.string('id').primary().defaultTo(knex.fn.uuid()).notNullable();
      table.string('userId').notNullable();

      table.string('name').notNullable();
      table.string('color').defaultTo('#6366f1').notNullable();

      table.foreign('userId').references('id').inTable('user');

      table.unique(['userId', 'name']);
    })
    .createTable('bookmarkTag', (table) => {
      table.string('bookmarkId').notNullable();
      table.string('tagId').notNullable();

      table.foreign('bookmarkId').references('id').inTable('bookmark');
      table.foreign('tagId').references('id').inTable('tag');

      table.primary(['bookmarkId', 'tagId']);
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .dropTableIfExists('bookmarkTag')
    .dropTableIfExists('bookmark')
    .dropTableIfExists('tag')
    .dropTableIfExists('collection');
}
