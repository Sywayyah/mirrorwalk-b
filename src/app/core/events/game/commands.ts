import { eventsForPrefix } from 'src/app/store';
import { DisplayPlayerRewardAction, PanMapCameraCenterAction } from './types';


const commands = eventsForPrefix('[GameCommands]');

// It feels rather like a semantic event, doesn't feel exactly like command
//  or regular event
export const CleanUpHandlersOnFightEnd = commands('Clear spells and items registries on fight end');

// Maybe create Map events.
export const MapPanCameraCenterTo = commands<PanMapCameraCenterAction>('Pan camera on the map');

/*
  New possible philosophy:

  Events are events from app perspective, like user clicks an enemy or ally,
  and also might be outcomes, events from game perspectives.

  While commands can be like an instruction for the app.
*/
export const GameOpenMainScreen = commands('Open Main Screen');

export const OpenNewGameScreen = commands('Open New Game Screen');

export const OpenSettings = commands('Open Game settings');

export const GameOpenMapStructuresScreen = commands('Open map structures screen');

export const DisplayPlayerRewardPopup = commands<DisplayPlayerRewardAction>();