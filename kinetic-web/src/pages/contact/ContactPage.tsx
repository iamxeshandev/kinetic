import { CONFIG } from '../../config';
import { ContactView } from '../../features/contact/ui';

export function ContactPage() {
  return (
    <>
      <title>{`Contact | ${CONFIG.APP_NAME}`}</title>
      <ContactView />
    </>
  );
}

export { ContactPage as Component };
