import { Modifiers, ModsRef } from "../modifiers";
import { GameApi } from "../triggers";

// don't provide expiresInNDays to keep mods as permanent
export function modifiersActivityBonus({
  api: { actions, players },
  expires = true,
  expiresInNDays = 7,
  mods,
}: {
  api: GameApi,
  mods: Modifiers,
  expiresInNDays?: number,
  expires?: boolean
}): void {
  const currentHero = players.getCurrentPlayer().hero;
  const modsRef = ModsRef.fromMods(mods);
  currentHero.weeklyActivitiesModGroup.addModsRef(modsRef);

  if (expires) {
    actions.scheduleActionInGameDays(() => {
      currentHero.weeklyActivitiesModGroup.removeModsRef(modsRef);
    }, expiresInNDays);
  }
}
