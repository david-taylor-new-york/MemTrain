import React, { useContext, useState, useRef } from 'react'
import { useMyAppContext, useMyAppUpdateContext } from './AppContextProvider'
import { showToast, wrongAnswerToast, getFibonacci } from '../utils/utils'
import { createTrainingSession, getTrainingSessions, updateTrainingSession,
    createCardResults, getCardResultsBy, createTrainingRecord, getTrainingRecordByCardId,
    updateTrainingRecord, getTrainingRecordsBySubjectId } from '../utils/httpClient'

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
    const [currentTrainingRecords, setCurrentTrainingRecords] = useState([])
    const [dueCards, setDueCards] = useState([])
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

    const getCardsDueToday = (currentTrainingRecordsLocal) => {
        const today = new Date()

        const dueTrainingRecords = currentTrainingRecordsLocal.filter(trainingRecord => {
            const reviewDate = new Date(trainingRecord.date_to_review_next)
            const isDueToday = reviewDate.toDateString() === today.toDateString()
            return isDueToday
        })

        const dueCardIds = dueTrainingRecords.map(trainingRecord => trainingRecord.card_id)
        const dueCards = myAppContext.allCardsBySubject.filter(card => dueCardIds.includes(card.id))

        return dueCards
    }

    const loadTrainingSetupPage = async () => {
        const trainingRecords = await getTrainingRecordsBySubjectId(myAppContext.currentSubjectId)
        trainingRecords.sort((a, b) => a.card_id - b.card_id)
        setCurrentTrainingRecords(trainingRecords)

        const dueCardsLocal = getCardsDueToday(trainingRecords)
        setDueCards(dueCardsLocal)
        myAppUpdateContext.updateCurrentPageTo("Training Setup")
    }

    const startTraining = () => {
        setCurrentTrainingState("Training")

        const numberOfCardsToReview = trainingSettingsFormRef.current.numberOfCardsToReview.value
        const allCards = [...myAppContext.allCardsBySubject]
        allCards.sort((a, b) => a.card_number - b.card_number)

        if ((numberOfCardsToReview > allCards.length) || (numberOfCardsToReview < 1)) {
            showToast("You only have " + allCards.length + " cards!")
            trainingSettingsFormRef.current.reset()
            trainingSettingsFormRef.current.numberOfCardsToReview.focus()
            return
        }

        if (numberOfCardsToReview < dueCards.length) {
            showToast("You need to review at least " + dueCards.length + " cards. They are due today!")
            trainingSettingsFormRef.current.reset()
            trainingSettingsFormRef.current.numberOfCardsToReview.focus()
            return
        }

        const trainingCards = getTrainingCards(numberOfCardsToReview, allCards)

        if (trainingCards.length === 0) {
            showToast("You have no cards to review! Create new ones or come back tomorrow.")
            trainingSettingsFormRef.current.reset()
            trainingSettingsFormRef.current.numberOfCardsToReview.focus()
            return
        }

        setTrainingCards(trainingCards)
        setTrainingRounds(0)
        setProgressValue(0)
        setCurrentCardResults([])
        setFailedCards([])
        setCurrentCardIndex(0)
        setNumberCorrect(0)
        setNumberIncorrect(0)
        setCumulativeTrainingSessionTimeInSeconds(0)
        setStartTime(new Date())
        setNumberRemaining(trainingCards.length)
        myAppUpdateContext.updateCurrentPageTo("Training")
    }

    const getTrainingCards = (numberOfCardsToReview, allCards) => {
        // If there are cards due for review, add them first to the training cards
        const cardsToReturn = dueCards.length > 0 ? [...dueCards] : []

        // If due cards are less than the number requested to review, add them to cardsToReturn
        if ((numberOfCardsToReview - cardsToReturn.length) > 0) {
            // Find the index of the last card in currentTrainingRecords - this is the last card that was activated
            const indexOfNextCardToActivate = currentTrainingRecords.length

            for (let i = indexOfNextCardToActivate; i < allCards.length && cardsToReturn.length < numberOfCardsToReview; i++) {
                cardsToReturn.push(allCards[i])
            }
        }

        return cardsToReturn
    }

    const getNextCard = () => {
        const nextCardIndex = currentCardIndex + 1
        setCurrentCardIndex(nextCardIndex)
        const currentProgress = nextCardIndex / trainingCards.length
        setProgressValue(currentProgress)
        setStartTime(new Date())
    }

    const answerQuestion = () => {
        const currentCard = trainingCards[currentCardIndex]
        const givenAnswer = submitAnswerFormRef.current.answer.value

        if (givenAnswer === "") {
            submitAnswerFormRef.current.reset()
            return false
        }

        let timeToAnswerThisCard = parseFloat(((new Date() - startTime) / 1000).toFixed(2))
        let timeToAnswerThisCardInSeconds = Math.round(timeToAnswerThisCard)
        const cumulTime = cumulativeTrainingSessionTimeInSeconds + timeToAnswerThisCardInSeconds
        setCumulativeTrainingSessionTimeInSeconds(cumulTime)
        timeToAnswerThisCard = Math.min(timeToAnswerThisCard, 99.99)
        const isCorrect = compareAnswers(currentCard.answer, givenAnswer)
        updateScores(isCorrect, currentCard)
        const cardResult = createCardResult(currentCard.id, currentCard.question, givenAnswer, currentCard.answer, isCorrect, timeToAnswerThisCard)

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
                return true
            } else {
                return false
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

    const getNewSessionNumber = () => {
        if (allTrainingSessions.length > 0) {
            return allTrainingSessions[allTrainingSessions.length - 1].session_number + 1
        } else {
            return 1
        }
    }

    const finishTrainingRound = async () => {
        if ((trainingType === "recorded") && (trainingRounds === 1)) {

            const newTrainingSession = {
                subject_id: myAppContext.currentSubjectId,
                session_number: getNewSessionNumber(),
                first_pass_correct: numberCorrect,
                first_pass_incorrect: numberIncorrect,
                rounds_to_finish: trainingRounds,
                session_start_time: startTime,
                training_time_in_seconds: cumulativeTrainingSessionTimeInSeconds
            }
            const trainingSessionId = await createTrainingSession(newTrainingSession)
            newTrainingSession.id = trainingSessionId.id
            setCurrentTrainingSession(newTrainingSession)
            const updatedTrainingSessions = [...allTrainingSessions]
            updatedTrainingSessions.push(newTrainingSession)
            setAllTrainingSessions(updatedTrainingSessions)

            const nextCardResults = addTrainingSessionIdToCardResults(trainingSessionId.id)
            const sortedCardResults = nextCardResults.sort((a, b) => { return a.card_id - b.card_id })

            createTrainingRecords(sortedCardResults)

            setCurrentCardResults(sortedCardResults)
            await createCardResults(sortedCardResults)
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

    const getReviewDateUsingTrainingRecord = (cardResultLocal, existingTrainingRecordLocal) => {
        let reviewDate = new Date()
        // whether answer is correct or not, default to tomorrow, then addDays if it was correct
        reviewDate.setDate(reviewDate.getDate() + 1)

        if (existingTrainingRecordLocal.correct_streak >= 5) {
            const daysToAdd = getFibonacci(existingTrainingRecordLocal.correct_streak - 5)
            reviewDate.setDate(reviewDate.getDate() + daysToAdd)
        }
        const formattedDate = reviewDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })

        return formattedDate
    }

    const createTrainingRecords = async (sortedCardResults) => {
        const subject_id = myAppContext.currentSubjectId

        for (const cardResultLocal of sortedCardResults) {
            let reviewDate = new Date()

            try {
                const trainingRecordsArray = await getTrainingRecordByCardId(cardResultLocal.card_id);

                if (trainingRecordsArray.length > 0) {
                    const existingTrainingRecord = trainingRecordsArray[0];

                    reviewDate = getReviewDateUsingTrainingRecord(cardResultLocal, existingTrainingRecord)

                    let review_count = existingTrainingRecord.review_count

                    let streak = 0;
                    if (cardResultLocal.is_correct) {
                        streak = existingTrainingRecord.correct_streak + 1
                    }


                    const total_time_sec = parseFloat(existingTrainingRecord.avg_time_sec) * existingTrainingRecord.review_count
                    const new_total_time_sec = total_time_sec + parseFloat(cardResultLocal.seconds_to_answer)
                    review_count++
                    let average_time = new_total_time_sec / review_count

                    if (average_time > 99.99) {
                        average_time = 99.99
                    } else {
                        average_time = parseFloat(average_time.toFixed(2))
                    }

                    const trainingRecord = {
                        id: existingTrainingRecord.id,
                        subject_id: subject_id,
                        card_id: cardResultLocal.card_id,
                        avg_time_sec: average_time,
                        review_count: review_count,
                        correct_streak: streak,
                        date_to_review_next: reviewDate
                    }
                    await updateTrainingRecord(trainingRecord)

                } else {

                    reviewDate.setDate(reviewDate.getDate() + 1)

                    const trainingRecord = {
                        subject_id: subject_id,
                        card_id: cardResultLocal.card_id,
                        avg_time_sec: cardResultLocal.seconds_to_answer,
                        review_count: 1,
                        correct_streak: (cardResultLocal.is_correct) ? 1 : 0,
                        date_to_review_next: reviewDate
                    }

                    await createTrainingRecord(trainingRecord)
                }
            } catch (error) {
                console.error("Error creating/updating trainingRecord:", error)
            }
        }
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
            session_number: currentTrainingSession.session_number,
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

    // normalizeText() converts to lowercase, removes leading and trailing spaces, replaces multiple spaces with a single space,
    // and removes any characters that are not alphanumeric or spaces.
    const normalizeText = (text) => {
        return text.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[^\w\s]/gi, '')
    }

    const createCardResult = (cardId, question, givenAnswer, answer, isCorrect, timeToAnswerThisCard) => {
        return {
            training_session_id: null,
            card_id: cardId,
            question: question,
            guess: givenAnswer,
            answer: answer,
            is_correct: isCorrect,
            seconds_to_answer: timeToAnswerThisCard
        }
    }

    const updateCardResults = (cardResult) => {
        const updatedCardResults = [...currentCardResults]
        updatedCardResults.push(cardResult)
        setCurrentCardResults(updatedCardResults)
    }
    const addTrainingSessionIdToCardResults = (trainingSessionId) => {
        const cardResultsWithId = []
        for (let cardResult of currentCardResults) {
            cardResult.training_session_id = trainingSessionId
            cardResultsWithId.push(cardResult)
        }
        return cardResultsWithId
    }

    const loadTrainingSessionPage = async () => {
        const trainingSessionNumber = trainingSessionsFormRef.current.id_input_field.value
        const trainingSessionIndex = allTrainingSessions.findIndex(session => session.session_number.toString() === trainingSessionNumber.toString())

        if (trainingSessionIndex < 0) {
            showToast("Training session " + trainingSessionNumber + " not found!")
            trainingSessionsFormRef.current.reset()
            trainingSessionsFormRef.current.id_input_field.focus()
            return
        }
        const trainingSession = allTrainingSessions[trainingSessionIndex]
        setCurrentTrainingSession(allTrainingSessions[trainingSessionIndex])

        const sessionResultsByTrainingSessionId = await getCardResultsBy('training_session_id', trainingSession.id)
        setCurrentSessionResults(sessionResultsByTrainingSessionId)
        myAppUpdateContext.updateCurrentPageTo("Training Session")
    }

    const loadTrainingCardResultsPage = async () => {
        const cardResultsCardNumber = trainingSessionFormRef.current.id_input_field.value
        const allCardsBySubject = [...myAppContext.allCardsBySubject]
        const cardResultsIndex = allCardsBySubject.findIndex(card => card.card_number.toString() === cardResultsCardNumber.toString())

        if (cardResultsIndex < 0) {
            showToast("Results not found for card: " + cardResultsCardNumber)
            trainingSessionFormRef.current.reset()
            trainingSessionFormRef.current.id_input_field.focus()
            return
        }
        const cardThatContainsCardNumber = allCardsBySubject[cardResultsIndex]
        const cardResults = await getCardResultsBy('card_id', cardThatContainsCardNumber.id)

        setCurrentCardResults(cardResults)
        const correct = countCorrect(cardResults)
        const incorrect = cardResults.length - correct
        setNumberCorrect(correct)
        setNumberIncorrect(incorrect)
        myAppUpdateContext.updateCurrentPageTo("Training Card Results")
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
        currentTrainingRecords,
        dueCards,
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
        answerQuestion,
        finishTrainingRound,
        finishTraining,
        cancelTraining,
        loadTrainingSetupPage,
        loadTrainingMenuPage,
        loadTrainingSessionPage,
        loadTrainingCardResultsPage
    }

    return (
        < MyTrainingContext.Provider value={allContexts} >
            < MyTrainingUpdateContext.Provider value={allContextUpdates} >
                {children}
            < /MyTrainingUpdateContext.Provider >
        < /MyTrainingContext.Provider >
    )
}