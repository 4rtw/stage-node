const OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

const URI = {
  hostname: "localhost:27017"
}

module.exports = {
  uri: `mongodb://${URI.hostname}/?readPreference=primary&appname=MongoDB%20Compass&ssl=false`,
  options: OPTIONS,
};
