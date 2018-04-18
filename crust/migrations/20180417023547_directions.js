
exports.up = function(knex, Promise) {
  /*
  return Promise.all([
    knex.schema.createTable('directions', function(table){
      table.increments('id').primary();
      table.integer('recipe_id').unsigned();
      table.integer('step_number');
      table.string('description');
    })
  ]);
  */  
};

exports.down = function(knex, Promise) {
  /*
  return Promise.all([
    knex.schema.dropTable('directions')
  ]);
  */
};
