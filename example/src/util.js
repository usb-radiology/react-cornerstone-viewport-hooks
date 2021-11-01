import { useEffect } from "react";
import { ReactCornerstoneViewportHooksHelpers } from "react-cornerstone-viewport-hooks";

export const useDebugToolState = () => useEffect(() => {
  const id = setInterval(() => {
    const state = ReactCornerstoneViewportHooksHelpers.getToolState();
    // console.log(Object.keys(state))
    console.log(state, Object.values(state).map(e => Object.values(e).map(e => e.data)
      .filter(Boolean))[0]?.[0]);
  }, 3000);
  return () => clearInterval(id);
}, []);
