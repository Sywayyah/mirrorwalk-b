import { CONFIG } from './config';
import { Feature } from './types';

export function isFeatureEnabled(feature: Feature): boolean {
  return CONFIG.features.includes(feature);
}
