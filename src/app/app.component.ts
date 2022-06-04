import { Component, OnInit, ViewChild } from '@angular/core';
import { HintsContainerComponent } from './feature-sandbox/components/ui-elements/hints-container/hints-container.component';
import { HintsService } from './feature-sandbox/services/ui/hints.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('hintsContainer', { static: true }) public hintsContainer!: HintsContainerComponent;

  constructor(private readonly hintsService: HintsService) {}

  public ngOnInit(): void {
    this.hintsService.containerRef = this.hintsContainer;
  }
}
