"use strict";
const db = require("./db/dbconfig.js");
module.exports = async (event, context) => {
  let err;
  const knex = db.knex();
  let r;
  const { page, perPage, sort, sortDirection } = {
    ...event.body
  };
  try {
    r = await knex
      .select("employees.*", "states.abbreviation as state_abbreviation")
      .from("employees")
      .leftJoin("states", "employees.state_id", "states.id")
      .paginate(page, perPage);
  } catch (e) {
    console.log("error await: ", e);
  }
  const result = {
    body: r
  };

  context.status(200).succeed(result);
};