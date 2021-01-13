import constate from "constate";
import { useEffect, useState } from "react";

export type Bch = { defaultAccount: string } & Record<any, any>;

export const [UseBadgerProvider, useBadger] = constate(() => {
  const [bch, setBch] = useState<Bch | null>(null);

  useEffect(() => {
    return onBadgerAvailabilityChange((available) => {
      setBch(available ? (window as any).web4bch?.bch ?? null : null);
    });
  }, [setBch]);

  return bch;
});

export function onBadgerAvailabilityChange(
  callback: (available: boolean) => void
) {
  let t: any;
  let currentStatus = false;
  const check = (attempt = 0) => {
    const initial = attempt < 5;
    const available = isBadgerAvailable();
    if (currentStatus !== available) {
      callback(available);
      currentStatus = available;
    }
    t = setTimeout(
      check,
      available ? 10_000 : !initial ? 5_000 : 0,
      initial ? attempt + 1 : attempt
    );
  };
  check();
  return () => clearTimeout(t);
}

export function isBadgerAvailable() {
  return "web4bch" in window;
}
