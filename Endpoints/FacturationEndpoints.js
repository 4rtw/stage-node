const facturation = require("../Routes/FacturationRoutes");
require('dotenv').config()
function apiFacturation(app) {
    const prefix = process.env.PREFIX

    app.route(prefix + "/facturations/byActivity")
        .get(facturation.listFacturationsByActivity);

    app.route(prefix + "/facturations/byEnseignant")
        .get(facturation.listFacturationsByEnseignant);

    app.route(prefix + "/facturations/byActivityAndEnseignants")
        .get(facturation.listFacturationsByActivityByEnseignants)


    app
        .route(prefix + "/facturation")
        .post(facturation.postFacturation)
        .put(facturation.addEnseignementToFacturation);

    app.route(prefix + "/facturation/close").put(facturation.closeFacture);
}

module.exports = {apiFacturation}
