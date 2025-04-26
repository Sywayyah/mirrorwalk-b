import { DescriptionElement, DescriptionElementType } from './descriptions';

export interface EventFeedMessage {
  message: DescriptionElement[];
  delay?: number;
}

export const createEventFeedMsg = (html: string, delay: number = 5000): EventFeedMessage => ({
  message: [{ htmlContent: html, type: DescriptionElementType.FreeHtml }],
  delay,
});
