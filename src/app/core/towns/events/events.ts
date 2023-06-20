import { createEventType } from "src/app/store";


const townEvents = createEventType;

// possibly temporary, I don't know yet if I want to have local events for buildings and towns.

export const NewDayBegins = townEvents();

export const NewWeekStarts = townEvents();
