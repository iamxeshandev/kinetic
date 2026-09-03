import { CONFIG } from '../../config';
import { ContactView } from '../../features/landing/ui';

export function ContactPage() {
  return (
    <>
      <title>{`Contact | ${CONFIG.APP_NAME}`}</title>
      <ContactView />
    </>
  );
}

export { ContactPage as Component };
