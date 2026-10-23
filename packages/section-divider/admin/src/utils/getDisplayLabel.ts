export interface LabelSource {
  name: string;
  label?: string;
  intlLabel?: { id?: string; defaultMessage?: string };
  attribute?: { label?: string };
}

// Strapi passes the label differently across versions and render paths, so
// fall back through every place it can live before using the field name.
export const getDisplayLabel = ({ name, label, intlLabel, attribute }: LabelSource): string =>
  label || intlLabel?.defaultMessage || intlLabel?.id || attribute?.label || name;
