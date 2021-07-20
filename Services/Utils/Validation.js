const validate = (model, fields) => {
  if (!model) throw new Error("model must be defined");

  if (!Array.isArray(fields) && [...fields].length > 0)
    throw new Error("fields must be defined");

  if (typeof model.validateSync !== "function")
    throw new Error("non-model params");

  const valErr = model.validateSync();
  let res = [];

  if (valErr != null) {
    res = [...fields]
      .map((x) =>
        valErr.errors[x] ? valErr.errors[x].message + `-> ${x}` : undefined
      )
      .filter((x) => x);
    console.log(res);
  }
  return res;
};

module.exports = validate;
