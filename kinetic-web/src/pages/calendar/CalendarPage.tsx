import { CONFIG } from '../../config';
import { CalendarView } from '../../features/calendar/components';

export function CalendarPage() {
  return (
    <>
      <title>{`Calendar | ${CONFIG.APP_NAME}`}</title>
      <CalendarView />
    </>
  );
}

export { CalendarPage as Component };
