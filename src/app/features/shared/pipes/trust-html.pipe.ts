import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml',
  pure: true,
})
export class MwInfPipe implements PipeTransform {
  constructor(
    private readonly domSanitizer: DomSanitizer,
  ) { }

  transform(htmlString: string): SafeHtml {
    return this.domSanitizer.bypassSecurityTrustHtml(htmlString);
  }
}
