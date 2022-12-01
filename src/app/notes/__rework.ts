/*
    Candidates for rework:
        Models for units (there are now 2 models, less and more detailed)
          In general: "instance" types, also might be that "ouside combat" and
          "in-combat" types could be useful, because some properties of in-combat
          objet might be unused in out of combat state

        Structures
          Structures are currently swampy and unclear, hard to work with,
          also gonna need to rework popups along with structures.

        Fractions:
          Heroes might also be created from a fraction, also fraction
          might set up some default parameters so I won't need to specify
          some default or experimental parameters repeatedly.

        Assets:
          Assets should be optimized and size must be reduced, frames should become customizable,
          more assets in the future.

        Popups:
          Extract popups container as shared component, where customizable content can be passed.
          Rework popups.

    Candidates for implementation:
        Main screen
        Dynamic and flexible descriptions
        Locations
        Towns
        Saves
        Categorize components
        UI optimizations, maybe more OnPush strategies

    Implemented:
        Feature modules:
          Now it's not just one folder for components and one for directives.
          For current basic implementation, there is a basic grouping (shared,
          views, battleground), might be improved further.

          Also, from now it is easier to introduce new screens, to declare reusable
          components and keep it all distunguished from everything else.

        Changed project structure from dict/models to grouped related entities:
          Now it's more concise, early on it was messy and it was hard to
          keep track of what there is in the project. Also, much cleaner
          modules structure.

        New events system, much cleaner and simpler:
          Now it is easier to create and wire events, also no need
          to use cleanup on destroy. Also, now there are outer logic controllers,
          which helps a lot with circle dependencies, before that there was
          a lot of mutual imports of, mostly, not related services.
          There might be something still coming, something like state,
          but with controllers it already a lesser need.

        Fractions:
          Now fractions are defined rather as simple map, where each base type
          for unit is created as plain object. It could be useful to have
          fraction itself as a separate object with it's own name, state and
          rest, but also from it will be possible to create base types for
          units.
*/
