import { config } from '../config';
import { CalendarView } from '../features/calendar';

export function Component() {
  return (
    <>
      <title>{`Calendar | ${config.appName}`}</title>
      <CalendarView />
    </>
  );
}
