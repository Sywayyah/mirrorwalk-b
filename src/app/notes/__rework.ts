/*
    Candidates for rework:
        Models for units (there are now 2 models, less and more detailed)
          In general: "instance" types, also might be that "ouside combat" and
          "in-combat" types could be useful, because some properties of in-combat
          objet might be unused in out of combat state

        Structures
          Structures are currently swampy and unclear, hard to work with,
          also gonna need to rework popups along with structures.

        Assets:
          Assets should be optimized and size must be reduced, frames should become customizable,
          more assets in the future.

        Popups:
          For now, all popups are in battleground module, might be moved to views
          or somewhere else.

    Candidates for implementation:
        Store:
          The main idea for now is to create some mainstream state, where only main data exist
          (locations, players, towns, current location progress, etc.), and any derived, deviated
          subsets of data should derive from it.

          Also, it can be used for saves. Practically, it's unlikely that I gonna need to store
          derived things from main state in saves.

          Superficial idea: store might have main data, and also there might be special events
          that other services (or controllers) are going to listen and update/initialize other
          services.

        Main screen
          + Basic main screen is implemented
        Dynamic and flexible descriptions
          + Basic implementation for spells and items, can be used in many other places
        Locations
          + Basic implementations for chained locations and map view
        Towns
          + Basic implementation of towns
        Saves
        Categorize components
        UI optimizations, maybe more OnPush strategies
        Horizontal orientation?
          All units may not fit right into vertical orientation, I can try make them smaller,
          but still, horizontal orientation might be just right for that, while also allowing
          to showcase art more.

    Implemented:
        Feature modules:
          Now it's not just one folder for components and one for directives.
          For current basic implementation, there is a basic grouping (shared,
          views, battleground), might be improved further.

          Also, from now it is easier to introduce new screens, to declare reusable
          components and keep it all distunguished from everything else.

          For now, heroes and unit groups are created from fractions.

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

        Popups:
          Popups container is now shared, and now there is a much more convinient
          approach to create popups by passing component class via service
          (there is also a base class for convinient work with popups).
          Also, now there is a controller for popups.

        Menus:
          Now, aside from hints, there is also menu with similar api.
*/
