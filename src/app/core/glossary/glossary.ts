export interface GlossaryTab {
  tabId: string;
  tabName: string;
  icon?: string;
  descriptions: string[];
}

export const glossaryContent: GlossaryTab[] = [
  {
    tabId: 'start',
    tabName: 'Welcome',
    icon: 'book',
    descriptions: [
      `Welcome to the Glossary!`,
      `Here you can learn about the concepts, special interactions and other details without leaving the game.`,
    ],
  },
  {
    tabId: 'specialties',
    tabName: 'Specialties',
    icon: 'health-increase',
    descriptions: [
      'While in the game, at the beginning of each week you are welcomed by Specialties dialog.',
      'In this dialog you can select list of bonuses & rewards granted for this week, which may affect your hero, town, units, game progression, etc.',
      'Bonus value and variety can change with time, level, progression, etc.',
    ],
  },
  {
    tabId: 'market',
    tabName: 'Town: Market',
    icon: 'gavel',
    descriptions: [
      'Market is a buildable town structure where you can exchange resources.',
      'By default, market allows you to trade basic resources: gold and wood. Market has limited amount of each resource type, preventing limitless resource conversion.',
      'By fighting enemies on the map you are freeing passages and trading routes, enabling more resources to reach your market. In this way, aside from getting more of basic resources, advanced resources, like gems and crystals, can also appear in a wider variety on your market.',
      'Fighting rare and more dangerous enemies will more likely yield rare resources.',
      'Every new week your market will lose some amount of resources gained from previous week. You can upgrade market to reduce the loss and increase base resources count.',
      'Some buildings in your town can synergize with Market, yielding some rare resources weekly.',
    ],
  },
  {
    tabId: 'spells',
    tabName: 'Spells & Mana',
    icon: 'burning-book',
    descriptions: [
      `Spells are special abilities of units and heroes that can be cast during the fight`,
      `Most heroic spells are only castable once per fight, forcing you to employ the strategy both during the battle and the choice of abilities.`,
      `Abilities come in 3 main activation types:`,
      `- Targetable: Requires to select a target`,
      `- Instant: Doesn't require a target, cast instantly`,
      `- Passive: Ability cannot be activated, but has a passive effect`,
      `Mana is the resource that limits your ability to cast spells for your hero and units. Units can have their own manapool, when drained - mana will be taken from their hero. As soon as mana is fully drained, abilities that require mana can no longer be cast.`,
      `Game provides different sources to replenish mana. Specialty Restoration increases most effects that restore your mana.`,
    ],
  },
  {
    tabId: 'pin',
    tabName: 'Universal Move: Pin',
    icon: 'crossed-swords',
    // should pin have unit count threshold with chance activating?
    descriptions: [
      `Pin is a universal attack-ability, all towns have an early unit type that can pin an opponent. ` +
      `Pinning an opponent will inflict normal attack and force them to do reduced damage against all your groups aside from the pinning group.`,
      `On pin, both groups enter respective states: Pinning and Pinned. ` +
      `A pinning group also recives increased damage from enemy's unpinned groups and deals less damage to them (by default - 25% ratio).`,
      `Special Interactions:`,
      `- Attacking or pinning another target will release previous target from pin. Attacking other group will make you lose Pinning state.`,
      `- Ranged units have lesser damage penalty when pinned.`,
      `- Cavalry units have natural 30% chance to escape pinning.`,
      `- Tier 1-4 units cannot pin units of 6+ tier (as well as Giant and Colossal creatures).`,
      `- Pinned units have a chance of getting increased damage from ranged units.`,
    ],
  },
  // {
  //   // tabId: 'hero',

  // },
];
