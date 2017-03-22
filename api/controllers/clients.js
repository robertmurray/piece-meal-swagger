'use strict';
const knex = require('../../knex');
const bookshelf = require('../../bookshelf');
// const Client = require('../models/client.js').Client;

module.exports = {
    getClient: getClient,
    getClients: getClients,
    addClient: addClient,
    getRestrictions: getRestrictions
};

function addClient(req, res) {
  res.set('Content-Type', 'application/json');
  res.json({});
}

function getClient(req, res) {
  res.set('Content-Type', 'application/json');
  res.json({});
}

function getClients(req, res) {
    // To list clients

    let promises = [];
    // promises.push(knex("clients").select("id"));
    promises.push(knex("clients").select("id", "first_name", "last_name", "email"));
    promises.push(knex("client_recipes")
            .join('recipes', 'recipes.id', '=', 'client_recipes.recipe_id')
            .select("client_recipes.client_id", "recipes.*"));
    Promise.all(promises)
        .then((results) => {
            let clients = results[0];
            let recipes = results[1];

            for (let client of clients) {
                let r = recipes.filter((recipe) => {
                    return recipe.client_id === client.id;
                }).map((recipe) => {
                    return {
                      id: recipe.id,
                      instructions: recipe.instructions,
                      name: recipe.name
                    };
                }).sort();

                client.recipes = r;
            };

            return res.json({clients: clients});
        });
}

function getRestrictions(req, res) {
  knex('client_restriction')
    .where('client_id', req.swagger.params.id.value)
    .join('ingredients', 'ingredient_id', req.swagger.params.id.value)
    .then((result) => {
      console.log(result);
    });
}
