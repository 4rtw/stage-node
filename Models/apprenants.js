let mongoose = require("mongoose");
let aggregatePaginate = require("mongoose-aggregate-paginate-v2");
let Schema = mongoose.Schema;

let apprenantsSchema = Schema({
  matricule: {
    type: Number,
    required: [true, "Champ requis"],
    unique: true,
  },

  nom: {
    type: String,
    required: [true, "Champ requis"],
  },

  prenom: {
    type: String,
    required: [true, "Champ requis"],
  },

  email: {
    type: String,
    required: [true, "Champ requis"],
  },

  telephones: {
    type: [String],
    required: [true, "Champ requis"],
  },

  adresse: {
    type: String,
    required: [true, "Champ requis"],
  },

  baccalaureat: {
    type: {
      serie: String,
      mention: String,
      annee: Number,
    },
    required: [true, "Champ requis"],
  },

  autresDiplomes: {
    type: [
      {
        nom: String,
        description: String,
        mention: String,
        annee: Number,
      },
    ],
  },

  anneeInscription: {
    type: Number,
    required: [true, "Champ requis"],
  },

  photoUrl: {
    type: String,
  },

  parentsTuteur: {
    type: [
      {
        nom: String,
        prenom: String,
        relationAvecApprenant: String,
        profession: String,
        lieuDeTravail: String,
        email: String,
        telephone1: String,
        telephone2: String,
      },
    ],
  },

  naissance: {
    type: {
      date: String,
      lieu: String,
      sexe: String
    },
    required: [true, "Champ requis"],
  },
});

apprenantsSchema.plugin(aggregatePaginate);

module.exports = mongoose.model("apprenants", apprenantsSchema);
