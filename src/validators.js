
const competitorSchema = {
  name: 'string',
  landingUrl: 'string',
  metaLinks: 'array',
  notes: 'string',
};

const adSchema = {
  metaUrl: 'string',
  format: 'string',
  primaryText: 'string',
  headline: 'string',
  description: 'string',
  cta: 'string',
  mediaUrl: 'string',
};

const validate = (data, schema) => {
  const errors = [];
  for (const key in schema) {
    if (schema[key] === 'array' && !Array.isArray(data[key])){
        errors.push(`${key} must be an array`);
    } else if (typeof data[key] !== schema[key]) {
      errors.push(`${key} must be a ${schema[key]}`);
    }
  }
  return errors;
};

export { competitorSchema, adSchema, validate };
