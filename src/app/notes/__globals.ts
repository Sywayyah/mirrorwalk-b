/*
  I18n. I was thinking about I18n, and I think I came up with some solution.
    Considering that I already have lots of places with plain strings and
    I actually want to keep things plain for further development and other
    possible developers, there might be a string-prefix approach, for
    instance I can create some tag-function i18n that is going to
    prefix my string with special prefix, which later is going to be
    somehow processed with pipes or anything else.


  Thinking about items, spells, heroes, etc, I started to think also about
    registires. There might be registries per each type of entity, and every
    entity is going to be resolved by some string id.

    As a disadvantage, this system might introduce errors of something missing
    here and there because of ids mismatching, or ids conflicting.

    And as an advantage, this system may allow resource packs instead of
    hardcoding and providing dependencies by code.
*/
