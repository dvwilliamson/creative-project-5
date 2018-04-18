
exports.up = function(knex, Promise) {
  /*
  return Promise.all([
    knex.schema.createTable('ingredients', function(table){
      table.increments('id').primary();
      table.integer('recipe_id').unsigned();
      table.string('ingredient_name');
      table.string('amount');
      table.string('units');
    })
  ]);
  */  
};

exports.down = function(knex, Promise) {
  /*
  return Promise.all([
    knex.schema.dropTable('ingredients')
  ]);
  */
};
