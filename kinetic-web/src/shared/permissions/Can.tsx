// * This component is used to conditionally render children based on the user's role

export type CanProps = {
  allowed: boolean;
  children: React.ReactNode;
};

export function Can({ allowed, children }: CanProps) {
  return allowed ? children : null;
}
