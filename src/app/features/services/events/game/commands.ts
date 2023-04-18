import { eventsForPrefix } from 'src/app/store';
import { PanMapCameraAction } from './types';


const commands = eventsForPrefix('[Commands]');

// It feels rather like a semantic event, doesn't feel exactly like command
//  or regular event
export const CleanUpHandlersOnFightEnd = commands('Clear spells and items registries on fight end');

// Maybe create Map events.
export const MapPanCamera = commands<PanMapCameraAction>('Pan camera on the map');
