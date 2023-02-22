import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DescHtmlElement, DescriptionElement, DescriptionElementType } from 'src/app/core/ui/descriptions';

@Component({
  selector: 'mw-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DescriptionComponent implements OnInit {

  @Input()
  public descriptions!: DescriptionElement[];

  public processedDescriptions: DescriptionElement[] = [];

  constructor(
    private domSanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
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
