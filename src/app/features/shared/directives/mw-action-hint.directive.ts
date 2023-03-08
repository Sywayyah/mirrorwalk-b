import { Directive, HostListener, Input, OnDestroy } from '@angular/core';
import { ActionHintTypeEnum, CustomHtmlActionHint } from 'src/app/core/ui';
import { ActionHintService } from '../../services/mw-action-hint.service';

// Maybe some animation can be provided.
@Directive({
  selector: '[mwActionHint]',
})
export class MwActionHintDirective implements OnDestroy {

  @Input()
  public mwActionHint: string = '';

  constructor(
    private readonly actionHint: ActionHintService,
  ) { }

  public ngOnDestroy(): void {
    this.actionHint.hintMessage$.next(null);
  }

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
