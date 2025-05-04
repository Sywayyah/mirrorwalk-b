export type Variantable<KeyType extends string | number, PropsPerKey extends Record<KeyType, object>> = {
  byKey: { [K in KeyType]: PropsPerKey[K] & { type: K } };
  variants: { [K in KeyType]: PropsPerKey[K] & { type: K } }[KeyType];
};
