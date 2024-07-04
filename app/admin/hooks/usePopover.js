import { useState, useCallback } from 'react';

const usePopover = () => {
  const [popoverVisibility, setPopoverVisibility] = useState({});

  const handleTogglePopover = useCallback((popoverKey) => {
    setPopoverVisibility((prevVisibility) => ({
      ...prevVisibility,
      [popoverKey]: !prevVisibility[popoverKey],
    }));
  }, []);

  const isPopoverActive = (popoverKey) =>
    popoverVisibility[popoverKey] || false;

  return { handleTogglePopover, isPopoverActive };
};

export default usePopover;
