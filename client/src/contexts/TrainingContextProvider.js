import React, { useContext, useState, useRef } from 'react'
import { useMyAppContext, useMyAppUpdateContext } from './AppContextProvider'
import { calculateNextCardSchedule, showToast } from '../utils/utils'
import { createTrainingSession, updateTrainingSession, getTrainingSession, getTrainingSessions,
    createCardResults, getCardResultsBy, createCardSchedule, getCardSchedules, 
    updateCardSchedule } from '../utils/httpClient'

const MyTrainingContext = React.createContext()
const MyTrainingUpdateContext = React.createContext()

export function useMyTrainingContext() {
    return useContext(MyTrainingContext)
}

export function useMyTrainingUpdateContext() {
    return useContext(MyTrainingUpdateContext)
}

export function TrainingContextProvider({ children }) {
    const myAppContext = useMyAppContext()
    const myAppUpdateContext = useMyAppUpdateContext()

    const [cardsToReview, setCardsToReview] = useState([])
    const [allTrainingSessions, setAllTrainingSessions] = useState([])
    const [currentTrainingSession, setCurrentTrainingSession] = useState(null)
    const [cumulativeTrainingSessionTimeInSeconds, setCumulativeTrainingSessionTimeInSeconds] = useState(0)
    const [currentCardResults, setCurrentCardResults] = useState([])
    const [currentCardSchedules, setCurrentCardSchedules] = useState([])
    const [currentTrainingState, setCurrentTrainingState] = useState("NotStarted")
    const [currentCardIndex, setCurrentCardIndex] = useState(-1)
    const [startTime, setStartTime] = useState(null)
    const [numberCorrect, setNumberCorrect] = useState(0)
    const [numberIncorrect, setNumberIncorrect] = useState(0)
    const [numberRemaining, setNumberRemaining] = useState(0)
    const [progressValue, setProgressValue] = useState(0)

    const loadTrainingMenuPage = async () => {
        const trainingSessions = await getTrainingSessions(myAppContext.subjectId)
        setAllTrainingSessions(trainingSessions)
        myAppUpdateContext.updateCurrentPageTo("TrainingMenuPage")
    }

    const loadTrainingSetupPage = async () => {
        const currentCardSchedules = await getCardSchedules(myAppContext.subjectId)
        setCurrentCardSchedules(currentCardSchedules)
        myAppUpdateContext.updateCurrentPageTo("TrainingSetupPage")
    }

    const startTraining = async () => {
        setCurrentTrainingState("Training")
        const numberOfCardsToReview = trainingSettingsFormRef.current.numberOfCardsToReview.value

        if (numberOfCardsToReview === "") {
            showToast("Enter number of Cards to review")
            trainingSettingsFormRef.current.reset()
            trainingSettingsFormRef.current.numberOfCardsToReview.focus()
            return
        }

        const cardsToReview = await getCardsToReview(numberOfCardsToReview)
        setCardsToReview(cardsToReview)

        const newTrainingSession = {
            user_id: myAppContext.userId,
            subject_id: myAppContext.subjectId,
            num_correct: 0,
            num_incorrect: 0,
            session_start_time: new Date(),
            training_time_in_seconds: null
        }
        const newTrainingSessionId = await createTrainingSession(newTrainingSession)
        newTrainingSession.id = newTrainingSessionId.id
        setCurrentTrainingSession(newTrainingSession)

        setProgressValue(0)
        setCurrentCardResults([])
        setCurrentCardIndex(0)
        setNumberCorrect(0)
        setNumberIncorrect(0)
        setCumulativeTrainingSessionTimeInSeconds(0)
        setStartTime(new Date())
        setNumberRemaining(cardsToReview.length)
        myAppUpdateContext.updateCurrentPageTo("TrainingPage")
    }

    const getCardsToReview = async (numberOfCardsToReview) => {
        const cardsToReview = []
        const localAllCards = [...myAppContext.allCards]
        const localCardSchedules = [...currentCardSchedules]

        let cardScheduleIndex = 0
        while (cardsToReview.length < numberOfCardsToReview && cardScheduleIndex < localCardSchedules.length) {
            const currentCardSchedule = localCardSchedules[cardScheduleIndex]
            const cardIndex = localAllCards.findIndex(card => card.id === currentCardSchedule.card_id)
            cardsToReview.push(localAllCards[cardIndex])
            cardScheduleIndex++
        }

        let allCardsIndex = 0
        while (cardsToReview.length < numberOfCardsToReview && allCardsIndex < localAllCards.length) {
            const cardSchedule = {
                subject_id: localAllCards[allCardsIndex].subject_id,
                card_id: localAllCards[allCardsIndex].id,
                buoyancy: 0.0,
                next_review_date: new Date(),
                first_reviewed: new Date()
            }
            
            const cardScheduleId = await createCardSchedule(cardSchedule)
            cardSchedule.id = cardScheduleId.id
            localCardSchedules.push(cardSchedule)
            cardsToReview.push(localAllCards[allCardsIndex])
            allCardsIndex++
        }
        setCurrentCardSchedules(localCardSchedules)
        cardsToReview.sort((a, b) => a.id - b.id)

        if (cardsToReview.length < numberOfCardsToReview) {
            showToast("Not enough cards to review")
        }
        return cardsToReview
    }

    const validateGivenAnswer = (givenAnswer) => {
        if (givenAnswer === "") {
            submitAnswerFormRef.current.reset();
            return false;
        }
        return true;
    }
    
    const updateScores = (isCorrect) => {
        if (isCorrect) {
            setNumberCorrect(numberCorrect + 1);
        } else {
            setNumberIncorrect(numberIncorrect + 1);
        }
        setNumberRemaining(numberRemaining - 1);
    }
    
    const handleNextOrFinish = () => {
        if (currentCardIndex < cardsToReview.length - 1) {
            getNextCard();
        } else {
            setCurrentTrainingState("FinishedTraining");
            setProgressValue(1);
        }
    }
    
    const train = () => {
        const currentCard = cardsToReview[currentCardIndex];
        const givenAnswer = submitAnswerFormRef.current.answer.value;
    
        // Validate answer
        if (!validateGivenAnswer(givenAnswer)) {
            return;
        }
    
        // Calculate time taken for this card
        const secondsToAnswerThisCard = Math.round((new Date() - startTime) / 10) / 100;
        setCumulativeTrainingSessionTimeInSeconds(cumulativeTrainingSessionTimeInSeconds + secondsToAnswerThisCard);
    
        // Check answer correctness
        let isCorrect = compareAnswers(currentCard.answer, givenAnswer);
        // let isCorrect = (currentCard.answer === givenAnswer);
        updateScores(isCorrect);
    
        // Create and update card results
        const cardResult = createCardResult(currentCard, givenAnswer, currentCard.answer, isCorrect, secondsToAnswerThisCard);
        updateCardResults(cardResult);
    
        // Reset form and move to next card or finish training
        submitAnswerFormRef.current.reset();
        handleNextOrFinish();
    }

    const normalizeText = (text) => {
        return text.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[^\w\s]/gi, '');
      }
      
    const compareAnswers = (expectedAnswer, givenAnswer) => {
    const expectedWords = normalizeText(expectedAnswer).split(' ').sort();
    const givenWords = normalizeText(givenAnswer).split(' ').sort();
    
    if (expectedWords.length !== givenWords.length) {
        return false;
    }
    
    for (let i = 0; i < expectedWords.length; i++) {
        if (expectedWords[i] !== givenWords[i]) {
        return false;
        }
    }
    
    return true;
    }
      
    const createCardResult = (card, givenAnswer, answer, isCorrect, secondsToAnswerThisCard) => {
        return {
            training_session_id: currentTrainingSession.id,
            subject_id: card.subject_id,
            card_id: card.id,
            guess: givenAnswer,
            answer: answer,
            is_correct: isCorrect,
            seconds_to_answer: secondsToAnswerThisCard
        }
    }

    const updateCardResults = (cardResult) => {
        const updatedCardResults = [...currentCardResults]
        updatedCardResults.push(cardResult)
        setCurrentCardResults(updatedCardResults)
    }

    const getNextCard = () => {
        const nextCardIndex = currentCardIndex + 1
        setCurrentCardIndex(nextCardIndex)
        const currentProgress = nextCardIndex / cardsToReview.length
        setProgressValue(currentProgress)
        setStartTime(new Date())
    }

    const finishTraining = () => {
        setProgressValue(0)
        setCurrentTrainingState("FinishedTraining")
        const cumul = (Math.round((cumulativeTrainingSessionTimeInSeconds) * 10) / 10)
        const updatedTrainingSession = {
            id: currentTrainingSession.id,
            num_correct: numberCorrect,
            num_incorrect: numberIncorrect,
            training_time_in_seconds: cumul
        }
        updateTrainingSession(updatedTrainingSession)
        createCardResults(currentCardResults)
        const cardSchedules = calculateNextCardSchedules(currentCardResults)
        updateCardSchedules(cardSchedules)
        loadTrainingMenuPage()
    }

    const updateCardSchedules = async (cardSchedules) => {
        for (let cardSchedule of cardSchedules) {
            const cardScheduleUpdate = {
                id: cardSchedule.id,
                buoyancy: cardSchedule.buoyancy,
                next_review_date: cardSchedule.next_review_date,
            }
            await updateCardSchedule(cardScheduleUpdate)
        }
    }

    const calculateNextCardSchedules = (currentCardResults) => {
        let modifiedCardSchedules = []
        let cardSchedules = [...currentCardSchedules]

        for (let cardResult of currentCardResults) {
            const cardScheduleIndex = cardSchedules.findIndex(cardSched => cardSched.card_id === cardResult.card_id)
            if (cardScheduleIndex !== -1) {
                const nextCardSchedule = calculateNextCardSchedule(cardSchedules[cardScheduleIndex], cardResult)
                cardSchedules[cardScheduleIndex] = nextCardSchedule
                modifiedCardSchedules.push(nextCardSchedule)

            } else {
                throw new Error ('Element not found in the array.')
            }
        }
        setCurrentCardSchedules(cardSchedules)
        return modifiedCardSchedules
    }

    const loadTrainingSessionsPage = async () => {
        const trainingSessions = await getTrainingSessions(myAppContext.subjectId)
        setAllTrainingSessions(trainingSessions)
        myAppUpdateContext.updateCurrentPageTo("TrainingSessionsPage")
    }

    const loadTrainingSessionPage = async () => {
        myAppUpdateContext.updateCurrentPageTo("TrainingSessionPage")
        const trainingSessionId = trainingSessionsFormRef.current.sessionId.value
        if (trainingSessionId === "") {
            showToast("Enter TrainingSession Id!")
            return
        }
        myAppUpdateContext.updateIsLoading(true)

        const trainingSessionArray = await getTrainingSession(trainingSessionId)
        let trainingSession = trainingSessionArray[0]
        trainingSession.session_start_time = new Date(trainingSession.session_start_time)

        setCurrentTrainingSession(trainingSession)
        setNumberCorrect(trainingSession.num_correct)
        setNumberCorrect(trainingSession.num_incorrect)

        const cardResultsByTrainingSessionId = await getCardResultsBy('training_session_id', trainingSessionId)

        setCurrentCardResults(cardResultsByTrainingSessionId)
        myAppUpdateContext.updateIsLoading(false)
    }

    const loadTrainingCardResultsPage = async () => {
        myAppUpdateContext.updateCurrentPageTo("TrainingCardResultsPage")
        const cardId = trainingSessionFormRef.current.cardId.value
        if (cardId === "") {
            showToast("Enter Card Id!")
            return
        }
        myAppUpdateContext.updateIsLoading(true)

        const cardResultsByCardId = await getCardResultsBy('card_id', cardId)

        setCurrentCardResults(cardResultsByCardId)
        const correct = countCorrect(cardResultsByCardId)
        const incorrect = cardResultsByCardId.length - correct
        setNumberCorrect(correct)
        setNumberIncorrect(incorrect)
        myAppUpdateContext.updateIsLoading(false)
    }

    const countCorrect = (cardResults) => {
        return cardResults.reduce((count, cardResult) => {
            return cardResult.is_correct ? count + 1 : count
        }, 0)
    }

    const submitAnswerFormRef = useRef()
    const trainingSessionFormRef = useRef()
    const trainingSessionsFormRef = useRef()
    const trainingSettingsFormRef = useRef()

    const allContexts = {
        allTrainingSessions,
        currentCardResults,
        cardsToReview,
        currentTrainingState,
        currentCardIndex,
        numberCorrect,
        numberIncorrect,
        numberRemaining,
        cumulativeTrainingSessionTimeInSeconds,
        progressValue,
        submitAnswerFormRef,
        currentTrainingSession,
        trainingSessionFormRef,
        trainingSessionsFormRef,
        trainingSettingsFormRef
    }

    const allContextUpdates = {
        startTraining,
        loadTrainingSetupPage,
        train,
        finishTraining,
        loadTrainingMenuPage,
        loadTrainingSessionPage,
        loadTrainingSessionsPage,
        loadTrainingCardResultsPage
    }

    return (
        < MyTrainingContext.Provider value={allContexts} >
            < MyTrainingUpdateContext.Provider value={allContextUpdates} >
                {children}
            </ MyTrainingUpdateContext.Provider >
        </ MyTrainingContext.Provider >
    )
}