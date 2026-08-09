import { config } from '../config';
import { ContactView } from '../features/contact';

export function Component() {
  return (
    <>
      <title>{`Contact | ${config.appName}`}</title>
      <ContactView />
    </>
  );
}
