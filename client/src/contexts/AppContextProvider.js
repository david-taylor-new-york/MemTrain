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

    // const [currentPage, setCurrentPage] = useState("Subject")
    // const [isLoggedIn, setIsLoggedIn] = useState(true)
    // // const [userName, setUserName] = useState("a")
    // const [userId, setUserId] = useState(1)

    const [currentPage, setCurrentPage] = useState("Login")
    const [previousPage, setPreviousPage] = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    // const [userName, setUserName] = useState(null)
    const [userId, setUserId] = useState(null)

    /**
     * 
     * Configure Already LOGGED IN ^^^^
     * 
     */

    // const [subjects, setSubjects] = useState([])
    const [currentSubjectName, setCurrentSubjectName] = useState("unselected")
    const [currentSubjectId, setCurrentSubjectId] = useState(null) // use this to create cards
    const [allCardsBySubject, setAllCardsBySubject] = useState([])

    // set three of these, for convenience, views, remove later if we can
    const [cardToEdit, setCardToEdit] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const updateCurrentPageTo = (newCurrentPage) => {
        console.log("setting current page to: " + newCurrentPage)
        let pPage = ""
        setCurrentPage(newCurrentPage)
        switch (newCurrentPage) {
            case "Card Menu":
                pPage = "Main Menu"
                break
            case "Create Cards":
                pPage = "Card Menu"
                break
            case "Delete Cards":
                pPage = "Card Menu"
                break
            case "Edit Cards":
                pPage = "Card Menu"
                break
            case "Main Menu":
                pPage = "Subject"
                break
            case "Login":
                pPage = "Login"
                break
            case "Subject":
                pPage = "Subject"
                break
            case "Training Menu":
                pPage = "Main Menu"
                break
            case "Training":
                pPage = "Training Menu"
                break
            case "Training Card Results":
                pPage = "Training Session"
                break
            case "Training Session":
                pPage = "Training Sessions"
                break
            case "Training Sessions":
                pPage = "Training Menu"
                break
            case "Training Setup":
                pPage = "Training Menu"
                break
            case "Training Summary":
                pPage = "Training Sessions"
                break
            default:
                (console.log("PAGE NOT RECOGNIZED: " + newCurrentPage))
        }
        setPreviousPage(pPage)
    }

    const handleLoadEditCardPage = (e) => {
        setPreviousPage(currentPage)
        setCurrentPage("Edit Cards")
        setCardToEdit(null)
    }

    const handleNewUser = async (e) => {
        const userName = loginPageFormRef.current.user_name.value.toLowerCase();
        const password = loginPageFormRef.current.password.value
        const confirm_password = loginPageFormRef.current.confirm_password.value

        if ((password != confirm_password)) {
            showToast(`PASSWORDS DO NOT MATCH!`)
            loginPageFormRef.current.reset()
            loginPageFormRef.current.user_name.focus()
            setIsLoggedIn(false)
            setUserId(null)
            setCurrentPage("Login")
            setPreviousPage(null)
            return
        }

        try {
            const user_id = await createUser({ user_name: userName, password: password })

            setIsLoggedIn(true)
            setUserId(user_id.id)
            setCurrentPage("Subject")
            setPreviousPage("Login")
        } catch (error) {
            console.log(error)
            showToast(`User ${userName} already exists!`)
            loginPageFormRef.current.reset()
            loginPageFormRef.current.user_name.focus()
            setCurrentPage("Login")
            setPreviousPage(null)
        }
    }

    const handleLogin = async () => {

        const userName = loginPageFormRef.current.user_name.value.toLowerCase();
        const password = loginPageFormRef.current.password.value

        setIsLoading(true)

        try {
            const userDataRows = await getUser(userName)
            const userData = userDataRows[0]

            if (userData && userData.hasOwnProperty('password')) {

                if (password === userData.password) {
                    setIsLoggedIn(true)
                    setUserId(userData.id)
                    setCurrentPage("Subject")
                } else {
                    //                    const notifyA = () => toast('Wow so easy !', {containerId: 'A'})
                    //                    showToast(`Wrong password!`, {containerId: 'toast_container'})
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
        setCurrentSubjectId(null)
        setCurrentSubjectName("unselected")
        setCurrentPage("Login")
        setPreviousPage(null)
    }

    const handleCreateSubject = async (e) => {
        e.preventDefault() // YES WE DO <== DO WE NEED THIS???
        const newSubjectName = newSubjectNameFormRef.current.new_subject_name.value

        if (newSubjectName === "") {
            showToast(`Enter subject name!`)
            setCurrentPage("Subject")
            return
        }

        try {
            const allSubjects = await getSubjectsBy("user_id", userId)
            for (let subject of allSubjects) {
                if (subject.subject_name === newSubjectName) {
                    newSubjectNameFormRef.current.new_subject_name.value = ""
                    newSubjectNameFormRef.current.new_subject_name.focus()
                    showToast(`Subject ${newSubjectName} already exists!`)
                    return
                }
            }
            const newSubjectId = await createSubject({ subject_name: newSubjectName, user_id: userId })
            showToast(`Subject ${newSubjectName} added!`)
            setCurrentPage("Main Menu")
            setPreviousPage("Subject")
            setCurrentSubjectName(newSubjectName)
            setCurrentSubjectId(newSubjectId.id)
            setAllCardsBySubject([])
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
            const subjectsByName = await getSubjectsBy('subject_name', newCurrentSubjectName)

            const subject = subjectsByName.find(subject => subject.user_id === userId)

            setCurrentSubjectId(subject.id)
            setCurrentSubjectName(newCurrentSubjectName)

            const cardsBySubjectId = await getCards(subject.id)
            setAllCardsBySubject(cardsBySubjectId)

            setCurrentPage("Main Menu")
            setPreviousPage("Subject")
        } catch (error) {
            console.error(error)
            showToast(error.message || "Error occurred during subject change")
        } finally {
            setIsLoading(false)
        }
    }

    const getNewCardNumber = (cards) => {
        if (cards.length > 0) {
            return cards[cards.length - 1].card_number + 1
        } else {
            return 1
        }
    }

    const handleCreateCard = async (e) => {
        e.preventDefault() // this is only for handleSubmit!!

        const question = createCardFormRef.current.question.value
        const answer = createCardFormRef.current.answer.value
        const newCardNumber = getNewCardNumber(allCardsBySubject)
        let cardToFollow = createCardFormRef.current.card_to_follow.value

        if (cardToFollow === "") { cardToFollow = null }

        setIsLoading(true)

        const newCard = {
            card_number: newCardNumber,
            subject_id: currentSubjectId,
            question: question,
            answer: answer,
            follows: cardToFollow,
        }
        try {
            const card_id = await createCard(newCard)
            newCard.id = card_id.id
            const updatedCards = [...allCardsBySubject]
            updatedCards.push(newCard)
            setAllCardsBySubject(updatedCards)

        } catch (error) {
            console.log(error)
            showToast(`Could not create card!`)
            setCurrentPage("Create Card")
            setPreviousPage("Create Card")
        }

        createCardFormRef.current.reset()
        createCardFormRef.current.question.focus()
        setIsLoading(false)
    }

    const handleSetCardToEdit = (e) => {
        const cardNumber = editCardFormRef.current.id_input_field.value
        const cardToEditIndex = allCardsBySubject.findIndex(card => card.card_number.toString() === cardNumber.toString())

        if (cardToEditIndex > -1) {
            const cardToEdit = allCardsBySubject[cardToEditIndex]
            setCardToEdit(cardToEdit)
        } else {
            editCardFormRef.current.reset()
            editCardFormRef.current.id_input_field.focus()
            showToast("DID NOT FIND card " + cardNumber)
            return
        }

    }

    const handleCancel = () => {
        console.log("current page = " + currentPage)
        console.log("previous page = " + previousPage)
        updateCurrentPageTo(previousPage)
        console.log("updateCurrentPageTo = " + previousPage)
    }

    const handleEditCard = async (e) => {
        e.preventDefault() // this is only for handleSubmit!!

        const updatedCards = [...allCardsBySubject]
        const updatedQuestion = editCardWidgetFormRef.current.question.value
        const updatedAnswer = editCardWidgetFormRef.current.answer.value

        const updatedCardToFollow = editCardWidgetFormRef.current.card_to_follow.value
        if (updatedCardToFollow === "") {
            updatedCardToFollow = null
        }

        if ((updatedQuestion === cardToEdit.question) && (updatedAnswer === cardToEdit.answer) && (updatedCardToFollow === cardToEdit.follows)) {
            showToast("You've made no changes")
            editCardWidgetFormRef.current.reset()
            editCardWidgetFormRef.current.question.focus()
            return
        }

        const cardToEditIndex = allCardsBySubject.findIndex(card => card.id === cardToEdit.id)
        updatedCards.splice(cardToEditIndex, 1) // 2nd parameter means remove one item only

        const updatedCard = {
            id: cardToEdit.id,
            card_number: cardToEdit.card_number,
            subject_id: cardToEdit.subject_id,
            question: updatedQuestion,
            answer: updatedAnswer,
            follows: updatedCardToFollow
        }

        setIsLoading(true)

        try {
            const response = await updateCard(updatedCard)
            if (response === 'success') {
                showToast(`CARD ${cardToEdit.card_number} UPDATED`)
                updatedCards.push(updatedCard)
                setAllCardsBySubject(updatedCards)
            } else {
                throw new Error('Could not UPDATE Card!')
            }
        } catch {
            throw new Error('Could not UPDATE Card!')
        }
        setIsLoading(false)
        setCardToEdit(null)
        editCardWidgetFormRef.current.reset()
        editCardWidgetFormRef.current.question.focus()
    }

    const handleDeleteCard = async (e) => {
        const cardToDeleteNumber = deleteCardFormRef.current.id_input_field.value

        if (cardToDeleteNumber === "") {
            showToast("Enter Card to delete")
            deleteCardFormRef.current.reset()
            deleteCardFormRef.current.id_input_field.focus()
            return
        }

        const updatedCards = [...allCardsBySubject]
        const cardToDeleteIndex = updatedCards.findIndex(card => card.card_number.toString() === cardToDeleteNumber.toString())

        if (cardToDeleteIndex > -1) {
            updatedCards.splice(cardToDeleteIndex, 1)
            setAllCardsBySubject(updatedCards)
        } else {
            showToast("DID NOT FIND card " + cardToDeleteNumber)
            deleteCardFormRef.current.reset()
            deleteCardFormRef.current.id_input_field.focus()
            return
        }

        const cardToDeleteId = allCardsBySubject[cardToDeleteIndex].id
        setIsLoading(true)

        try {
            const response = await deleteCard(cardToDeleteId)
            if (response === 'success') {
                showToast(`CARD ${cardToDeleteNumber} DELETED!`)
                deleteCardFormRef.current.reset()
                deleteCardFormRef.current.id_input_field.focus()
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
        currentPage,
        previousPage,
        currentSubjectId,
        currentSubjectName,
        allCardsBySubject,
        cardToEdit,
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
        handleLogin,
        handleNewUser,
        handleCreateSubject,
        handleSubjectChange,
        handleCreateCard,
        handleSetCardToEdit,
        handleLoadEditCardPage,
        handleEditCard,
        handleDeleteCard,
        handleCancel,
        updateCurrentPageTo,
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
