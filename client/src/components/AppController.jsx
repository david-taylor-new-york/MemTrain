import { React } from 'react'
import { LoginPage } from './app_components/LoginPage'
import { SubjectPage } from './app_components/SubjectPage'
import { MainMenuPage } from './app_components/MainMenuPage'
import { CardMenuPage } from './app_components/CardMenuPage'
import { CreateCardsPage } from './app_components/CreateCardsPage'
import { EditCardsPage } from './app_components/EditCardsPage'
import { DeleteCardsPage } from './app_components/DeleteCardsPage'
import { TrainingSetupPage } from './training_components/TrainingSetupPage'
import { TrainingPage } from './training_components/TrainingPage'
import { TrainingCardResultsPage } from './training_components/TrainingCardResultsPage'
import { TrainingMenuPage } from './training_components/TrainingMenuPage'
import { TrainingSessionPage } from './training_components/TrainingSessionPage'
import { TrainingSessionsPage } from './training_components/TrainingSessionsPage'
import { TrainingSummaryPage } from './training_components/TrainingSummaryPage'
import { useMyAppContext } from '../contexts/AppContextProvider'

export const AppController = () => {

  const myAppContext = useMyAppContext()

  if (!myAppContext.isLoggedIn && !myAppContext.isLoading) {
    return (< LoginPage />)
  }

  switch (myAppContext.currentPage) {

    case "Card Menu":
      return (< CardMenuPage />)

    case "Create Cards":
      return (< CreateCardsPage />)

    case "Delete Cards":
      return (< DeleteCardsPage />)

    case "Edit Cards":
      return (< EditCardsPage />)

    case "Main Menu":
      return (< MainMenuPage />)

    case "Login":
      return (< LoginPage />)

    case "Subject":
      return (< SubjectPage />)

    case "Training Menu":
      return (< TrainingMenuPage />)

    case "Training":
      return (< TrainingPage />)

    case "Training Card Results":
      return (< TrainingCardResultsPage />)

    case "Training Session":
      return (< TrainingSessionPage />)

    case "Training Sessions":
      return (< TrainingSessionsPage />)

    case "Training Setup":
      return (< TrainingSetupPage />)

    case "Training Summary":
      return (< TrainingSummaryPage />)

    default:
      throw new Error("PAGE NOT RECOGNIZED: " + myAppContext.currentPage)
  }
}
