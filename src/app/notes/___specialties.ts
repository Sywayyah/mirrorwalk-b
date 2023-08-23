/*
  Idea: Items can give tier-based bonuses, like +2 to speed to your tier 1 units.
    Boots can have that role of increasing speed for certain units.
*/

/*

  Idea.
    Specialties. Hero can gain different specialties from items and buildings,
      such as:
        Necromancy,
        Intimidation,
        Spiritualism,

        Summoning,

        Combat Tactics,
        Fire Mastery,
        Mysticism,
        Divinity,
        Archery,

    Other game aspects, such as spells and units, might gain bonuses from different values,
      for example, units:

      Ghosts:
        Necromancy 2 - Ghosts gain 4 additional speed

        Necromancy 3, Intimidation 1 - Fright ability starts to work differently.
          Frightened unit deals 20% less damage against ghosts, 15% less against undead,
          and 12% less against all other units.

        & Wraiths
          Necromancy 3: +1 to min and max damage

      Pikeman:
        Combat Tactics 2: Pikeman gain 12% less physical damage. While alive, other units in the
          team will get reduced damage by 9-11%

        Combat Tactics 3: Pikeman retaliation damage increases up to 85%

        Combat Tactics 4: Pikeman retaliation damage increases up to 95%

      Archers:
        Archery 2: Attack penalty decreased to 3.

      Knights & Paladins:
        Divinity 2: Reduces magic damage of all other units by 8%

        Combat Tactics 5: Decreases effectiveness of enemy's attack rating by 30%.

      Cavalry:
        Charge 2: Allows to deal crushing damage to enemies with lower speed and defence.
          (Crushing damage - additional part of overall damage that is dealt separately, unreduced)

    Spells:

      Rain of Fire:
        Fire Mastery 2: Additional target that takes 35% of the damage.

      Enchant:
        Mysticism 1: Ability loses shared cooldown.

      Meteor:
        Mysticism 2: 30% of the damage converts to magical.

        Mysticism 4: Allows to target spell, damage of the spell reduced by 10%.

    And so on and so forth.
      It is yet unclear how exactly specialties could be implemented in the game.
      On one hand, there is already modifiers system, which feels great. Must it be?


    Possible sources of specialties:
      First of all, items (note, not every item must give specialties though.):
        - Black Lich Sword: +2 to Necromancy
        - Bone Shield: +1 to Necromancy
        - Skullhelm: +1 to Intimidation

        - Shield: +2 Armor
        - Sword of Battle-Mage: +2 to Fire Mastery, +1 to Mysticism
        - Pike: +1 to Combat Tactics
        - Flagbearer: +2 to Combat Tactics

        - Black feather: +1 to Archery
        - Ice Bow: +1 to Archery

      Locations:
        Magic School: Allows to learn some Magical specialties (Fire, Ice, Cold)
        High Magic School: Same, but also Mysticism

        Mixed Arts School: Necromancy, Random Magic Mastery, Some other specialty

        Academy: Combat Tactics, Archery


  Additional:
    Books & Spheres can be used instead of shields.

*/
