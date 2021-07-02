const MONGOUSR = "admin"; //"admin"; //mongodb username
const MONGOPASSWORD = "admin"; //"admin"; //mongodb password
const CLUSTERNAME = "is2m.gl3gi.mongodb.net"; //"is2m.gl3gi.mongodb.net"; //mongodb cluster name
const URI = `mongodb+srv://${MONGOUSR}:${MONGOPASSWORD}@${CLUSTERNAME}/List?retryWrites=true&w=majority`;
const OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

module.exports = {
  uri: URI,
  options: OPTIONS,
};
