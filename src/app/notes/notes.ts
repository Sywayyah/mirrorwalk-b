
/* 
    Checklist:
        - Think of more complete structure models (Graveyard, Archer Tower, etc.)
        - Add camps with units of different towns.
        - Add turns per location limit.
        + Add hero levels and experience.
        + Add structures chains.
        - Add specialties.
        > Add damaged unit group.

        Side notes: 
            Items may provide more turns per location (Boots, most likely)

            Can be an interesting ability: Vengeful spirit. Unit always responds
            with the damage that group has at the beginning of the fight.

    Major features;
        - Towns
        > Add abilities
        - New towns and unit types
        - Locations
        - Unit upgrades
        - Limit hero's army, ability to split units
*/

/* 
    Update to what is below. Probably, if there are more unit types, races and abilities,
      it will became more interesting by default. The current problems may seem strong
      because there are not that much units, but diversity can make in better instantly.
      Specialties, upgrades, abilities, interactions, locations, heroes..
      Mechanics (experience, glory, hiring, mana, structures, etc.)
    
    Also, need to add a pre-fight popup (done)
*/

/*  Also, game can be made a little more interesting by increasing amount of 
      units to buy. The problem I'm trying to address is that I don't want make neutral stacks
      way too easy, so every problem can be solved with simply buying archers, but on the other
      hand, I don't want to make stack overpowered, so player is not going to lose 70% of his good
      army, since he has to make some more moves in this location. The player should be able to carry
      out some of the value into the next location. And he needs to see that his invested rare resources
      actually do make difference. So, it wouldn't be great to be albe to buy 7 archers when entering the
      town. Also, having bigger unit groups makes the fight outcome less obvious. 

      I feel like, in the first location, player should be given at least 2 hiring structures. One
      allows to hire units of his fraction, and another can offer some units of other fractions,
      even neutral fractions sometimes.

      So, player can prefer to get more firepower in this location. Or, he may collect resources
      for even better firepower, but delaying it. He can be even forced to get them, if there is
      some rare type of units, that can only be obtained from a structure. On the other side, there
      can be some other structure, that can grab player's attention.

      Once player takes the city by building the town hall, the player can later view this town, as
      it starts to offer warriors at initially reduced amount (which can be increased later by upgradning
      this town, this made to avoid having the full power of many headed towns, it is required to invest
      into them to make them worthy).
      
*/

/* 
    My game

        I want to have ghosts, probably as basic neutral enemies. They may protect the location of crypt.
         Once guard is defeated, a player can hire basic ghosts from the crypt.
         They can only be upgraded at the city of this kind.

        Units can be sold as well.

        Cities may have many buildings. Upgrading them will allow player to hire and upgrade more units.

        Also i feel like there can be done two things, the building can be upgraded with a camp,
         so next time this city won't have upgrade, or can be upgraded completely so it will be always available.

        Also. There could be an item which ensures that you'll have this kind of town in the next round, for a certain price.

        Also. The amount of active groups might be limited, and some talents may increase this allowed group quantity.

        Also. Locations at the start.
        Resources. Mines. Artifact. Library. Hirelings. Taverns. Unknown locations.

        A player may have 3-4 different locations and it will be up to him what he wants, resources, army,
         spells, items, or income. And his amount of turns per location is limited.

        And sometimes it will be open for a player which resource or item he is going to get.

        Later more, like, foreseeing tower, etc.

        And experience or glory will unlock more buildings

        ==== 
        
        Might also be interesting.
            Aside from these, there might be random thing locations. There might be random reward of given type and guard.
            The thing is that random locations might have slightly bigger enemies, but also slightly better rewards.
*/

/* 
    Unit types
        
        Player may prefer different units, depending on what he wants. He can get a cheap units, but
        which are worse in a long run, having no significant upgrades or buffs, or vice versa.
        (for now, I assume that upgraded units can be of bigger level than original unit type)

        Also, there might be special treats. Some units can have faster speed, dealing first damage.
        Some can attack twice, some has big roll on their damage. Some units may deal poison dmg, which
        hits every round. 

        Some might respond on attacks, some may avoid responding attacks. Some can deal increased damage
        from response.

        Maybe slowing down the enemies, meaning their turn will be delayed.

*/


/* 
    # Artifacts, their active and passive abilities:
    
    What if, for example:

        Doomstring: your ranged units gain ability to apply Amplified Damage debuff against the target,
            reducing their physical damage resistance by -50%.

    
    Like, when it's turn for a unit group, basing on it's damage type, it can use some of the type-based abilities.
    Maybe also can be some kind of... level requirements. For example, Doomstring can only be used by archers level 4.
    
    I like this idea with requirements. Can make some player to prioritize to have some specific units in his army,
        since if player has no ranged units or ranged units with not enough level cannot use this strong item.

    
    # What if.. neutral groups can also have items (with active abilities)

    And there can be an item as reward.
    
    # UI

    What if.. long cards?
*/