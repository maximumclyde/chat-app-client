import { useEffect, useState, useCallback } from "react";

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(
    window.matchMedia(query).matches
  );

  const changeListener = useCallback(
    (event: MediaQueryListEvent) => {
      if (event.matches !== matches) {
        setMatches(event.matches);
      }
    },
    [matches]
  );

  useEffect(() => {
    const matchMedia = window.matchMedia(query);

    matchMedia.removeEventListener("change", changeListener);
    matchMedia.addEventListener("change", changeListener);

    return () => {
      matchMedia.removeEventListener("change", changeListener);
    };
  }, [changeListener, query]);

  return matches;
}

export default useMediaQuery;
