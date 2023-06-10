/*
  Coding.
    Console commands: I might add some events that can be interpreted
    as commands in console.

    Event types: I can try to extract a type from events group,
    and refer the type of Events by this util type.

  Some elements of balancing.
    Some strong units, like Archers, might have a delayed upgrade, or
    even conditional upgrade. For instance, Archers cannot not be upgraded
    into Crossbowmen until the Town Hall is level 3 or 4. It could also
    be hero-dependent. Some heroes might get an early tech for Archers.

    But there might also be some interesting choice making. For instance,
    though tech for Archers is delayed in town, there might be a map
    structure that allows to promote Archers to Crossbowmen. It will
    take player to make decisions, if he wants to promote his Archers
    earlier, or he might wanna just save some money on costly tech
    for Archers.

    Potentially, structures outside of town may promote units using other
    resources and minimal unit number, like you can promote 10 Archers
    into 10 Crossbowmen using 3 Iron and 3 Wood.

    In some rare cases, units might have no upgrade available in town.

    But as well, such strong units can be moderated with cost. You could
    spend money you saved from not buying Archers on something else.
    So, considerable price can ignite choice making.

    Also, some low-level units might give/receive bonuses when army
    is stacked with some other units of tier below 3 or 4.

  Features.
    Maybe there can be some feature class that can be used to describe
    features in the state. It can be configured in any way, also
    decorators will be available.

  Self-animating containers.
    There can be a container, and items. This container is going to provide
    a service, so children items can access it and communicate with
    container. For instance, service may dispatch command according to which
    item is going to animate it's own disappearance, but this item cannot be
    removed right away, because animation will fail. But with service,
    item can receive an event from container so that it needs to animate
    it's own disappearance, and when it's done, item can use service to remove
    itself.

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
