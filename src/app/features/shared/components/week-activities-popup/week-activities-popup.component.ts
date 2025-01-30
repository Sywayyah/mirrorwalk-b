import { Component, signal } from '@angular/core';
import { GameApi } from 'src/app/core/triggers';

interface WeeklyActivity {
  name: string;
  icon?: string;
  type: WeeklyActivityType;
  description: string;
  init?: (config: GameApi) => {};
}

interface ActivityCategory {
  name: string;
  activityBases: WeeklyActivity[];
}

enum WeeklyActivityType {
  WeekStart,
  FullWeek,
  WeekEnd,
}

const acitivies: WeeklyActivity[] = [
  { name: 'Architecture', type: WeeklyActivityType.WeekEnd, description: 'Your town center will be upgraded by the end of the week. You have to draw a card from Negative Events stack.' },
  { name: 'Gem Cutting', type: WeeklyActivityType.WeekEnd, description: '+8 Gems.' },
  { name: 'War Training', type: WeeklyActivityType.FullWeek, description: 'Tier 1 units gain +1 to max damage.' },
  { name: 'Prosperity', type: WeeklyActivityType.FullWeek, description: 'Income from structures increased by 10%.' },
  { name: 'Scholar', type: WeeklyActivityType.FullWeek, description: 'Experience gain is increased by 10%' },
  { name: 'Magic Hood', type: WeeklyActivityType.FullWeek, description: 'Resistance against magic is increased by 5%' },
  { name: 'Mysticism', type: WeeklyActivityType.WeekEnd, description: '+100 Hero Healtlh, +5 to Hero Mana/Max Mana (scaling)' },
  { name: 'Necromancy', type: WeeklyActivityType.FullWeek, description: '+1(scaling) to Necromancy' },
  { name: 'Standard Bearer', type: WeeklyActivityType.WeekEnd, description: '+1 Attack, +1 Defence, +100 Hero Health, +10 Hero Damage' },
  { name: 'Masonry', type: WeeklyActivityType.FullWeek, description: 'Gold and wood requirements for building are reduced by 10%' },
  { name: 'Nest of Fire', type: WeeklyActivityType.WeekEnd, description: '+2 Firebirds' },
  { name: 'Hirelings', type: WeeklyActivityType.WeekEnd, description: 'Hire a random Tier 4.' },

  // hero-specific
  //
  { name: 'Wind Elementals', type: WeeklyActivityType.WeekStart, description: 'Replaces default army with 8 Wind Elementals' },
  { name: 'Crystal Illness', type: WeeklyActivityType.FullWeek, description: 'Every day you restore +2 Mana, but gain -10% to Defence' },
  { name: 'Fire Mastery', type: WeeklyActivityType.WeekEnd, description: '+1 Fire Mastery' },
];

@Component({
  selector: 'mw-week-activities-popup',
  imports: [],
  templateUrl: './week-activities-popup.component.html',
  styleUrl: './week-activities-popup.component.scss'
})
export class WeekActivitiesPopupComponent {
  readonly categories = signal<ActivityCategory[]>([
    {
      name: 'Basic', activityBases: [
        acitivies[2],
        acitivies[3],
        acitivies[4],
      ],
    },
    {
      name: 'Medium', activityBases: [
        acitivies[1],
        acitivies[6],
        acitivies[7],

      ],
    },
    {
      name: 'Advanced', activityBases: [
        acitivies[8],
        acitivies[9],
        acitivies[0],
      ],
    },
  ]);

  readonly ActivityType = WeeklyActivityType;
}
