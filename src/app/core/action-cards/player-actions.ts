import { PushEventFeedMessage, RemoveActionPoints } from '../events';
import { DescriptionElementType } from '../ui';
import { actionCardEvent } from '../vfx';
import { ActionCard, ActionCardTypes } from './types';
import { actionIcon, manaIcon } from './utils';

export const SkipDayActionCard: ActionCard = {
  title: 'Skip the day',
  icon: 'moon-sun',
  type: ActionCardTypes.PlayerAction,
  bgColor: '#283761',
  iconColor: 'rgb(255 198 90)',
  borderColor: 'rgb(255 198 90)',
  description: `You will immediately skip this day and receive 150 gold for each remaining action point left.`,

  config: {
    onUsedInstantly({ events, players, actions }) {
      const currentPlayer = players.getCurrentPlayer();
      const actionPointsLeft = actions.getActionPointsLeft();
      const bonusGold = actionPointsLeft * 150;

      events.dispatch(RemoveActionPoints({ points: actionPointsLeft }));

      players.giveResourcesToPlayer(currentPlayer, {
        gold: bonusGold
      });

      events.dispatch(PushEventFeedMessage({
        message: [{
          type: DescriptionElementType.FreeHtml,
          htmlContent: `${actionCardEvent(SkipDayActionCard)}:<hr/>+${bonusGold} Gold`
        }]
      }));
    }
  }
};

// could be that it takes full day and recovers more mana per action point left?
export const MeditateActionCard: ActionCard = {
  title: 'Meditate',
  icon: 'barrier',
  bgColor: 'rgb(39 57 89)',
  iconColor: '#d9f2fd',
  type: ActionCardTypes.PlayerAction,
  description: `You restore ${manaIcon(3)} points of mana (+${manaIcon(2)} per point of Restoration specialty), consumes ${actionIcon(2)} action points. Action restored every week.`,

  actionPoints: 2,

  config: {
    onUsedInstantly({ events, players }) {
      const currentPlayer = players.getCurrentPlayer();
      const hero = currentPlayer.hero;
      const recoveryLevel = hero.specialtiesModGroup.getModValue('specialtyMagicRecovery') || 0;

      const restoredMana = 3 + recoveryLevel * 2;

      players.addManaToPlayer(currentPlayer, restoredMana);
      events.dispatch(PushEventFeedMessage({ message: [{ type: DescriptionElementType.FreeHtml, htmlContent: `${actionCardEvent(MeditateActionCard)}: Restored ${manaIcon(restoredMana)} Mana.` }] }));
    },
  },
};

// Restore action can be given by High Tower from the city, and some locations on the map
export const RestoreActionCard: ActionCard = {
  title: 'Restore Mana',
  icon: 'barrier',
  bgColor: 'rgb(39 57 89)',
  iconColor: '#d9f2fd',
  type: ActionCardTypes.PlayerAction,
  description: `You restore 3 points of mana (+2 per point of Restoration specialty), consumes 1 action point.`,

  actionPoints: 1,
};

// Recruitting action
export const RecruitActionCard: ActionCard = {
  title: 'Recruit',
  icon: 'knight-helmet',
  bgColor: 'rgb(39 57 89)',
  iconColor: '#d9f2fd',
  type: ActionCardTypes.PlayerAction,
  description: `Gives you additional units below tier 3, consumes 2 action points.`,
};

// practically, a Tavern can be implemented via cards.
// building a Tavern will give you 2 cards for Recruiting.
//  one more card will be given per each level of Tavern


