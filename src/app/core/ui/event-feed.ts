import { DescriptionElementType, DescriptionVariants } from './descriptions';

export interface EventFeedMessage {
  message: DescriptionVariants['variants'][];
  delay?: number;
}

export const createEventFeedMsg = (html: string, delay: number = 5000): EventFeedMessage => ({
  message: [{ htmlContent: html, type: DescriptionElementType.FreeHtml }],
  delay,
});
