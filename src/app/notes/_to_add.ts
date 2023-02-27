/*
  Possible cool ideas:
    Styles. Characters may have styles, like Taltir. He can have Style A and
      Style B. In Style A, he has meteor and Fire Spirits, that die in the
      end of the round, but may cause additional effects.

      in Styles B, his Fire Spirits may remain during battles, also
      having more effects or even spells, like splash damage.

    Legendary units. Heroes might have specialties, and based on them + some
      other factors, player might unlock legendary units. For instance,
      player might unlock legendary upgrade for Firebirds and Mystical Birds:
      Phoenix. Phoenix will cost significantly more than either of previous,
      but will have top-tier stats, for instance, 10% all res, +20% fire res,
      increased armor, damage and hp, and additional +50% damage to dragons.
      Many creatures can have this form, and it may surpass the top-tier
      units of that town.

    Units to add + AI:
      Swamp Prince. An big amphibian creature dwelling near swamps (level 3),
      normal damage is below average among that tier, but this creature
      can cast Fire Ball (3-5 fire damage per unit in group), manacost: 3.
      Manapool: 5. Restores 1 mana each turn.

    Skeleton Mage. May have average stats of level 4 unit, but also
      affect mana regen of allied unit groups, so can make casters more
      effective.
*/
/*
    Implementable ideas:
      * Descriptions to heroes/locations on the map?

      * Summoning units. I created Fire Elementals, now I need to provide action
        for summoning and handle some mechanics, for instance, cleanup summoned units
        after fight is over.

        Also, there might be some additional actions performed when certain units are
        summoned. For example, when summoning Fire Elements, it may deal 15-25 damage
        to all enemy units.

      * Fire Elements can be used as a guard in some locations.

      * Spells dynamic descriptions

    Desirable ideas:
      * Markets, so player can trade resources. ALso, Markets may have different levels,
        and they might allow to cell/buy more types of resources, or reduce trading costs
        in some fractions.

    Just ideas:
      * There can be items (shields mostly) that reduce received damage if you are not
        making the first move in the battle. Also, there can be units (could be slow)
        that receive reduced damage until they make move in the current round.

*/

/*
    Short ideas of things to add

    Add: Items, which can introduce individual cooldowns to spells. For example
      Phoenix Shield: Changes cooldown of Fire, Lightning and Cold Shield abilities
      to individual, lasting for 2 rounds. (Also a new concept of Individual Cooldown)


    Add structure: Beacon of Ghosts. Allows to upgrade ghosts and ghost-mages.

    Add: Locations with prices. For example, some location may suggest some
      reward for a price. For example, Witch Guild could give you Eclipse Wand
      for 1000 gold and 3 gems. Such locations may not spend movement points.

    Add: Revisiting some locations with rewards you already have (e.g. spells)
      can bring something else, e.g. gold, gems, experience, stats.

    Add: item which grants move speed to random unit group at the beginnnig
      of the fight. This would help with making the first move.

    Add: item which allows to cast Enchant-like spell, so casters can increase
      their damage output within the same round.

    Add: item which allows to instantly cast Enchant agains all enemies.

    Idea: Dueling. Dueling can reduce enemy's damage when he is attacking other than
      someone he's dueling now.

    Idea: There could be some ways to not only learn abilities, but also masteries
      at the same time. For example, visiting Witch Hut can grant a hero both
      Enchant and some Mastery, that allows to cast is instantly against all enemies.

      And it also could be the only way to achieve this Mastery, would be no other ways,
      only Witch Hut.

    Idea: Materies can require costly rare resources, like Crystals. But they may also
        do something like, learning some big mastery increases your level by 2, but
        doesn't give spell points. And current experience is erased, experience bar
        becomes empty.

*/
