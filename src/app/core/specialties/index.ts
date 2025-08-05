import { WritableSignal } from '@angular/core';
import { RestoreActionCard, TributeActionCard } from '../action-cards/player-actions';
import { AddActionCardsToPlayer, BuildBuilding, NewDayStarted } from '../events';
import { Modifiers, ModsRef } from '../modifiers';
import { ResourceType } from '../resources';
import { GameApi } from '../triggers';
import { DescriptionElementType, DescriptionVariants } from '../ui';
import { modifiersActivityBonus } from './utils';

export interface WeeklyActivity {
  id: string;
  name: string;
  icon?: string;
  type: WeeklyActivityType;
  descriptions: (string | DescriptionVariants['variants'])[];
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
    id: 'architecture',
    name: 'Architecture',
    type: WeeklyActivityType.WeekStart,
    descriptions: ['You start week with town center built, your units above tier 1 are slowed down by 4.'],
    init({ actions, events, players }) {
      events.dispatch(
        BuildBuilding({
          buildingId: 'town-center',
          player: players.getCurrentPlayer(),
        }),
      );
      const weeklyBonus: Modifiers = {
        unitGroupSpeedBonus: -4,
      };

      const mods: Modifiers = {
        __unitConditionalMods(unitGroup) {
          return unitGroup.type.level > 1 ? weeklyBonus : null;
        },
      };

      players.getCurrentPlayer().hero.weeklyActivitiesModGroup.addModsRef(ModsRef.fromMods(mods));

      actions.scheduleActionInGameDays(() => {
        players.getCurrentPlayer().hero.weeklyActivitiesModGroup.removeRefByModInstance(mods);
      }, 7);
    },
  },

  {
    id: 'gem-cutting',
    name: 'Gem Cutting',
    type: WeeklyActivityType.WeekEnd,
    descriptions: [{ type: DescriptionElementType.Resource, resType: ResourceType.Gems, iconSize: 48 }, '+8 Gems.'],
    init({ actions, events, players }) {
      actions.scheduleActionInGameDays(() => {
        players.giveResourcesToPlayer(players.getCurrentPlayer(), { gems: 8 });
      }, 7);
      // const town = actions.getTownOfPlayer(players.getCurrentPlayer())!;
      // town.addMarketResources({ gems: 8 });
    },
  },
  {
    id: 'war-training',
    name: 'War Training',
    type: WeeklyActivityType.FullWeek,
    descriptions: ['Tier 1 units gain +2 to attack and defence.'],
    init({ actions, players }) {
      const weeklyBonus: Modifiers = {
        heroBonusAttack: 2,
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
      }, 7);
    },
  },
  {
    id: 'prosperity',
    name: 'Prosperity',
    type: WeeklyActivityType.FullWeek,
    descriptions: ['Income from structures increased by 10%.'],
  },
  {
    id: 'scholar',
    name: 'Scholar',
    type: WeeklyActivityType.FullWeek,
    descriptions: ['Experience gain is increased by 13%'],
    init(api) {
      modifiersActivityBonus({ api, mods: { experienceGainBonus: 0.13 } });
    },
  },
  {
    id: 'magic-hood',
    name: 'Magic Hood',
    type: WeeklyActivityType.Permanent,
    descriptions: ['Resistance against magic is increased by 5%'],
    init(api) {
      modifiersActivityBonus({ api, mods: { resistAll: 5 }, expires: false });
    },
  },
  {
    id: 'mysticism',
    name: 'Mysticism',
    type: WeeklyActivityType.Permanent,
    descriptions: ['+1 Restore action card<br> +6 to Hero Mana/Max Mana (scaling)'],
    init(api) {
      modifiersActivityBonus({ api, mods: { heroMaxMana: 6 }, expires: false });
      api.players.getCurrentPlayer().hero.addMana(6);

      const initialActionCards = [{ card: RestoreActionCard, count: 1 }];

      const currentPlayer = api.players.getCurrentPlayer();

      api.events.dispatch(
        AddActionCardsToPlayer({
          player: currentPlayer,
          actionCardStacks: initialActionCards,
        }),
      );
    },
  },
  {
    id: 'necromancy',
    name: 'Necromancy',
    type: WeeklyActivityType.FullWeek,
    descriptions: ['+1(scaling) to Necromancy'],
    init(api) {
      modifiersActivityBonus({ api, mods: { specialtyNecromancy: 1 } });
    },
  },
  {
    id: 'standard-bearer',
    name: 'Standard Bearer',
    type: WeeklyActivityType.Permanent,
    descriptions: ['+1 Attack<br> +1 Defence<br> +100 Hero Health<br> +10 Hero Damage'],
    init(api) {
      modifiersActivityBonus({ api, mods: { heroBonusAttack: 1, heroBonusDefence: 1 }, expires: false });
    },
  },
  {
    id: 'masonry',
    name: 'Masonry',
    type: WeeklyActivityType.FullWeek,
    descriptions: ['Gold and wood requirements for building are reduced by 10%'],
    init(api) {
      modifiersActivityBonus({ api, mods: { townBuildingCostFactor: -0.1 } });
    },
  },
  {
    id: 'nest-of-fire',
    name: 'Nest of Fire',
    type: WeeklyActivityType.WeekEnd,
    descriptions: ['+2 Firebirds'],
  },
  {
    id: 'hirelings',
    name: 'Hirelings',
    type: WeeklyActivityType.WeekEnd,
    descriptions: ['Hire a random Tier 4.'],
  },

  // hero-specific
  //
  {
    id: 'wind-elementals',
    name: 'Wind Elementals',
    type: WeeklyActivityType.WeekStart,
    descriptions: ['Replaces default army with 8 Wind Elementals'],
  },
  {
    id: 'crystal-illness',
    name: 'Crystal Illness',
    type: WeeklyActivityType.Permanent,
    descriptions: ['Every day you restore +1 Mana, but gain -3 to Defence'],
    init(api) {
      modifiersActivityBonus({ api, mods: { heroBonusDefence: -3 } });
      // maybe need to turn into an ability
      api.events.onEvent(NewDayStarted).subscribe(() => {
        api.players.getCurrentPlayer().hero.addMana(1);
      });
    },
  },
  {
    id: 'fire-mastery',
    name: 'Fire Mastery',
    type: WeeklyActivityType.Permanent,
    descriptions: ['+1 Fire Mastery'],
    init(api) {
      modifiersActivityBonus({ api, mods: { specialtyFireMastery: 1 } });
    },
  },

  {
    id: 'tribute',
    name: 'Tribute',
    type: WeeklyActivityType.WeekStart,
    descriptions: [`Gives you action card 'Tribute', that allows to collect 300 gold and 2 wood for 2 action points`],
    init({ actions, players, events }) {
      // could rely on random
      const initialActionCards = [{ card: TributeActionCard, count: 1 }];

      const currentPlayer = players.getCurrentPlayer();

      events.dispatch(
        AddActionCardsToPlayer({
          player: currentPlayer,
          actionCardStacks: initialActionCards,
        }),
      );
    },
  },
];
