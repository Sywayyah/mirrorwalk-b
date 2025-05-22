export type Variantable<KeyType extends string | number, PropsPerKey extends Record<KeyType, object>> = {
  byKey: { [K in KeyType]: PropsPerKey[K] & { type: K } };
  variants: { [K in KeyType]: PropsPerKey[K] & { type: K } }[KeyType];
};

/** automatpically populates empty objects for non-provided keys */
export type VariantableDefault<
  KeyType extends string | number,
  PropsPerKey extends Partial<Record<KeyType, object>>,
> = {
  byKey: {
    [K in KeyType]: K extends keyof PropsPerKey ? PropsPerKey[K] & { type: K } : { type: K };
  };
  variants: {
    [K in KeyType]: K extends keyof PropsPerKey ? PropsPerKey[K] & { type: K } : { type: K };
  }[KeyType];
};
