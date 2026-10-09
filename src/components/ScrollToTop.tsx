import { useEffect } from "react";
import { useLocation } from "react-router";

export default function ScrollToTop(): null {
  const { pathname } = useLocation();

  useEffect(() => {
    // Forces the viewport to the top left corner whenever the path mutates
    window.scrollTo(0, 0);
  }, [pathname]);

  // This component renders nothing to the DOM; it strictly manages browser side-effects
  return null;
}
