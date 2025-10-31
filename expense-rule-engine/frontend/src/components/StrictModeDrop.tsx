import { useEffect, useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import type { DroppableProps, DroppableProvided } from 'react-beautiful-dnd';

export const StrictModeDrop = ({ children, ...props }: DroppableProps) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // This is a workaround for React 18 Strict Mode
    const timer = setTimeout(() => {
      setEnabled(true);
    }, 0);

    return () => {
      clearTimeout(timer);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return (
    <Droppable {...props}>
      {(provided: DroppableProvided, snapshot) => 
        children(provided, snapshot)
      }
    </Droppable>
  );
};
