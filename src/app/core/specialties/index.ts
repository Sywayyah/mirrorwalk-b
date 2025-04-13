import { WritableSignal } from '@angular/core';
import { NewDayStarted } from '../events';
import { Modifiers, ModsRef } from '../modifiers';
import { GameApi } from '../triggers';
import { modifiersActivityBonus } from './utils';

export interface WeeklyActivity {
  name: string;
  icon?: string;
  type: WeeklyActivityType;
  description: string;
  init?: (config: GameApi) => void;
}

export interface ActivityCategory {
  name: string;
  activityBases: WeeklyActivity[];
  choice: WritableSignal<WeeklyActivity>;
}

export enum WeeklyActivityType {
  WeekStart,
  FullWeek,
  Permanent,
  WeekEnd,
}

export const acitivies: WeeklyActivity[] = [
  {
    name: 'Architecture',
    type: WeeklyActivityType.WeekEnd,
    description:
      'Your town center will be upgraded by the end of the week. You have to draw a card from Negative Events stack.',
  },
  {
    name: 'Gem Cutting',
    type: WeeklyActivityType.WeekEnd,
    description: '+8 Gems.',
    init({ actions, events, players }) {
      actions.scheduleActionInGameDays(() => {
        players.giveResourcesToPlayer(players.getCurrentPlayer(), { gems: 8 });
      }, 7);
      // const town = actions.getTownOfPlayer(players.getCurrentPlayer())!;
      // town.addMarketResources({ gems: 8 });
    },
  },
  {
    name: 'War Training',
    type: WeeklyActivityType.FullWeek,
    description: 'Tier 1 units gain +1 to max damage.',
    init({ actions, players }) {
      const weeklyBonus: Modifiers = {
        heroBonusAttack: 3,
        heroBonusDefence: 2,
      };

      const mods: Modifiers = {
        __unitConditionalMods(unitGroup) {
          return unitGroup.type.level === 1 ? weeklyBonus : null;
        },
      };

      players.getCurrentPlayer().hero.weeklyActivitiesModGroup.addModsRef(ModsRef.fromMods(mods));

      actions.scheduleActionInGameDays(() => {
        // todo: figure out if it is required to remove returned mod (probably not, since changing mod will recalc conditional mod too)
        players.getCurrentPlayer().hero.weeklyActivitiesModGroup.removeRefByModInstance(mods);
        // players.getCurrentPlayer().hero.weeklyActivitiesModGroup.removeRefByModInstance(weeklyBonus);
      }, 1);
    }
  },
  {
    name: 'Prosperity',
    type: WeeklyActivityType.FullWeek,
    description: 'Income from structures increased by 10%.',
  },
  {
    name: 'Scholar',
    type: WeeklyActivityType.FullWeek,
    description: 'Experience gain is increased by 10%',
    init(api) {
      modifiersActivityBonus({ api, mods: { experienceGainBonus: 0.1 } });
    }
  },
  {
    name: 'Magic Hood',
    type: WeeklyActivityType.Permanent,
    description: 'Resistance against magic is increased by 5%',
    init(api) {
      modifiersActivityBonus({ api, mods: { resistAll: 5 }, expires: false });
    }
  },
  {
    name: 'Mysticism',
    type: WeeklyActivityType.Permanent,
    description: '+100 Hero Healtlh, +5 to Hero Mana/Max Mana (scaling)',
    init(api) {
      modifiersActivityBonus({ api, mods: { heroMaxMana: 5 }, expires: false });
      api.players.getCurrentPlayer().hero.addMana(5);
    }
  },
  {
    name: 'Necromancy',
    type: WeeklyActivityType.FullWeek,
    description: '+1(scaling) to Necromancy',
    init(api) {
      modifiersActivityBonus({ api, mods: { specialtyNecromancy: 1 } });
    },
  },
  {
    name: 'Standard Bearer',
    type: WeeklyActivityType.Permanent,
    description: '+1 Attack, +1 Defence, +100 Hero Health, +10 Hero Damage',
    init(api) {
      modifiersActivityBonus({ api, mods: { heroBonusAttack: 1, heroBonusDefence: 1 }, expires: false });
    }
  },
  {
    name: 'Masonry',
    type: WeeklyActivityType.FullWeek,
    description: 'Gold and wood requirements for building are reduced by 10%',
    init(api) {
      modifiersActivityBonus({ api, mods: { townBuildingCostFactor: -0.1 } });
    },
  },
  {
    name: 'Nest of Fire',
    type: WeeklyActivityType.WeekEnd,
    description: '+2 Firebirds',
  },
  {
    name: 'Hirelings',
    type: WeeklyActivityType.WeekEnd,
    description: 'Hire a random Tier 4.',
  },

  // hero-specific
  //
  {
    name: 'Wind Elementals',
    type: WeeklyActivityType.WeekStart,
    description: 'Replaces default army with 8 Wind Elementals',
  },
  {
    name: 'Crystal Illness',
    type: WeeklyActivityType.Permanent,
    description: 'Every day you restore +1 Mana, but gain -3 to Defence',
    init(api) {
      modifiersActivityBonus({ api, mods: { heroBonusDefence: -3 } });
      api.events.onEvent(NewDayStarted).subscribe(() => {
        api.players.getCurrentPlayer().hero.addMana(1);
      });
    }
  },
  {
    name: 'Fire Mastery',
    type: WeeklyActivityType.Permanent,
    description: '+1 Fire Mastery',
    init(api) {
      modifiersActivityBonus({ api, mods: { specialtyFireMastery: 1 } });
    }
  },
];


