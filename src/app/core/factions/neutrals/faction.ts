import { Factions } from '../factions';

const defaultReward = {
  gold: 0,
  experience: 0,
};

export const neutralsFaction = Factions.createFaction({
  id: '#faction-neutrals',
  title: 'Neutrals',
  icon: 'monster-skull',
});
