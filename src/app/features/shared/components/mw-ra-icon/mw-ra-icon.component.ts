import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'mw-ra-icon',
  templateUrl: './mw-ra-icon.component.html',
  styleUrls: ['./mw-ra-icon.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MwRaIconComponent {
  @Input({ required: true }) public icon!: string;
}
