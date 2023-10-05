import { createEventType } from 'src/app/store';
import { Modifiers } from '../../modifiers';
import { UnitGroup } from '../../unit-types';

const battleCommand = createEventType;

export const AddCombatModifiersToUnit = battleCommand<{ unit: UnitGroup, mods: Modifiers }>();

export const RemoveCombatModifiersFromUnit = battleCommand<{ unit: UnitGroup, mods: Modifiers }>();

export const RegisterUnitLoss = battleCommand<{ unit: UnitGroup; loss: number }>();
