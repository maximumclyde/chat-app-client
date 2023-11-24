import { useEffect, useState } from "react";

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(
    window.matchMedia(query).matches
  );

  useEffect(() => {
    const matchMedia = window.matchMedia(query);

    function changeListener(event: MediaQueryListEvent) {
      if (event.matches !== matches) {
        setMatches(event.matches);
      }
    }

    matchMedia.addEventListener("change", changeListener);

    return () => {
      matchMedia.removeEventListener("change", changeListener);
    };
  }, [matches, query]);

  return matches;
}

export default useMediaQuery;
