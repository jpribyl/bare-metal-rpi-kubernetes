"use strict";

const vars = require("./knexfile.js");
let knex = require("knex")({
  client: vars.client,
  connection: vars.connection,
  pool: { min: 0, max: 7 }
});

//monkey patch pagination into knex
let KnexQueryBuilder = require("knex/lib/query/builder");
KnexQueryBuilder.prototype.paginate = function(current_page, per_page) {
  let pagination = {};
  //set defaults
  per_page = per_page || 10;
  let page = current_page || 1;
  //account for silly values
  if (page < 1) page = 1;

  let offset = (page - 1) * per_page;
  return Promise.all([
    //could make this id for performance as long as all tables have an id column
    this.clone()
      .count("* as count")
      .first(),
    this.offset(offset).limit(per_page)
  ]).then(([total, rows]) => {
    let count = total.count;
    rows = rows;
    pagination.total = count;
    pagination.per_page = per_page;
    pagination.last_page = Math.ceil(count / per_page);
    pagination.current_page = page;
    pagination.data = rows;
    return pagination;
  });
};

module.exports = async (event, context) => {
  let err;
  let r;
  const { page, perPage, sort, sortDirection } = {
    ...event.body
  };
  r = await knex
    .select("employees.*", "states.abbreviation as state_abbreviation")
    .from("employees")
    .leftJoin("states", "employees.state_id", "states.id")
    .paginate(page, perPage);
  const result = {
    status: "success",
    knex: r,
    event: event.method
  };

  context.status(200).succeed(result);
};