import { createEventType } from 'src/app/store';
import { ActionCardStack } from '../../action-cards';
import { Player } from '../../players';
import { DescriptionElement } from '../../ui';
import {
  DisplayPlayerRewardAction,
  InitBuildingAction,
  InitGameObjectApiParams,
  InitItemAction,
  InitMapStructureAction,
  InitSpellAction,
  PanMapCameraCenterAction,
  ViewsEnum,
} from './types';

const commands = createEventType;

// It feels rather like a semantic event, doesn't feel exactly like command
//  or regular event
export const CleanUpHandlersOnFightEnd = commands(
  'Clear spells and items registries on fight end',
);

// Maybe create Map events.
export const MapPanCameraCenterTo = commands<PanMapCameraCenterAction>(
  'Pan camera on the map',
);

/*
  New possible philosophy:

  Events are events from app perspective, like user clicks an enemy or ally,
  and also might be outcomes, events from game perspectives.

  While commands can be like an instruction for the app.
*/
export const GameOpenMainScreen = commands('Open Main Screen');

export const OpenNewGameScreen = commands('Open New Game Screen');

export const OpenSettings = commands('Open Game settings');

export const OpenGlossary = commands('Open Glossary');

export const OpenMainMenu = commands('Open Main menu');

export const NavigateToView = commands<{ view: ViewsEnum }>('Navigate To View');

export const GameOpenMapStructuresScreen = commands(
  'Open map structures screen',
);

export const DisplayPlayerRewardPopup = commands<DisplayPlayerRewardAction>();

export const InitGameObjectApi = commands<InitGameObjectApiParams>();

export const InitSpell = commands<InitSpellAction>();

export const InitItem = commands<InitItemAction>();

export const InitBuilding = commands<InitBuildingAction>();

export const InitStructure = commands<InitMapStructureAction>();

export const PushEventFeedMessage = commands<{
  message: DescriptionElement[];
  delay?: number;
}>();

// supports html
export const PushPlainEventFeedMessage = commands<{
  message: string;
  delay?: number;
}>();

export const RemoveActionPoints = commands<{ points: number }>();

export const ActivateActionCard = commands<{
  player: Player;
  cardStack: ActionCardStack;
}>();

export const AddActionCardsToPlayer = commands<{
  player: Player;
  actionCardStacks: ActionCardStack[];
}>();
