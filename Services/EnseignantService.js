const Enseignants = require("../Models/enseignant")
const checkError = require("./ErrorHandling");

function getEnseignantAndDoCallback(condition, res, manyErrors, callback) {
    Enseignants.findOne(condition, (err, enseignant) => {
        try {
            if (!checkError.handleErrors(err, res, manyErrors)) {
                if (!checkError.handleNoItem(res, enseignant, condition.matricule)) {
                    callback(enseignant);
                }
            }
        } catch (e) {
            checkError.returnFatalError(e, res);
        }
    });
}

function getPaginateEnseignants(query, pages, res, callback){
    Enseignants.aggregatePaginate(
        query,
        pages,
        (err, enseignants) => {
            try {
                if (!checkError.handleErrors(err, res, undefined)) {
                    callback(enseignants)
                }
            } catch (e) {
                checkError.returnFatalError(e, res);
            }
        }
    )
}

module.exports = {getPaginateEnseignants,getEnseignantAndDoCallback}
