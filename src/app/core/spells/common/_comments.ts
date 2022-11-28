/* 

    === IDEAS ===

    # Idea: Leveling
    Leveling can be tied with structures and town buildings. For instance, player may
        visit school of fire spells, and he will be suggested to learn some fire spells.

        Both spells and masteries can be learned in structures.

        In some places, it may require money to learn spells. Buying spells may require
        some material, like gems. Special spells may require some extra-rare resource.


    === TODOS ===

    - Combat API:

    I need more methods in api for spells, like, healing units, slowing them (fight queue
        should be recalculated in this case). More modifiers. Maybe events with certain
        initiative, for example, falling meteor can have an initiative of 8, so it will
        fall before units of this initiative value make their turn.

        Abilities with initiative can also be represented in a fight queue.

        Also, there could be spells to create units during the fight, some kind of
        summoning.

    - Leveling: 

    Also, spells leveling can be something to experiment on. I do not know how exactly to
        go with it, maybe with something that is going to just feel better.

        I think that there should be some kinds of masteries, which can enhance skills,
        yet I'm not sure how to expose it as playing mechanics, will see.


*/