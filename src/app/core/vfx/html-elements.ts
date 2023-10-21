import { ActionCard } from '../action-cards';

export const getHtmlRaIcon = ({
  icon,
  iconColor = 'white',
  bgColor = 'transparent'
}: { icon: string, iconColor?: string, bgColor?: string }) => `<i class='ra ra-${icon}' style="background: ${bgColor}; color: ${iconColor}"></i>`;

export const actionCardIcon = ({ icon, iconColor, bgColor }: ActionCard) => `<i class='ra ra-${icon}' style="background: ${bgColor}; color: ${iconColor}"></i>`;

export const actionCardEvent = (card: ActionCard) => `${actionCardIcon(card)} <span style="font-weight: 600;">${card.title}</span>`;
