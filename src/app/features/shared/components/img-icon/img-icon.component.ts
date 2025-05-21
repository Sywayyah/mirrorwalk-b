import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  OnChanges,
} from '@angular/core';
import { ImgIconSize, ImgIconsPaths } from 'src/app/core/assets';

@Component({
  selector: 'mw-img-icon',
  template: ``,
  styleUrl: './img-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ImgIconComponent implements OnChanges {
  @Input()
  @HostBinding('style.width.px')
  @HostBinding('style.height.px')
  size: ImgIconSize = 32;

  @Input({ required: true })
  icon!: keyof typeof ImgIconsPaths;

  @HostBinding('style.background-image')
  imagePath!: string;

  ngOnChanges(): void {
    this.imagePath = `url("assets/${ImgIconsPaths[this.icon]}")`;
  }
}
