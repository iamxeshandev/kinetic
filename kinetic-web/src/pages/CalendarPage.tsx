import { config } from '../config';
import { CalendarView } from '../features/calendar/components';

export function Component() {
  return (
    <>
      <title>{`Calendar | ${config.appName}`}</title>
      <CalendarView />
    </>
  );
}
