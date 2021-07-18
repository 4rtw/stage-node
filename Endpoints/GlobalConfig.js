const apiResponse = require("../Models/apiResponse");
const MSG = require("../Messages/messages");

function globalConfig(app, express) {
  /*---------------------------------------------------------------------------------------*/
  // Pour accepter les connexions cross-domain (CORS)
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization"
    );
    next();
  });

  /*---------------------------------------------------------------------------------------*/
  // Pour les formulaires
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(function (error, req, res, next) {
    if (error instanceof SyntaxError) {
      return res.status(400).json(
        apiResponse({
          data: [],
          status: 0,
          errors: [MSG.HTTP_400],
          message: "",
        })
      );
    } else {
      next();
    }
  });
}


module.exports = {globalConfig}
