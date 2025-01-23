import { Component, signal } from '@angular/core';
import { BasicPopup } from '../popup-container';
import { glossaryContent } from 'src/app/core/glossary/glossary';
import { SharedModule } from '../../shared.module';

@Component({
  selector: 'mw-glossary',
  imports: [SharedModule],
  templateUrl: './glossary.component.html',
  styleUrl: './glossary.component.scss',
})
export class GlossaryComponent extends BasicPopup<{}> {
  readonly glossaryTabs = glossaryContent;

  readonly activeTab = signal(this.glossaryTabs[0]);
}
