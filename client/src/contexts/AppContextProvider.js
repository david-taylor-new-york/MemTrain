import React, { useContext, useState, useRef } from 'react'

import { createUser, getUser, createSubject, getSubjectsBy, createCard, getCards, updateCard, deleteCard } from '../utils/httpClient'
import { showToast } from '../utils/utils'

const MyAppContext = React.createContext()
const MyAppUpdateContext = React.createContext()

export function useMyAppContext() {
    return useContext(MyAppContext)
}

export function useMyAppUpdateContext() {
    return useContext(MyAppUpdateContext)
}

export function AppContextProvider({ children }) {
    
    /**
     * 
     * Configure Already LOGGED IN vvvv
     * 
     */

    // const [currentPage, setCurrentPageTo] = useState("SubjectPage")
    // const [isLoggedIn, setIsLoggedIn] = useState(true)
    // // const [userName, setUserName] = useState("a")
    // const [userId, setUserId] = useState(1)

    const [currentPage, setCurrentPageTo] = useState("LoginPage")
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    // const [userName, setUserName] = useState(null)
    const [userId, setUserId] = useState(null)

    /**
     * 
     * Configure Already LOGGED IN ^^^^
     * 
     */



    // const [subjects, setSubjects] = useState([])
    const [subjectName, setSubjectName] = useState("unselected")
    const [subjectId, setSubjectId] = useState(null) // use this to create cards
    const [allCards, setAllCards] = useState([])

    // set three of these, for convenience, views, remove later if we can
    const [cardToEditId, setCardToEditId] = useState(null)
    const [cardToEditIndex, setCardToEditIndex] = useState(null)
    const [cardToEditNumber, setCardToEditNumber] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const updateIsLoading = (loading) => {
        setIsLoading(loading)
    }
    const updateCurrentPageTo = (pageName) => {
        setCurrentPageTo(pageName)
    }

    const handleNewUser = async (e) => {
        e.preventDefault() // this is only for handleSubmit!! <== DO WE NEED THIS???

        const userName = loginPageFormRef.current.user_name.value
        const password = loginPageFormRef.current.password.value

        if ((userName === "") || (password === "")) {
            showToast(`Enter username and password`)
            setIsLoggedIn(false)
            setUserId(null)
            setCurrentPageTo("LoginPage")
            return
        }
        try {
            const user_id = await createUser({ user_name: userName, password: password })

            setIsLoggedIn(true)
            setUserId(user_id.id)
            setCurrentPageTo("SubjectPage")
        } catch (error) {
            console.log(error)
            showToast(`User ${userName} already exists!`)
            loginPageFormRef.current.reset()
            loginPageFormRef.current.user_name.focus()
            setCurrentPageTo("LoginPage")
        }
    }

    const handleLogin = async () => {

        const userName = loginPageFormRef.current.user_name.value
        const password = loginPageFormRef.current.password.value

        if ((userName === "") || (password === "")) {
            showToast(`Enter username and password`)
            setIsLoggedIn(false)
            setUserId(null)
            return
        }

        setIsLoading(true)

        try {
            const userDataRows = await getUser(userName)
            const userData = userDataRows[0]

            if (userData && userData.hasOwnProperty('password')) {

                if (password === userData.password) {
                    setIsLoggedIn(true)
                    setUserId(userData.id)
                    setCurrentPageTo("SubjectPage")
                } else {
                    showToast(`Wrong password!`)
                    setIsLoggedIn(false)
                    setUserId(null)
                }
            } else {
                showToast(`User ${userName} not found!`)
                setIsLoggedIn(false)
                setUserId(null)
            }
        } catch (error) {
            console.error(error)
            showToast(error.message || "Error occurred during login")
        }

        setIsLoading(false)
    }

    const handleLogout = () => {
        setIsLoggedIn(false)
        setUserId(null)
        setSubjectId(null)
        setSubjectName("unselected")
        setCurrentPageTo("LoginPage")
    }

    const handleCreateSubject = async (e) => {
        e.preventDefault() // this is only for handleSubmit!! <== DO WE NEED THIS???

        const newSubjectName = newSubjectNameFormRef.current.value
        if (newSubjectName === "") {
            showToast(`Enter subject name!`)
            setCurrentPageTo("SubjectPage")
            return
        }
        try {
            const newSubjectId = await createSubject({ subject_name: newSubjectName, user_id: userId })
            setCurrentPageTo("MainMenuPage")
            setSubjectName(newSubjectName)
            setSubjectId(newSubjectId.id)
            setAllCards([])
        } catch (error) {
            console.log(error)
            newSubjectNameFormRef.current.value = ""
            showToast(`Subject ${newSubjectName} already exists!`)
            newSubjectNameFormRef.current.focus()
        }
    }

    const handleSubjectChange = async (e) => {
        const newCurrentSubjectName = e.target.value

        if (newCurrentSubjectName === 'Select a subject') {
            return
        }

        setIsLoading(true)

        try {
            const dropDownSubjectId = await getSubjectsBy('subject_name', newCurrentSubjectName)

            if (dropDownSubjectId[0].hasOwnProperty('id')) {
                setSubjectName(newCurrentSubjectName)
                setSubjectId(dropDownSubjectId[0].id)

                const cardsBySubjectId = await getCards(dropDownSubjectId[0].id)

                
                
                // getCardResults/card_schedules  here eventually also - do it once then only CRUD




                setAllCards(cardsBySubjectId)
                setCurrentPageTo("MainMenuPage")
                setIsLoading(false)
            } else {
                showToast(`Subject: ${subjectId} not found!`)
                setIsLoggedIn(false)
                setUserId(null)
                setCurrentPageTo("LoginPage")
            }

        } catch (error) {
            console.error(error)
            showToast(error.message || "Error occurred during subject change")
        }
        setIsLoading(false)
    }

    const handleCreateCard = async (e) => {
        e.preventDefault() // this is only for handleSubmit!!

        const question = createCardFormRef.current.question.value
        const answer = createCardFormRef.current.answer.value
        let cardToFollow = createCardFormRef.current.cardToFollow.value
        if (cardToFollow === "") { cardToFollow = null }

        setIsLoading(true)

        const newCard = {
            subject_id: subjectId,
            question: question,
            answer: answer,
            follows: cardToFollow,
        }
        try {
            const card_id = await createCard(newCard)

            // if successful, push newCard to {allCards}
            newCard.id = card_id.id
            let updatedCards = []
            updatedCards = [...allCards]
            updatedCards.push(newCard)
            setAllCards(updatedCards)

        } catch (error) {
            console.log(error)
            showToast(`Could not create card!`)
            setCurrentPageTo("CreateCardPage")
        }

        createCardFormRef.current.reset()
        createCardFormRef.current.question.focus()
        setIsLoading(false)
    }

    const handleSetCardToEditId = (e) => {
        const cardId = editCardFormRef.current.cardNumber.value

        if (cardId === "") {
            showToast("Enter Id of Card to edit")
            editCardFormRef.current.reset()
            editCardFormRef.current.cardNumber.focus()
            return
        }

        let cardToEditIndex = allCards.findIndex(card => card.id.toString() === cardId)

        if (cardToEditIndex > -1) {
            setCardToEditNumber(cardId)
            setCardToEditIndex(cardToEditIndex)

            let tempCardToEditId = allCards[cardToEditIndex].id

            editCardFormRef.current.reset()
            editCardFormRef.current.cardNumber.focus()

            if (tempCardToEditId < 0) {
                showToast("DID NOT FIND Card Id --> " + tempCardToEditId + " <--")
                return
            }
            setCardToEditId(tempCardToEditId)
        } else {
            editCardFormRef.current.reset()
            editCardFormRef.current.cardNumber.focus()
            showToast("DID NOT find Card: " + cardId)
            return
        }

    }

    const handleCancelUpdateCard = async () => {
        updateCurrentPageTo('CardMenuPage')
        setCardToEditId(null)
        setCardToEditNumber(null)
        setCardToEditIndex(null)
    }

    const handleUpdateCard = async (e) => {
        e.preventDefault() // this is only for handleSubmit!!

        let updatedCards = [...allCards]
        const cardToEdit = allCards[cardToEditIndex]
        const updatedQuestion = editCardWidgetFormRef.current.question.value
        const updatedAnswer = editCardWidgetFormRef.current.answer.value

        let updatedCardToFollow = editCardWidgetFormRef.current.cardToFollow.value
        if (updatedCardToFollow === "") {
            updatedCardToFollow = null
        }

        // if nothing was updated, showToast:
        if ((updatedQuestion === cardToEdit.question) && (updatedAnswer === cardToEdit.answer) && (updatedCardToFollow === cardToEdit.follows)) {
            showToast("You've made no changes")
            editCardWidgetFormRef.current.reset()
            editCardWidgetFormRef.current.question.focus()
            return
        }

        updatedCards.splice(cardToEditIndex, 1) // 2nd parameter means remove one item only

        const updatedCard = {
            id: cardToEditId,
            subject_id: cardToEdit.subject_id,
            question: updatedQuestion,
            answer: updatedAnswer,
            follows: updatedCardToFollow
        }

        setIsLoading(true)

        try {
            const response = await updateCard(updatedCard)
            if (response === 'success') {
                updatedCards.push(updatedCard)
                setAllCards(updatedCards)
            } else {
                throw new Error ('Could not UPDATE Card!')
            }
        } catch {
            showToast(`IN CATCH - Could not UPDATE Card!`)
        }
        setIsLoading(false)
        setCardToEditId(null)
        setCardToEditNumber(null)
        setCardToEditIndex(null)
        editCardWidgetFormRef.current.reset()
        editCardWidgetFormRef.current.question.focus()
    }

    const handleDeleteCard = async (e) => {
        e.preventDefault() // this is only for handleSubmit!!

        const cardToDeleteNumber = deleteCardFormRef.current.cardNumber.value

        if (cardToDeleteNumber === "") {
            showToast("Enter Card to delete")
            deleteCardFormRef.current.reset()
            deleteCardFormRef.current.cardNumber.focus()
            return
        }

        let updatedCards = [...allCards]
        const cardToDeleteIndex = updatedCards.findIndex(card => card.id.toString() === cardToDeleteNumber.toString())

        if (cardToDeleteIndex > -1) {
            updatedCards.splice(cardToDeleteIndex, 1)
            setAllCards(updatedCards)
        } else {
            showToast("DID NOT find card to delete: " + cardToDeleteNumber)
            deleteCardFormRef.current.reset()
            deleteCardFormRef.current.cardNumber.focus()
            return
        }
        
        const cardToDeleteId = allCards[cardToDeleteIndex].id
        setIsLoading(true)

        try {
            const response = await deleteCard(cardToDeleteId)
            if (response === 'success') {
                deleteCardFormRef.current.reset()
                deleteCardFormRef.current.cardNumber.focus()
                }

        } catch {
            showToast(`IN CATCH - Could not DELETE card!`)
        }

        setIsLoading(false)
    }


    const loginPageFormRef = useRef()
    const createCardFormRef = useRef()
    const editCardFormRef = useRef()
    const editCardWidgetFormRef = useRef()
    const deleteCardFormRef = useRef()
    const newSubjectNameFormRef = useRef()

    const allContexts = {
        userId,
        subjectId,
        subjectName,
        allCards,
        currentPage,
        cardToEditIndex,
        cardToEditId,
        cardToEditNumber,
        isLoading,
        isLoggedIn,
        loginPageFormRef,
        newSubjectNameFormRef,
        createCardFormRef,
        editCardFormRef,
        editCardWidgetFormRef,
        deleteCardFormRef
    }

    const allContextUpdaters = {
        handleCreateCard,
        handleSetCardToEditId,
        handleCancelUpdateCard,
        handleUpdateCard,
        handleDeleteCard,
        handleCreateSubject,
        handleSubjectChange,
        updateCurrentPageTo,
        updateIsLoading,
        handleLogin,
        handleNewUser,
        handleLogout
    }

    return (
        < MyAppContext.Provider value={allContexts} >
            < MyAppUpdateContext.Provider value={allContextUpdaters} >
                {children}
            </ MyAppUpdateContext.Provider >
        </ MyAppContext.Provider >
    )
}
