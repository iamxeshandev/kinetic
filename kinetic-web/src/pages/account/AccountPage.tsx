import { CONFIG } from '../../config';

export function AccountPage() {
  return (
    <>
      <title>{`Account | ${CONFIG.APP_NAME}`}</title>
    </>
  );
}

export { AccountPage as Component };
