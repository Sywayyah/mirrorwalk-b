import { Directive, ElementRef, Input, OnInit, TemplateRef } from '@angular/core';

/* Maybe gonna need this some day */
@Directive({
    selector: '[mwSharedTemplate]',
    standalone: false
})
export class SharedTemplateDirective implements OnInit {

  @Input('mwSharedTemplate')
  public templateName!: string;

  constructor(
    private template: TemplateRef<ElementRef>,
  ) { }

  ngOnInit(): void {
    console.log('------->>', this.templateName);
  }

}
