const HTTP_200 = "L'opération est réussie"
const HTTP_201 = "L'objet a été créé/remplacé"

const HTTP_400 = "Requête malformée (paramètres invalides)"
const HTTP_401 = "Authentification incorrecte ou nécessaire"
const HTTP_403 = "Accès interdit"
const HTTP_404 = "L'objet demandé n'existe pas"
const HTTP_405 = "Cette methode n'est pas permise pour cette url"

const HTTP_500 = "Erreur serveur"

const MSG = {
    HTTP_200: HTTP_200,
    HTTP_201: HTTP_201,
    HTTP_400: HTTP_400,
    HTTP_401: HTTP_401,
    HTTP_403: HTTP_403,
    HTTP_404: HTTP_404,
    HTTP_405: HTTP_405,
    HTTP_500: HTTP_500
}

module.exports = MSG
