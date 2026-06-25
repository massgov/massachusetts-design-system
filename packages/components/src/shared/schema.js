export function getSchemaDefaults(schema) {
  const defaults = {};

  for (const [name, field] of Object.entries(schema)) {
    defaults[name] = field.default;
  }

  return defaults;
}

export function getSchemaOptions(schema) {
  const options = {};

  for (const [name, field] of Object.entries(schema)) {
    if (Array.isArray(field.options)) {
      options[name] = field.options;
    }
  }

  return options;
}
