import React, { useContext, useState, useRef } from 'react'
import { useMyAppContext, useMyAppUpdateContext } from './AppContextProvider'
import { showToast } from '../utils/utils'
import { createTrainingSession, getTrainingSession, getTrainingSessions,
    createCardResults, getCardResultsBy } from '../utils/httpClient'

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
    const [cumulativeTrainingSessionTimeInSeconds, setCumulativeTrainingSessionTimeInSeconds] = useState(0)
    const [currentCardResults, setCurrentCardResults] = useState([])
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
        myAppUpdateContext.updateCurrentPageTo("TrainingSetupPage")
    }

    const startTraining = async () => {
        setCurrentTrainingState("Training")
        setTrainingType(trainingSettingsFormRef.current.trainingType.value)
        console.log("trainingType = " + trainingType)
        const initialCards = getInitialTrainingCards(trainingType)
        setTrainingCards(initialCards)

        setProgressValue(0)
        setCurrentCardResults([])
        setFailedCards([])
        setCurrentCardIndex(0)
        setNumberCorrect(0)
        setNumberIncorrect(0)
        setCumulativeTrainingSessionTimeInSeconds(0)
        setStartTime(new Date())
        setNumberRemaining(trainingCards.length)
        myAppUpdateContext.updateCurrentPageTo("TrainingPage")
    }

    const answerQuestion = () => {
        const currentCard = trainingCards[currentCardIndex]
        const givenAnswer = submitAnswerFormRef.current.answer.value

        if (givenAnswer === "") {
            submitAnswerFormRef.current.reset()
            return false
        }

        const secondsToAnswerThisCard = Math.round((new Date() - startTime) / 10) / 100
        setCumulativeTrainingSessionTimeInSeconds(cumulativeTrainingSessionTimeInSeconds + secondsToAnswerThisCard)

        let isCorrect = compareAnswers(currentCard.answer, givenAnswer)
        updateScores(isCorrect) // (correct/incorrect totals)

        const cardResult = createCardResult(currentCard, givenAnswer, currentCard.answer, isCorrect, secondsToAnswerThisCard)
        updateCardResults(cardResult)

        if (!isCorrect) {
            console.log("INCORRECT ANSWER!")
            updateFailedCards(currentCard)
        }

        submitAnswerFormRef.current.reset()
        handleNextOrFinish()
    }

    const handleNextOrFinish = () => {
        if (currentCardIndex < trainingCards.length - 1) {
            getNextCard()
        } else {
            setTrainingCards(failedCards)
            setCurrentTrainingState("FinishedTrainingRound")
            setProgressValue(1)
        }
    }

    const finishTrainingRound = async () => {
        if (trainingType === "actual") {
            const cumul = (Math.round((cumulativeTrainingSessionTimeInSeconds) * 10) / 10)
            const newTrainingSession = {
                subject_id: myAppContext.subjectId,
                first_pass_correct: numberCorrect,
                first_pass_incorrect: numberIncorrect,
                session_start_time: startTime,
                training_time_in_seconds: cumul
            }
            const trainingSessionId = await createTrainingSession(newTrainingSession)
            newTrainingSession.id = trainingSessionId.id
            setCurrentTrainingSession(newTrainingSession) // DELETE?
            let updatedTrainingSessions = [...allTrainingSessions]
            updatedTrainingSessions.push(newTrainingSession)
            setCurrentCardResults(updatedTrainingSessions)

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
            setNumberRemaining(trainingCards.length)
            setCurrentTrainingState("Training")
        } else {
            setCurrentTrainingState("FinishedTraining")
        }
    }

    const finishTraining = async () => {
        console.log("finishTraining():")
        loadTrainingMenuPage()
    }

    const updateFailedCards = (card) => {
        const updatedFailedCards = [...failedCards]
        updatedFailedCards.push(card)
        setFailedCards(updatedFailedCards)
    }

    const getInitialTrainingCards = (trainingType) => {
        const trainingCards = []
        const allCardsBySubject = [...myAppContext.allCardsBySubject]

        if (trainingType === "actual") {
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

    const updateScores = (isCorrect) => {
        if (isCorrect) {
            setNumberCorrect(numberCorrect + 1)
        } else {
            setNumberIncorrect(numberIncorrect + 1)
        }
        setNumberRemaining(numberRemaining - 1)
    }

    const getNextCard = () => {
        const nextCardIndex = currentCardIndex + 1
        setCurrentCardIndex(nextCardIndex)
        const currentProgress = nextCardIndex / trainingCards.length
        setProgressValue(currentProgress)
        setStartTime(new Date())
    }

    const compareAnswers = (expectedAnswer, givenAnswer) => {
        let modifiedExpectedAnswer = expectedAnswer;

        if (givenAnswer.includes("*")) {
            modifiedExpectedAnswer = extractWordsWithAsterisks(expectedAnswer);
        }

        const expectedWords = normalizeText(modifiedExpectedAnswer).split(' ').sort()
        const givenWords = normalizeText(givenAnswer).split(' ').sort()

        if (expectedWords.length !== givenWords.length) {
            return false
        }

        for (let i = 0; i < expectedWords.length; i++) {
            if (expectedWords[i] !== givenWords[i]) {
                return false
            }
        }

        return true
    }

    const extractWordsWithAsterisks = (input) => {
        const words = input.split(" ")
        const wordsWithAsterisks = words.filter(word => word.includes("*"))
        const cleanedWords = wordsWithAsterisks.map(word => word.replace(/\*/g, ""))
        return cleanedWords.join(" ")
    }

    const normalizeText = (text) => {
        return text.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[^\w\s]/gi, '')
    }

    const createCardResult = (card, givenAnswer, answer, isCorrect, secondsToAnswerThisCard) => {
        return {
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

//    const getLastTrainingSession = (trainingSessions) => {
//        const mostRecentSession = trainingSessions.sort((a, b) => {
//            const dateA = new Date(a.session_start_time)
//            const dateB = new Date(b.session_start_time)
//            return dateB - dateA
//        })[0]
//        return new Date(mostRecentSession.session_start_time)
//    }

    const addTrainingSessionIdToCardResults = (trainingSessionId) => {

        let cardResultsWithId = []

        for (let cardResult of currentCardResults) {
            cardResult.training_session_id = trainingSessionId
            cardResultsWithId.push(cardResult)
        }
        return cardResultsWithId
    }

    const loadTrainingSessionsPage = async () => {
        const trainingSessions = await getTrainingSessions(myAppContext.subjectId)
        setAllTrainingSessions(trainingSessions)
        myAppUpdateContext.updateCurrentPageTo("TrainingSessionsPage")
    }

    const loadTrainingSessionPage = async () => {
        const trainingSessionId = trainingSessionsFormRef.current.cardNumber.value
        myAppUpdateContext.updateCurrentPageTo("TrainingSessionPage")
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
        trainingCards,
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
        answerQuestion,
        finishTrainingRound,
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