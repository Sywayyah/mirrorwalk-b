/* 
    So far I'm not sure about using classes for my ingame entities.
        It's like, the functionality related to some entity may require
        application-wide scope, hence that, it's hard to figure out
        what to store inside a class.

        Nevertheless, there is some entity-related functionality.
        And it's better to have some single source for it, so it can
        be changed all at once and easily reused.

        Services can be good for this. PlayersService may have
        player-related functionality (addUnitGroupToThePlayer),
        UnitsService may deal with health manipulations and other
        things.
*/