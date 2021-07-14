const MSG = require("../Messages/messages");
const mongoose = require("mongoose");
const PayementFrais = require("../Models/payementFrais");
const apiResponse = require("../Models/apiResponse");
const validate = require("../Services/Validation");

/*---------------------------------------------------------------------------------------------*/
// Ajout d'un payement (POST)
function postPayementFrais(req, res) {
    let payement = new PayementFrais();
    payement.idPayement = req.body.idPayement;
    payement.typePayement = req.body.typePayement;
    payement.idInscription = req.body.idInscription;
    payement.datePayement = req.body.datePayement;
    payement.montant = req.body.montant;
    payement.mensualites = req.body.mensualites;
    payement.periode = req.body.periode;
    payement.payeePar = req.body.payeePar;

    console.log("POST Payement reçu :");
    console.log(payement);

    const manyErrors = validate(payement, [
        "idPayement",
        "typePayement",
        "idInscription",
        "datePayement",
        "montant",
        "moisAnnee",
        "payeePar",
    ]);

    payement.save((err) => {
        if (err) {
            console.error(err.message);
            const err_message = manyErrors.length > 0 ? undefined : err.message;
            if (
                err.message.includes("E11000") ||
                err instanceof mongoose.Error.ValidationError
            ) {
                return res.status(400).json(
                    apiResponse({
                        data: [],
                        status: 0,
                        errors: [MSG.HTTP_400, ...manyErrors, err_message].filter((x) => x),
                        message: "",
                    })
                );
            }
            return res.status(500).json(
                apiResponse({
                    data: [],
                    status: 0,
                    errors: [MSG.HTTP_500, ...manyErrors, err_message].filter((x) => x),
                    message: "L'opération n'a pas abouti",
                })
            );
        }

        const msg = `${payement.idPayement} - Payement éffectué`;

        console.log(msg);
        res.status(200).json(
            apiResponse({
                data: [],
                status: 1,
                errors: [],
                message: msg,
            })
        );
    });
}

/*---------------------------------------------------------------------------------------------*/
// suppression d'un Enseignant (DELETE)
function deletePayementFrais(req, res) {
    const condition = { idPayement: req.params.id };

    PayementFrais.findOneAndRemove(condition, (err, payementFrais) => {
        if (err) {
            console.error(err.message);

            return res.status(500).json(
                apiResponse({
                    data: [],
                    status: 0,
                    errors: [MSG.HTTP_500, err.message],
                    message: "L'opération n'a pas abouti",
                })
            );
        }

        if (!payementFrais) {
            console.warn(
                `Impossible de trouver le payement  -> [ID = ${condition.idPayement}]`
            );

            return res.status(404).json(
                apiResponse({
                    data: [],
                    status: 0,
                    errors: [MSG.HTTP_404],
                    message: `Le payement [ID = ${condition.idPayement}] n'existe pas`,
                })
            );
        }

        const msg = `${payementFrais.idPayement} a été supprimé`;

        console.log(msg);

        res.status(200).json(
            apiResponse({
                data: [],
                status: 1,
                errors: [],
                message: msg,
            })
        );
    });
}
/*---------------------------------------------------------------------------------------------*/

/*---------------------------------------------------------------------------------------------*/
//Recuperer un Enseignant par son id (GET)
function getPayementFrais(req, res) {
    const condition = { idPayement: req.params.id };

    PayementFrais.findOne(condition, (err, payementFrais) => {
        if (err) {
            console.error(err.message);

            return res.status(500).json(
                apiResponse({
                    data: [],
                    status: 0,
                    errors: [MSG.HTTP_500, err.message],
                    message: "L'opération n'a pas abouti",
                })
            );
        }

        if (!payementFrais) {
            console.warn(
                `Impossible de trouver le payement  -> [ID = ${condition.idPayement}]`
            );

            return res.status(404).json(
                apiResponse({
                    data: [],
                    status: 0,
                    errors: [MSG.HTTP_404],
                    message: `Le Enseignant [ID = ${condition.matricule}] n'existe pas`,
                })
            );
        }

        res.status(200).json(
            apiResponse({
                data: payementFrais,
                status: 1,
                errors: [],
                message: MSG.HTTP_200,
            })
        );
    });
}
/*---------------------------------------------------------------------------------------------*/

/*---------------------------------------------------------------------------------------------*/
//Lister les Enseignants (GET)
function getPayementsFrais(req, res) {

    // TODO get sans pagination
}
/*---------------------------------------------------------------------------------------------*/
module.exports = {
    postPayementFrais,
    deletePayementFrais,
    getPayementFrais,
    getPayementsFrais
};
