import { Directive, HostListener, Input } from '@angular/core';
import { ActionHintTypeEnum, CustomHtmlActionHint } from 'src/app/core/ui';
import { ActionHintService } from '../../services/mw-action-hint.service';

@Directive({
  selector: '[mwActionHint]',
})
export class MwActionHintDirective {

  @Input()
  public mwActionHint: string = '';

  constructor(
    private readonly actionHint: ActionHintService,
  ) { }

  @HostListener('mouseenter')
  public showHint(): void {
    this.actionHint.hintMessage$.next({
      type: ActionHintTypeEnum.CustomHtml,
      html: this.mwActionHint,
    } as CustomHtmlActionHint);
  }

  @HostListener('mouseleave')
  public hideHint(): void {
    this.actionHint.hintMessage$.next(null);
  }
}
