import {useEffect, useCallback, useRef, useState } from "react";
const useStateWithPromise = (initialState) => {
    const [selection, setSelection] = useState(initialState);
    const resolverRef = useRef(null);

    useEffect(() => {
      if (resolverRef.current) {
        resolverRef.current(selection);
        resolverRef.current = null;
      }
    }, [resolverRef, selection]);

    const handleSetState = useCallback(
      (stateAction) => {
        setSelection(stateAction);
        return new Promise((resolve) => {
          resolverRef.current = resolve;
        });
      }, [setSelection])

    return [selection, handleSetState];

  };

  export default useStateWithPromise