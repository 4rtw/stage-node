let mongoose = require("mongoose");
let aggregatePaginate = require("mongoose-aggregate-paginate-v2");
let Schema = mongoose.Schema;

let parcoursSchema = Schema({
  code: {
    type: Number,
    required: [true, "Champ requis"],
    unique: true,
    min: 0,
  },
  niveau: {
    type: String,
    required: [true, "Champ requis"],
  },
  mention: {
    type: String,
    required: [true, "Champ requis"],
  },
  specialisation: {
    type: String,
  },
  frais: {
    type: Number,
    required: [true, "Champ requis"],
  },
});
parcoursSchema.plugin(aggregatePaginate);
module.exports = mongoose.model("Parcours", parcoursSchema);
