import {
  Dispatch,
  SetStateAction,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";

export function useSafeState<S>(
  initialState: S | (() => S),
): [S, Dispatch<SetStateAction<S>>];

export function useSafeState<S = undefined>(): [
  S | undefined,
  Dispatch<SetStateAction<S | undefined>>,
];

export function useSafeState<S>(initialState?: S | (() => S)) {
  const [state, setState] = useState(initialState);
  const isMounted = useRef<boolean>();
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  const safeSetState = useCallback(
    (s) => {
      if (isMounted.current) {
        setState(s);
      }
    },
    [setState],
  );
  return [state, safeSetState] as const;
}
