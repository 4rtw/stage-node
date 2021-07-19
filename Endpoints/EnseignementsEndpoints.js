require('dotenv').config()
const enseignement = require("../Routes/EnseignementRoutes");
function apiEnseignement(app){
    const prefix = process.env.PREFIX

    app.route(prefix + "/enseignement")
        .post(enseignement.postEnseignements)
        .put(enseignement.closeEnseignement);
}

module.exports = {apiEnseignement}
