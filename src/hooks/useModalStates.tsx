import { useState } from "react";

type ModalStates = {
  [key: string]: boolean;
};

type UseModalStatesReturn = [
  ModalStates,
  (key: string, isOpen: boolean) => void
];

export const useModalStates = (
  initialObject: ModalStates
): UseModalStatesReturn => {
  const [initialState, setInitialState] = useState<ModalStates>(initialObject);

  const handleState = (key: string, isOpen: boolean) => {
    setInitialState((prevState) => ({
      ...prevState,
      [key]: isOpen,
    }));
  };
  return [initialState, handleState];
};
