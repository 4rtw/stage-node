const apprenant = require("../Routes/ApprenantsRoutes");
require("dotenv").config();
function apiApprenants(app) {
  const prefix = process.env.PREFIX;

  app.route(prefix + "/apprenants").get(apprenant.getApprenants);

  app.route(prefix + "/apprenants/search").get(apprenant.searchApprenants);

  app
    .route(prefix + "/apprenant/:id")
    .get(apprenant.getApprenant)
    .delete(apprenant.deleteApprenant);

  app
    .route(prefix + "/apprenant")
    .post(apprenant.postApprenant)
    .put(apprenant.updateApprenant);
}

module.exports = { apiApprenants };
