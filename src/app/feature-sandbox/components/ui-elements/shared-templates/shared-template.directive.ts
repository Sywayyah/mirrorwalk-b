import { Directive, ElementRef, Input, TemplateRef } from '@angular/core';

/* Maybe gonna need this some day */
@Directive({
  selector: '[mwSharedTemplate]'
})
export class SharedTemplateDirective {

  @Input('mwSharedTemplate')
  public templateName!: string;

  constructor(
    private template: TemplateRef<ElementRef>,
  ) {}

  ngOnInit(): void {
    console.log('------->>', this.templateName);
  }

}
