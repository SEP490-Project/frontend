import { useEffect } from "react";

interface UseNavigationBlockerProps {
  when: boolean;
  onNavigationAttempt?: () => void;
}

/**
 * Custom hook to block navigation when there are unsaved changes
 * @param when - Condition to determine if navigation should be blocked
 * @param onNavigationAttempt - Callback when user tries to navigate away
 */
export function useNavigationBlocker({ when, onNavigationAttempt }: UseNavigationBlockerProps) {
  // Handle browser navigation (refresh, close tab, etc.)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (when) {
        e.preventDefault();
        e.returnValue = ""; // Required for Chrome
        return ""; // For older browsers
      }
    };

    if (when) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [when]);

  // Handle in-app navigation (clicking links)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!when) return;

      // Check if the click target is a link or inside a link
      const target = e.target as HTMLElement;
      const link = target.closest("a");

      if (link && link.href) {
        const currentOrigin = window.location.origin;
        const linkOrigin = new URL(link.href).origin;

        // Only intercept internal navigation
        if (linkOrigin === currentOrigin) {
          const linkPath = new URL(link.href).pathname;
          const currentPath = window.location.pathname;

          // If navigating to a different page
          if (linkPath !== currentPath) {
            e.preventDefault();
            e.stopPropagation();

            if (onNavigationAttempt) {
              onNavigationAttempt();
            }
          }
        }
      }
    };

    if (when) {
      document.addEventListener("click", handleClick, true); // Use capture phase
    }

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [when, onNavigationAttempt]);

  // Return the blocking state
  return {
    isBlocking: when,
  };
}
