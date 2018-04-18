
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('recipes', function(table){
      table.increments('id').primary();
      table.integer('owner_id').unsigned();
      table.string('name');
      table.string('category');
      table.string('permissions');
      table.string('description', 6000);
      table.string('hours');
      table.string('minutes');
      table.string('ingredients', 6000);
      table.string('directions', 6000);
      table.string('pic_url', 1000);
    })
  ]);  
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('recipes')
  ]);
};
