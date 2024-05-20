import React, { useContext, useState, useRef } from 'react'
import { useMyAppContext, useMyAppUpdateContext } from './AppContextProvider'
import { showToast, wrongAnswerToast } from '../utils/utils'
import {
    createTrainingSession, getTrainingSession, getTrainingSessions,
    updateTrainingSession, createCardResults, getCardResultsBy
} from '../utils/httpClient'

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

    const [trainingCards, setTrainingCards] = useState([])
    const [failedCards, setFailedCards] = useState([])
    const [allTrainingSessions, setAllTrainingSessions] = useState([])
    const [currentTrainingSession, setCurrentTrainingSession] = useState(null)
    const [trainingType, setTrainingType] = useState("practice")
    const [trainingRounds, setTrainingRounds] = useState(0)
    const [cumulativeTrainingSessionTimeInSeconds, setCumulativeTrainingSessionTimeInSeconds] = useState(0)
    const [currentSessionResults, setCurrentSessionResults] = useState([])
    const [currentCardResults, setCurrentCardResults] = useState([])
    const [currentTrainingState, setCurrentTrainingState] = useState("NotStarted")
    const [currentCardIndex, setCurrentCardIndex] = useState(-1)
    const [startTime, setStartTime] = useState(null)
    const [numberCorrect, setNumberCorrect] = useState(0)
    const [numberIncorrect, setNumberIncorrect] = useState(0)
    const [numberRemaining, setNumberRemaining] = useState(0)
    const [progressValue, setProgressValue] = useState(0)

    const loadTrainingMenuPage = async () => {
        const trainingSessions = await getTrainingSessions(myAppContext.currentSubjectId)
        setAllTrainingSessions(trainingSessions)
        myAppUpdateContext.updateCurrentPageTo("Training Menu")
    }

    const loadTrainingSetupPage = () => {
        myAppUpdateContext.updateCurrentPageTo("Training Setup")
    }

    const startTraining = () => {
        setCurrentTrainingState("Training")
        console.log("setTrainingType: " + trainingType);
        const initialCards = getTrainingCards(trainingType)

        setTrainingCards(initialCards)
        setTrainingRounds(0)
        setProgressValue(0)
        setCurrentCardResults([])
        setFailedCards([])
        setCurrentCardIndex(0)
        setNumberCorrect(0)
        setNumberIncorrect(0)
        setCumulativeTrainingSessionTimeInSeconds(0)
        setStartTime(new Date())
        setNumberRemaining(initialCards.length)
        myAppUpdateContext.updateCurrentPageTo("Training")
    }

    const answerQuestion = () => {
        const currentCard = trainingCards[currentCardIndex]
        const givenAnswer = submitAnswerFormRef.current.answer.value

        if (givenAnswer === "") {
            submitAnswerFormRef.current.reset()
            return false
        }

        const secondsToAnswerThisCard = Math.round((new Date() - startTime) / 1000)
        setCumulativeTrainingSessionTimeInSeconds(cumulativeTrainingSessionTimeInSeconds + secondsToAnswerThisCard)

        let isCorrect = compareAnswers(currentCard.answer, givenAnswer)
        updateScores(isCorrect, currentCard)

        const cardResult = createCardResult(currentCard.id, currentCard.question, givenAnswer, currentCard.answer, isCorrect, secondsToAnswerThisCard)
        updateCardResults(cardResult)

        submitAnswerFormRef.current.reset()
        handleNextOrFinish()
    }


    const compareAnswers = (expectedAnswer, givenAnswer) => {
        const expectedWords = normalizeText(expectedAnswer).split(' ').sort()
        const givenWords = normalizeText(givenAnswer).split(' ').sort()

        if (expectedWords.length !== givenWords.length) {
            return false
        }
        console.log("Comparing answers:")
        for (let i = 0; i < expectedWords.length; i++) {
            const expectedWord = expectedWords[i]
            console.log("expectedWord[" + i + "] = " + expectedWord)
            console.log("givenWords = " + givenWords.toString())
            if (givenWords.includes(expectedWord)) {
                return true;
            } else {
                return false;
            }
        }
    }

    const updateFailedCards = (card) => {
        const updatedFailedCards = [...failedCards]
        updatedFailedCards.push(card)
        setFailedCards(updatedFailedCards)
    }

    const updateScores = (isCorrect, card) => {
        if (isCorrect) {
            setNumberCorrect(numberCorrect + 1)
        } else {
            wrongAnswerToast("NO:  " + card.answer)
            setNumberIncorrect(numberIncorrect + 1)
            updateFailedCards(card)
        }
        setNumberRemaining(numberRemaining - 1)
    }

    const handleNextOrFinish = () => {
        if (currentCardIndex < trainingCards.length - 1) {
            getNextCard()
        } else {
            setTrainingCards(failedCards)
            setTrainingRounds(trainingRounds + 1)
            setCurrentTrainingState("FinishedTrainingRound")
            setProgressValue(1)
        }
    }

    const finishTrainingRound = async () => {
        if ((trainingType === "recorded") && (trainingRounds === 1)) {
            const newTrainingSession = {
                subject_id: myAppContext.currentSubjectId,
                first_pass_correct: numberCorrect,
                first_pass_incorrect: numberIncorrect,
                rounds_to_finish: trainingRounds,
                session_start_time: startTime,
                training_time_in_seconds: cumulativeTrainingSessionTimeInSeconds
            }
            const trainingSessionId = await createTrainingSession(newTrainingSession)
            newTrainingSession.id = trainingSessionId.id
            setCurrentTrainingSession(newTrainingSession)
            let updatedTrainingSessions = [...allTrainingSessions]
            updatedTrainingSessions.push(newTrainingSession)
            setAllTrainingSessions(updatedTrainingSessions)

            const nextCardResults = addTrainingSessionIdToCardResults(trainingSessionId.id)
            const sortedCardResults = nextCardResults.sort((a, b) => { return a.card_id - b.card_id })
            setCurrentCardResults(sortedCardResults)
            createCardResults(sortedCardResults)
        }
        if (failedCards.length > 0) {
            setTrainingCards(failedCards)
            setProgressValue(0)
            setCurrentCardResults([])
            setFailedCards([])
            setCurrentCardIndex(0)
            setNumberCorrect(0)
            setNumberIncorrect(0)
            setCumulativeTrainingSessionTimeInSeconds(0)
            setStartTime(new Date())
            setNumberRemaining(failedCards.length)
            setCurrentTrainingState("Training")
        } else {
            setCurrentTrainingState("FinishedTraining")
        }
    }

    const finishTraining = async () => {
        if ((trainingType === "recorded")) {
            localUpdateTrainingSession()
            const trainingSessions = await getTrainingSessions(myAppContext.currentSubjectId)
            setAllTrainingSessions(trainingSessions)
        }
        loadTrainingMenuPage()
    }

    const cancelTraining = () => {
        setTrainingCards([])
        setProgressValue(0)
        setCurrentCardResults([])
        setFailedCards([])
        setCurrentCardIndex(0)
        setNumberCorrect(0)
        setNumberIncorrect(0)
        setCumulativeTrainingSessionTimeInSeconds(0)
        setStartTime(new Date())
        setNumberRemaining(failedCards.length)
        setCurrentTrainingState("NotStarted")
        myAppUpdateContext.updateCurrentPageTo("Training Menu")
    }

    const localUpdateTrainingSession = async () => {
        const updatedTrainingSession = {
            id: currentTrainingSession.id,
            subject_id: currentTrainingSession.subject_id,
            first_pass_correct: currentTrainingSession.first_pass_correct,
            first_pass_incorrect: currentTrainingSession.first_pass_incorrect,
            rounds_to_finish: trainingRounds,
            session_start_time: currentTrainingSession.session_start_time,
            training_time_in_seconds: currentTrainingSession.training_time_in_seconds
        }

        try {
            const response = await updateTrainingSession(updatedTrainingSession)
            if (response === 'success') {
                setCurrentTrainingSession(updatedTrainingSession)
            } else {
                throw new Error('Could not UPDATE TrainingSession!')
            }
        } catch {
            throw new Error('Could not UPDATE TrainingSession!')
        }
    }

    const getTrainingCards = (trainingType) => {
        let trainingCards = []
        const allCardsBySubject = [...myAppContext.allCardsBySubject]

        if (trainingType === "recorded") {
            trainingCards = allCardsBySubject
            //            for (let card of allCardsBySubject) {
            //                if (card.trend < 0) {
            //                    trainingCards.add(card)
            //                } else if (card.buoyancy > 0) {
            //                    }
            //                console.log(card.id)
            //            }
            return trainingCards
        } else {
            return allCardsBySubject
        }
    }

    const getNextCard = () => {
        const nextCardIndex = currentCardIndex + 1
        setCurrentCardIndex(nextCardIndex)
        const currentProgress = nextCardIndex / trainingCards.length
        setProgressValue(currentProgress)
        setStartTime(new Date())
    }

    // normalizeText() converts to lowercase, removes leading and trailing spaces, replaces multiple spaces with a single space,
    // and removes any characters that are not alphanumeric or spaces.
    const normalizeText = (text) => { return text.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[^\w\s]/gi, '') }

    const createCardResult = (cardId, question, givenAnswer, answer, isCorrect, secondsToAnswerThisCard) => {
        return {
            training_session_id: null,
            card_id: cardId,
            question: question,
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

    const addTrainingSessionIdToCardResults = (trainingSessionId) => {

        let cardResultsWithId = []

        for (let cardResult of currentCardResults) {
            cardResult.training_session_id = trainingSessionId
            cardResultsWithId.push(cardResult)
        }
        return cardResultsWithId
    }

    const loadTrainingSessionPage = async () => {
        const trainingSessionId = trainingSessionsFormRef.current.id_input_field.value
        const trainingSessionArray = await getTrainingSession(trainingSessionId)

        if (trainingSessionArray.length === 0) {
            showToast("Training session " + trainingSessionId + " not found!")
            trainingSessionsFormRef.current.reset()
            trainingSessionsFormRef.current.id_input_field.focus()
            return
        }

        setCurrentTrainingSession(trainingSessionArray[0])
        myAppUpdateContext.updateCurrentPageTo("Training Session")

        const sessionResultsByTrainingSessionId = await getCardResultsBy('training_session_id', trainingSessionId)
        setCurrentSessionResults(sessionResultsByTrainingSessionId)
    }

    const loadTrainingCardResultsPage = async () => {
        const cardId = trainingSessionFormRef.current.id_input_field.value
        myAppUpdateContext.updateIsLoading(true)
        const cardResultsByCardId = await getCardResultsBy('card_id', cardId)

        if (cardResultsByCardId.length === 0) {
            showToast("Results not found for card: " + cardId)
            trainingSessionFormRef.current.reset()
            trainingSessionFormRef.current.id_input_field.focus()
            return
        }

        myAppUpdateContext.updateCurrentPageTo("Training Card Results")
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
        currentSessionResults,
        currentCardResults,
        trainingCards,
        trainingRounds,
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
        setTrainingType,
        loadTrainingSetupPage,
        answerQuestion,
        finishTrainingRound,
        finishTraining,
        cancelTraining,
        loadTrainingMenuPage,
        loadTrainingSessionPage,
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