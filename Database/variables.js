require('dotenv').config()

const OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  tls:false,
  ssl: false
};

const databaseHostname = process.env.DB_HOSTNAME
const databasePort = process.env.DB_PORT

const URI = {
  hostname: databaseHostname + ":" + databasePort
}

module.exports = {
  uri: `mongodb://${URI.hostname}`,
  options: OPTIONS,
};
