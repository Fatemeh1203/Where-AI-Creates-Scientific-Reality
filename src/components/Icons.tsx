import type { SVGProps } from "react";

export type IconName = "brain" | "fiber" | "atom" | "automation" | "web" | "chart";

function Base(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    />
  );
}

export function BrainIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M9.5 4.5a2.5 2.5 0 0 0-2.5 2.5 2.5 2.5 0 0 0-2 2.45V10a2.5 2.5 0 0 0 0 4.9v.6a2.5 2.5 0 0 0 2.2 2.48A2.5 2.5 0 0 0 9.5 20.5" />
      <path d="M14.5 4.5a2.5 2.5 0 0 1 2.5 2.5 2.5 2.5 0 0 1 2 2.45V10a2.5 2.5 0 0 1 0 4.9v.6a2.5 2.5 0 0 1-2.2 2.48 2.5 2.5 0 0 1-2.3 2.02" />
      <path d="M9.5 4.5V20.5M14.5 4.5V20.5" />
      <path d="M7 8.5h2.5M14.5 8.5H17M7 15.4h2.5M14.5 15.4H17" />
    </Base>
  );
}

export function FiberIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M3 12c3-4 6 4 9 0s6-4 9 0" />
      <circle cx="3" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="21" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <path d="M6 6.5 3 12l3 5.5M18 6.5 21 12l-3 5.5" opacity="0.5" />
    </Base>
  );
}

export function AtomIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(120 12 12)" />
    </Base>
  );
}

export function AutomationIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M12 3v2.2M12 18.8V21M4.9 4.9l1.55 1.55M17.55 17.55l1.55 1.55M3 12h2.2M18.8 12H21M4.9 19.1l1.55-1.55M17.55 6.45l1.55-1.55" />
      <circle cx="12" cy="12" r="4.2" />
    </Base>
  );
}

export function WebIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <rect x="3" y="4.5" width="18" height="14" rx="2" />
      <path d="M3 8.5h18" />
      <circle cx="6" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="8.2" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
    </Base>
  );
}

export function ChartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </Base>
  );
}

export const ICONS: Record<IconName, (props: SVGProps<SVGSVGElement>) => JSX.Element> = {
  brain: BrainIcon,
  fiber: FiberIcon,
  atom: AtomIcon,
  automation: AutomationIcon,
  web: WebIcon,
  chart: ChartIcon,
};

export function Icon({ name, ...props }: { name: IconName } & SVGProps<SVGSVGElement>) {
  const Component = ICONS[name];
  return <Component {...props} />;
}
