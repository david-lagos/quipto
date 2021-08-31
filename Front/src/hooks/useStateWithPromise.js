import {useEffect, useCallback, useRef, useState } from "react";
const useStateWithPromise = (initialStake) => {
    const [selection, setSelection] = useState(initialStake);
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