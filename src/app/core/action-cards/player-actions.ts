import { PushEventFeedMessage, PushPlainEventFeedMessage, RemoveActionPoints } from '../events';
import { DescriptionElementType } from '../ui';
import { actionCardEvent } from '../vfx';
import { ActionCardTypes } from './types';
import { actionIcon, createActionCard, manaIcon } from './utils';

export const SetupCampActionCard = createActionCard({
  id: '#acard-setup-camp',

  title: 'Set up Camp',
  icon: 'campfire',
  type: ActionCardTypes.PlayerAction,
  bgColor: 'gray',
  iconColor: '#ffae66',
  description: 'You set up camp, skipping this day.',
  config: {
    onUsedInstantly({ events, actions }) {
      events.dispatch(
        RemoveActionPoints({
          points: actions.getActionPointsLeft(),
        }),
      );
    },
  },
});

export const TributeActionCard = createActionCard({
  id: '#acard-tribute',
  title: 'Tribute',
  icon: 'hand-saw',
  type: ActionCardTypes.PlayerAction,
  bgColor: 'green',
  iconColor: 'white',
  description: 'You gain 300 gold and 2 wood for 2 action points.',
  config: {
    onUsedInstantly({ events, players, actions }) {
      const currentPlayer = players.getCurrentPlayer();

      events.dispatch(RemoveActionPoints({ points: 2 }));

      const bonusGold = 300;
      const bonusWood = 2;
      players.giveResourcesToPlayer(currentPlayer, {
        gold: bonusGold,
        wood: bonusWood,
      });

      events.dispatch(
        PushEventFeedMessage({
          message: [
            {
              type: DescriptionElementType.FreeHtml,
              htmlContent: `${actionCardEvent(TributeActionCard)}:<hr/>+${bonusGold} Gold<br/>+${bonusWood} Wood`,
            },
          ],
        }),
      );
    },
  },
});

export const SkipDayActionCard = createActionCard({
  id: '#acard-skip-the-day',

  title: 'Skip the day',
  icon: 'moon-sun',
  type: ActionCardTypes.PlayerAction,
  bgColor: '#283761',
  iconColor: 'rgb(255 198 90)',
  borderColor: 'rgb(255 198 90)',
  description: `You will immediately skip this day and receive 200 gold for each remaining action point left.`,

  config: {
    onUsedInstantly({ events, players, actions }) {
      const currentPlayer = players.getCurrentPlayer();
      const actionPointsLeft = actions.getActionPointsLeft();
      const bonusGold = actionPointsLeft * 200;

      events.dispatch(RemoveActionPoints({ points: actionPointsLeft }));

      players.giveResourcesToPlayer(currentPlayer, {
        gold: bonusGold,
      });

      events.dispatch(
        PushEventFeedMessage({
          message: [
            {
              type: DescriptionElementType.FreeHtml,
              htmlContent: `${actionCardEvent(SkipDayActionCard)}:<hr/>+${bonusGold} Gold`,
            },
          ],
        }),
      );
    },
  },
});

// could be that it takes full day and recovers more mana per action point left?
export const MeditateActionCard = createActionCard({
  id: '#acard-meditate',

  title: 'Meditate',
  icon: 'barrier',
  bgColor: 'rgb(39 57 89)',
  iconColor: '#d9f2fd',
  type: ActionCardTypes.PlayerAction,
  description: `You restore ${manaIcon(3)} mana (+${manaIcon(2)} per point of Restoration specialty), consumes ${actionIcon(2)} action points. Action restored every week.`,

  actionPoints: 2,

  config: {
    onUsedInstantly({ events, players }) {
      const currentPlayer = players.getCurrentPlayer();
      const hero = currentPlayer.hero;
      const recoveryLevel = hero.specialtiesModGroup.getModValue('specialtyMagicRecovery') || 0;

      const restoredMana = 3 + recoveryLevel * 2;

      players.addManaToPlayer(currentPlayer, restoredMana);
      events.dispatch(
        PushEventFeedMessage({
          message: [
            {
              type: DescriptionElementType.FreeHtml,
              htmlContent: `${actionCardEvent(MeditateActionCard)}: Restored ${manaIcon(restoredMana)} Mana.`,
            },
          ],
        }),
      );
    },
  },
});

// Restore action can be given by High Tower from the city, and some locations on the map
// todo: make dynamic descriptions
export const RestoreActionCard = createActionCard({
  id: '#acard-restore-mana',
  title: 'Restore Mana',
  icon: 'barrier',
  bgColor: 'rgb(39 57 89)',
  iconColor: '#d9f2fd',
  type: ActionCardTypes.PlayerAction,
  description: `You restore 3 points of mana (+2 per point of Restoration specialty), consumes 1 action point.`,

  actionPoints: 1,

  config: {
    onUsedInstantly({ events, players }) {
      const currentPlayer = players.getCurrentPlayer();
      const hero = currentPlayer.hero;
      const recoveryLevel = hero.specialtiesModGroup.getModValue('specialtyMagicRecovery') || 0;

      const restoredMana = 3 + recoveryLevel * 2;

      players.addManaToPlayer(currentPlayer, restoredMana);
      events.dispatch(
        PushEventFeedMessage({
          message: [
            {
              type: DescriptionElementType.FreeHtml,
              htmlContent: `${actionCardEvent(RestoreActionCard)}: Restored ${manaIcon(restoredMana)} Mana.`,
            },
          ],
        }),
      );
    },
  },
});

// Recruitting action
export const RecruitActionCard = createActionCard({
  id: '#acard-recruit',

  title: 'Recruit',
  icon: 'knight-helmet',
  bgColor: 'rgb(39 57 89)',
  iconColor: '#d9f2fd',
  type: ActionCardTypes.PlayerAction,
  description: `Gives you additional units below tier 3, consumes 2 action points.`,
});

export const RangersHorn = createActionCard({
  id: '#acard-rangers-horn',

  title: `Ranger's Horn`,
  description: '8 Rangers will join your army for 3 days. Rangers are effective against forest dwellers.',
  bgColor: '#3c843c',
  icon: 'hood',
  type: ActionCardTypes.PlayerAction,
  config: {
    onUsedInstantly({ actions, players, events }) {
      const unitType = '#unit-neut-ranger-0';
      const currentPlayer = players.getCurrentPlayer();
      const count = 8;

      players.addUnitGroupToPlayer(currentPlayer, unitType, count);
      events.dispatch(PushPlainEventFeedMessage({ message: `${count} Rangers joined your army.` }));

      actions.scheduleActionInGameDays(() => {
        players.removeUnitTypeFromPlayer(currentPlayer, unitType, count);
        events.dispatch(PushPlainEventFeedMessage({ message: `Summoned Rangers have left your army.` }));
      }, 2);
    },
  },
});

// practically, a Tavern can be implemented via cards.
// building a Tavern will give you 2 cards for Recruiting.
//  one more card will be given per each level of Tavern
