import { useEffect, useState } from "react";

function checkStandalone() {
  if (typeof window === "undefined") return false;

  const isStandaloneMedia =
    window.matchMedia && window.matchMedia("(display-mode: standalone)").matches;

  const isIOSStandalone = (window.navigator as any).standalone === true;

  return isStandaloneMedia || isIOSStandalone;
}

export function useIsStandalone() {
  const [standalone, setStandalone] = useState(false);

  useEffect(() => {
    setStandalone(checkStandalone());
  }, []);

  return standalone;
}
