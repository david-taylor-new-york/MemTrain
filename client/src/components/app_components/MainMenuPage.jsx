import React from 'react';
import { MenuButton, PageHeader } from '../Components';
import { useMyAppUpdateContext } from '../../contexts/AppContextProvider'; // Import the app context hook
import { useMyTrainingUpdateContext } from '../../contexts/TrainingContextProvider'; // Import the training context hook

const MainMenuPageBody = () => {
  const myAppUpdateContext = useMyAppUpdateContext();
  const myTrainingUpdateContext = useMyTrainingUpdateContext();

  return ( // MainMenuPageBody
    <div className="container">
      <MenuButton onClick={() => myAppUpdateContext.updateCurrentPageTo("SubjectPage")}>Change Subject</MenuButton>
      <MenuButton onClick={() => myAppUpdateContext.updateCurrentPageTo("CardMenuPage")}>Update Cards</MenuButton>
      <MenuButton onClick={() => myTrainingUpdateContext.loadTrainingMenuPage()}>Training</MenuButton>
    </div>
  );
};

export const MainMenuPage = () => {
    return (
        <div>
            < PageHeader pageTitle="Main Menu"/>
            < MainMenuPageBody />
        </div>
    );
};
