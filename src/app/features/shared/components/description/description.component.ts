import { ChangeDetectionStrategy, Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DescHtmlElement, DescriptionElement, DescriptionElementType } from 'src/app/core/ui/descriptions';

@Component({
  selector: 'mw-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DescriptionComponent implements OnChanges {

  @Input()
  public descriptions!: DescriptionElement[];

  public processedDescriptions: DescriptionElement[] = [];

  constructor(
    private domSanitizer: DomSanitizer,
  ) { }

  ngOnChanges(): void {
    this.processedDescriptions = this.descriptions.map((descr) => {

      if (descr.type === DescriptionElementType.FreeHtml) {
        return {
          ...descr,
          htmlContent: this.domSanitizer.bypassSecurityTrustHtml((descr as DescHtmlElement).htmlContent),
        }
      }

      return descr;
    });
  }

}
