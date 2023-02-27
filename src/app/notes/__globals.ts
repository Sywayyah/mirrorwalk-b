/*
  I18n. I was thinking about I18n, and I think I came up with some solution.
    Considering that I already have lots of places with plain strings and
    I actually want to keep things plain for further development and other
    possible developers, there might be a string-prefix approach, for
    instance I can create some tag-function i18n that is going to
    prefix my string with special prefix, which later is going to be
    somehow processed with pipes or anything else.


  Registries. Thinking about items, spells, heroes, etc, I started to think also
    about registires. There might be registries per each type of entity, and every
    entity is going to be resolved by some string id.

    As a disadvantage, this system might introduce errors of something missing
    here and there because of ids mismatching, or ids conflicting.

    And as an advantage, this system may allow resource packs instead of
    hardcoding and providing dependencies by code.

    & Also, considering the topic of resource packs, dynamic imports might
    be an idea to load dynamic packs.

    & Also, registries can be used for resources and assets.

  Triggers. Considering I need some flexibility and there might be
    more than 1 game modes, I may want to introduce triggers.

    In some sense, I can introduce them anyways. If anything, I'll
    be able to transfer logic to triggers.

    It might introduce more apporaches to do things. But also might
    be useful to implement different game modes.

  Structures. The further it gets, the more I start to think
    about having programmable behaviors rather than declarative.
    I feel like locations can have lots of different variants,
    revisitable, hirable, stuff like that. Not sure if declarative
    apporach can take care of all that effectively...

  Constants config. Along with Triggers, I might provide constants
    object in order to override/tweak some values for different modes.

    (So, like, different game modes can provide their own values)

    For instance, in some game mode there might be different value
    for attack rating/armor.

  Images can be jpg or have high compression level png.
*/
