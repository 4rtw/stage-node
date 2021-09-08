const mongoose = require("mongoose");
const variables = require("../Database/variables");

function connect() {
  console.log("trying to connect to " + variables.uri);
  mongoose
    .connect(variables.uri, variables.options)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch(e => {
      console.error("Could not connect to database");
      console.error(e);
      setTimeout(() => {
        connect();
      }, 10000);
    });
}

module.exports = { connect };
