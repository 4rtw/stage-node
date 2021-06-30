const MSG = require('../Messages/messages')
const mongoose = require('mongoose')
const Professeurs = require('../Models/professeurs')
const apiResponse = require('../Models/apiResponse')
const validate = require('../Services/Validation')

/*---------------------------------------------------------------------------------------------*/
//Lister les professeurs (GET)
function getProfesseurs(req, res){
    let aggregateQuery = Professeurs.aggregate()

    Professeurs.aggregatePaginate(
        aggregateQuery,
        {
            page:parseInt(req.query.page) || 1,
            limit:parseInt(req.query.limit) || 10,
        },
        (err, professeurs) => {
            if(err){
                console.error(err.message)

                return res.status(500).json(apiResponse(
                    {
                        data:[],
                        status:0,
                        errors:[MSG.HTTP_500, err.message],
                        message: "L'opération n'a pas abouti"
                    }
                ))
            }
            console.log(`Obtention de tous les professeurs`)
            res.status(200).json(apiResponse({
                data: professeurs,
                status: 1,
                errors: [],
                message: MSG.HTTP_200
            }))
        }
    )
}
/*---------------------------------------------------------------------------------------------*/
//Rechercher les professeurs (GET)
function searchProfesseurs(req, res){
    let searchString = req.query.searchString
    let aggregateQuery = Professeurs.aggregate([
        {$match:{$text:{$search:searchString}}}
    ])

    Professeurs.aggregatePaginate(
        aggregateQuery,
        {
            page:parseInt(req.query.page) || 1,
            limit:parseInt(req.query.limit) || 10,
        },
        (err, professeurs) => {
            if(err){
                console.error(err.message)

                return res.status(500).json(apiResponse(
                    {
                        data:[],
                        status:0,
                        errors:[MSG.HTTP_500, err.message],
                        message: "L'opération n'a pas abouti"
                    }
                ))
            }
            console.log(`Obtention de tous les professeurs contenant ` + searchString)
            res.status(200).json(apiResponse({
                data: professeurs,
                status: 1,
                errors: [],
                message: MSG.HTTP_200
            }))
        }
    )
}

/*---------------------------------------------------------------------------------------------*/
//Recuperer un professeur par son id (GET)
function getProfesseur(req, res){
    const condition = {matricule: req.params.id}

    Professeurs.findOne(condition,(err,professeur)=>{
        if(err) {
            console.error(err.message)

            return res.status(500).json(apiResponse({
                data: [],
                status: 0,
                errors: [MSG.HTTP_500, err.message],
                message: "L'opération n'a pas abouti"
            }))
        }

        if(!professeur){
            console.warn(`Impossible de trouver le professeur  -> [ID = ${condition.matricule}]`)

            return res.status(404).json(apiResponse({
                data: [],
                status: 0,
                errors: [MSG.HTTP_404],
                message: `Le professeur [ID = ${condition.matricule}] n'existe pas`
            }))
        }

        res.status(200).json(apiResponse({
            data: professeur,
            status: 1,
            errors: [],
            message: MSG.HTTP_200
        }))
    })
}

/*---------------------------------------------------------------------------------------------*/
// Ajout d'un professeur (POST)
function postProfesseur(req, res){

    let professeur = new Professeurs()
    professeur.id = req.body.id
    professeur.matricule = req.body.matricule
    professeur.nom = req.body.nom
    professeur.prenom = req.body.prenom
    professeur.contacts = req.body.contacts

    console.log("POST professeur reçu :")
    console.log(professeur)

    const manyErrors = validate(professeur, ['id', 'matricule', 'nom', 'prenom', 'contacts'])

    professeur.save( (err) => {
        if(err){
            console.error(err.message)
            const err_message = manyErrors.length > 0? undefined : err.message
            if(err.message.includes("E11000") || err instanceof mongoose.Error.ValidationError){
                return res.status(400).json(apiResponse({
                    data: [],
                    status: 0,
                    errors: [MSG.HTTP_400, ...manyErrors, err_message].filter(x => x),
                    message: ""
                }))
            }
            return res.status(500).json(apiResponse({
                data: [],
                status: 0,
                errors: [MSG.HTTP_500, ...manyErrors, err_message].filter(x => x),
                message: "L'opération n'a pas abouti"
            }))
        }

        const msg = `${professeur.nom} a été créé`

        console.log(msg)
        res.status(200).json(apiResponse({
            data: [],
            status: 1,
            errors: [],
            message: msg
        }))
    })
}

/*---------------------------------------------------------------------------------------------*/
// Update d'un professeur (PUT)
function updateProfesseur(req, res) {

    console.log("UPDATE recu professeur : " + req.body)

    const condition = {matricule: req.body.matricule}
    const opts = { runValidators: true , new: true}

    Professeurs.findOneAndUpdate(condition, req.body, opts, (err, professeur) => {
        if (err) {
            console.error(err.message)

            return res.status(500).json(apiResponse({
                data: [],
                status: 0,
                errors: [MSG.HTTP_500, err.message],
                message: "L'opération n'a pas abouti"
            }))
        }

        if(!professeur){
            console.warn(`Impossible de trouver le professeur  -> [ID = ${condition.matricule}]`)

            return res.status(404).json(apiResponse({
                data: [],
                status: 0,
                errors: [MSG.HTTP_404],
                message: `L'professeur [ID = ${condition.matricule}] n'existe pas`
            }))
        }

        const msg = `${professeur.nom} a été modifié`

        console.log(msg)

        res.status(200).json(apiResponse({
            data: [],
            status: 1,
            errors: [],
            message: msg
        }))
    })
}

/*---------------------------------------------------------------------------------------------*/
// suppression d'un professeur (DELETE)
function deleteProfesseur(req, res) {

    const condition = {matricule: req.params.id}

    Professeurs.findOneAndRemove(condition, (err, professeur) => {
        if (err) {
            console.error(err.message)

            return res.status(500).json(apiResponse({
                data: [],
                status: 0,
                errors: [MSG.HTTP_500, err.message],
                message: "L'opération n'a pas abouti"
            }))
        }

        if(!professeur){
            console.warn(`Impossible de trouver le professeur  -> [ID = ${condition.matricule}]`)

            return res.status(404).json(apiResponse({
                data: [],
                status: 0,
                errors: [MSG.HTTP_404],
                message: `Le professeur [ID = ${condition.matricule}] n'existe pas`
            }))
        }

        const msg = `${professeur.nom} a été supprimé`

        console.log(msg)

        res.status(200).json(apiResponse({
            data: [],
            status: 1,
            errors: [],
            message: msg
        }))
    })
}
/*---------------------------------------------------------------------------------------------*/
module.exports = {getProfesseurs,getProfesseur,searchProfesseurs,postProfesseur,updateProfesseur,deleteProfesseur}
