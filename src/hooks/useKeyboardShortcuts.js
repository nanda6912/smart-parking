import { useEffect, useCallback } from 'react';

const useKeyboardShortcuts = (shortcuts) => {
  const handleKeyDown = useCallback((event) => {
    const { key, ctrlKey, metaKey, shiftKey, altKey } = event;
    
    // Create a normalized key combination string
    const modifiers = [];
    if (ctrlKey || metaKey) modifiers.push('ctrl');
    if (shiftKey) modifiers.push('shift');
    if (altKey) modifiers.push('alt');
    
    const keyCombo = [...modifiers, key.toLowerCase()].join('+');
    
    // Check if this key combination matches any registered shortcuts
    const shortcut = shortcuts[keyCombo];
    if (shortcut) {
      event.preventDefault();
      event.stopPropagation();
      shortcut.callback();
    }
  }, [shortcuts]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
};

export default useKeyboardShortcuts;
