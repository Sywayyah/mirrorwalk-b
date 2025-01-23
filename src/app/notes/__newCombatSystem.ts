// Firebirds - starting from second round, can randomly restore mana, either
// to one of your units or your hero. Restoration increases mana regenerated.

/*
  New universal ability: Pin.

  Most towns have early tier 1-3 units that have Pin attack-ability.

  When using Pin on an enemy group, it's damage against other unit groups, except
  for the ones who have pinned it, is reduced (20-30%). In return, damage dealt to the pinners
  is usually increased (25%).

  Neutral units might have Light Pin ability, which is similar, but weaker.

  Almost any town has atleast 1 unit type which is 'unpinnable'.

  Giant creatures can newer be pinned by low-tier units.
*/

/*
  Universal ability - defend. Knights can defend another unit group.
*/

/*
  Unit types: Archers, Cavalry, Magical, Big Creature, Giant, Colossal, Undead, Forest Dwellers

  Archers might deal less damage (ranged) to Cavalry. To decrease this disadvantage,
  you need to have a True Strike.

  True Strike might come from Combat Tactics specialty. It has 3 tiers:
    - Basic Combat Tactics
    - Normal Combat Tactics
    - Advanced Combat Tactics

  Stacking same type of specialty gives bonuses:
    1 - Archers standing next to tier-1 units recieve less damage from Cavalry
    2 - +1 Attack, +1 Defence
    3 - +2 Attack, +2 Defence
    4 - Promotion To Normal Combat Tactics
*/

/*
  Unit states: Initial, Pinned, Moved into field, Dead, Retreated, Running, Pinning
    Recharging, Recharging Interrupted

    status of the unit can be visible in empty circle on portrait
    there can be different status transitions
    Most units start with Initial state.

  While in initial state (first round, no attack), Pin might have reduced damage
*/

/*
  New Mod Groups Buckets:
    Timeoutable mods
    Positioning mods
    Value mods
 */
