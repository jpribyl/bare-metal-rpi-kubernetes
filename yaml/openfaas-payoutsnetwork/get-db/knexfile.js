// knex requires this file to exist in order to let you do migrations, etc
// Update with your config settings.
const fs = require("fs");
const mysqlHostFile = "/var/openfaas/secrets/mysql-host";
const mysqlDatabaseFile = "/var/openfaas/secrets/mysql-database";
const mysqlPasswordFile = "/var/openfaas/secrets/mysql-password";
const mysqlPortFile = "/var/openfaas/secrets/mysql-port";
const mysqlUserFile = "/var/openfaas/secrets/mysql-user";
const encoding = "utf-8";

let host, port, user, password, database;
try {
  const host = fs.readFileSync(mysqlHostFile, encoding);
  const database = fs.readFileSync(mysqlDatabaseFile, encoding);
  const password = fs.readFileSync(mysqlPasswordFile, encoding);
  const port = fs.readFileSync(mysqlPortFile, encoding);
  const user = fs.readFileSync(mysqlUserFile, encoding);
} catch (e) {
  host = "localhost";
  database = "payoutsnetwork";
  password = "ranger";
  port = "3306";
  user = "root";
}

module.exports = {
  client: "mysql",
  connection: {
    host: host,
    port: port,
    user: user,
    password: password,
    database: database
  }
};