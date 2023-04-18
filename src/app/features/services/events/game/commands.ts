import { eventsForPrefix } from 'src/app/store';
import { PanMapCameraCenterAction } from './types';


const commands = eventsForPrefix('[Commands]');

// It feels rather like a semantic event, doesn't feel exactly like command
//  or regular event
export const CleanUpHandlersOnFightEnd = commands('Clear spells and items registries on fight end');

// Maybe create Map events.
export const MapPanCameraCenterTo = commands<PanMapCameraCenterAction>('Pan camera on the map');
