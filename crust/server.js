const port = 3000;

// Express Setup
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

// Knex Setup
const env = process.env.NODE_ENV || 'development';
const config = require('./knexfile')[env];
const knex = require('knex')(config);

// bcrypt setup
let bcrypt = require('bcrypt');
const saltRounds = 10;

// Setup COORS
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// API Endpoints

/*
   _____ ______ _______ 
 / ____|  ____|__   __|
| |  __| |__     | |   
| | |_ |  __|    | |   
| |__| | |____   | |   
 \_____|______|  |_|

*/
app.get('/', (req, res) => {
  res.status(200).send("Welcome to the crust website API. Feel free to peruse, and remember, bananas bruise!");
});

// Get all of the recipes a user has posted
app.get('/api/users/:id/recipes', (req, res) => {
    let id = parseInt(req.params.id);
    knex('users').join('recipes', 'users.id', 'recipes.owner_id')
                 .where('users.id', id)
                 .orderBy('recipes.name','desc')
                 .select('recipes.id',
                         'recipes.owner_id',
                         'recipes.name',
                         'recipes.category',
                         'recipes.permissions',
                         'recipes.description',
                         'recipes.hours',
                         'recipes.minutes',
                         'recipes.ingredients',
                         'recipes.directions',
                         'recipes.pic_url')
        .then(recipes => {
            res.status(200).json({recipes});
        }).catch(error => {
            res.status(500).json({ error });
        });
});

// Get a specific recipe by id
app.get('/api/recipes/:id', (req, res) => {
    let id = parseInt(req.params.id);
    knex('recipes').where('recipes.id', id)
                   .select('recipes.id',
                           'recipes.owner_id',
                           'recipes.name',
                           'recipes.category',
                           'recipes.permissions',
                           'recipes.description',
                           'recipes.hours',
                           'recipes.minutes',
                           'recipes.ingredients',
                           'recipes.directions',
                           'recipes.pic_url')
        .then(recipes => {
            res.status(200).json({recipes});
        }).catch(error => {
            res.status(500).json({ error });
        });
});

/*
  _____   ____   _____ _______ 
 |  __ \ / __ \ / ____|__   __|
 | |__) | |  | | (___    | |   
 |  ___/| |  | |\___ \   | |   
 | |    | |__| |____) |  | |   
 |_|     \____/|_____/   |_|   
                               
*/

// Post a new recipe
/*
example request:
curl -d '{"owner_id": "1", "name": "bakalava", "category": "dessert", "permissions": "public", "hours": "2", "minutes": "30", "ingredients": [ { "name": "cabbage", "amount": "1.5", "units": "head" }, { "name": "Kool-Aid", "amount": "1", "units": "pitcher" }], "directions": [{ "step": "1", "description": "Cook cabbage"}, { "step": "2", "description": "Pour boiling kool-aid on cabbage"} ]}' -H "Content-Type: application/json" -X POST 45.55.95.129:3000/api/users/1/recipes

{
    owner_id: 1,
    name: 'bakalava',
    category: 'dessert',
    permissions: 'public',
    hours: '2',
    minutes: '30',
    ingredients: [
        {
            name: 'cabbage',
            amount: '1.5',
            units: 'head'
        }, {
            name: 'Kool-Aid',
            amount: '1',
            units: 'pitcher'
        }
    ],
    directions: [
        {
            step: 1,
            description: 'Cook cabbage'
        }, {
            step: 2,
            description: 'Pour boiling kool-aid on cabbage'
        }
    ]
}
*/

//  TODO: Error Checking
//      hours is number
//      minutes is a number
app.post('/api/users/:id/recipes', (req, res) => {
    let id = parseInt(req.params.id);
    if (req.body.pic_url === undefined) req.body.pic_url = '';
    knex('users').where('id', id).first().then(user => {
        return knex('recipes').insert({
            owner_id: id,
            name: req.body.name,
            category: req.body.category,
            permissions: req.body.permissions,
            description: req.body.description,
            hours: req.body.hours,
            minutes: req.body.minutes,
            ingredients: JSON.stringify(req.body.ingredients),
            directions: JSON.stringify(req.body.directions),
            pic_url: req.body.pic_url });
    }).then(ids => {
        return knex('recipes').where('id', ids[0]).first();
    }).then(recipe => {
        res.status(200).json({ recipe:recipe });
        return;
    }).catch(error => {
        console.log(error);
        res.status(500).json({ error });
    });
});


// Logging in
/*
example request:
curl -d '{ "email": "foo@bar.com", "password": "bar" }' -H "Content-Type: application/json" -X POST 45.55.95.129:3000/api/login
{
    email: 'foo@bar.com',
    password: 'bar'
}

*/
app.post('/api/login', (req, res) => {
  if (!req.body.email || !req.body.password)
    return res.status(400).send();

  knex('users').where('email', req.body.email).first().then(user => {
    if (user === undefined) {
      res.status(403).send("Invalid credentials");
      throw new Error('abort');
    }
    return [bcrypt.compare(req.body.password, user.hash), user];
  }).spread((result, user) => {
    if (result)
      res.status(200).json({
        user: {
          username: user.username,
          name: user.name,
          id: user.id
        }
      });
    else
      res.status(403).send("Invalid credentials");
    return;
  }).catch(error => {
    if (error.message !== 'abort') {
      console.log(error);
      res.status(500).json({ error });
    }
  });
});

// Registering a user
/*
example request:
curl -d '{ "email": "foo@bar.com", "password": "bar", "username": "foobar", "first_name":"Foo", "last_name": "Bar" }' -H "Content-Type: application/json" -X POST 45.55.95.129:3000/api/users
{
    email: 'foo@bar.com',
    password: 'bar',
    username: 'foo',
    first_name: 'Foo',
    last_name: 'Bar'
}
*/
app.post('/api/users', (req, res) => {
  if (!req.body.email || 
      !req.body.password || 
      !req.body.username || 
      !req.body.first_name ||
      !req.body.last_name) 
    return res.status(400).send();

    knex('users').where('email', req.body.email).first().then(user => {
        if (user !== undefined) {
            res.status(403).send("Email address already exists");
            throw new Error('abort');
        }
        return knex('users').where('username', req.body.username).first();
    }).then(user => {
        if (user !== undefined){
            res.status(409).send("Username already exists");
            throw new Error('abort');
        }
        return bcrypt.hash(req.body.password, saltRounds);
    }).then(hash => {
        url = '';
        if ('pic_url' !== undefined) url = req.body.pic_url;
        return knex('users').insert({
            email: req.body.email, 
            hash: hash,
            username: req.body.username,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            role: 'user',
            pic_url: url
        });
    }).then(ids => {
        return knex('users').where('id', ids[0]).first().select('username', 'first_name', 'last_name', 'id');
    }).then(user => {
        res.status(200).json({ user: user });
        return;
    }).catch(error => {
        if (error.message !== 'abort'){
            console.log(error);
            res.status(500).json({ error });
        }
    });
});

/*
  _    _ _____  _____       _______ ______ 
 | |  | |  __ \|  __ \   /\|__   __|  ____|
 | |  | | |__) | |  | | /  \  | |  | |__   
 | |  | |  ___/| |  | |/ /\ \ | |  |  __|  
 | |__| | |    | |__| / ____ \| |  | |____ 
  \____/|_|    |_____/_/    \_\_|  |______|
                                           
*/
/*update recipes table */
app.put('/api/recipes/:id', (req, res) => {
    let id = parseInt(req.params.id);
    if (req.body.pic_url === undefined) req.body.pic_url = '';
    knex('recipes')
        .where('id', id)
        .update({
            name: req.body.name,
            category: req.body.category,
            permissions: req.body.permissions,
            description: req.body.description,
            hours: req.body.hours,
            minutes: req.body.minutes,
            ingredients: JSON.stringify(req.body.ingredients),
            directions: JSON.stringify(req.body.directions),
            pic_url: req.body.pic_url
    }).catch(error => {
        console.log(error);
        res.status(500).json({ error });
    });
});

/*
  _____  ______ _      ______ _______ ______ 
 |  __ \|  ____| |    |  ____|__   __|  ____|
 | |  | | |__  | |    | |__     | |  | |__   
 | |  | |  __| | |    |  __|    | |  |  __|  
 | |__| | |____| |____| |____   | |  | |____ 
 |_____/|______|______|______|  |_|  |______|

*/

app.delete('/api/recipes/:id', (req, res) => {

    console.log(req.params);
  if (!req.params.id) 
    return res.status(400).send();

    knex('recipes')
        .where('id', req.params.id)
        .del()
        .then(recipe => {
            res.status(200).json({ 'status': 'ok' });
            return;
    }).catch(error => {
        if (error.message !== 'abort'){
            console.log(error);
            res.status(500).json({ error });
        }
    });
});










app.listen(port, () => console.log('Server listening on port ' + port + '!'));
