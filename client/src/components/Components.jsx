import React from 'react'
import { useMyAppContext, useMyAppUpdateContext } from '../contexts/AppContextProvider'
import { useMyTrainingContext, useMyTrainingUpdateContext } from '../contexts/TrainingContextProvider'
import './commonStyles.css'

export const CurrentCardsTable = () => {
    const myAppContext = useMyAppContext()
    const cards = myAppContext.allCardsBySubject
    const showAnswer = (myAppContext.currentPage !== "MainMenuPage")

    if ((cards === null) || (cards.length === 0)) {
        if (myAppContext.currentPage === "CardMenuPage") {
            return (
                <div>
                    <br />
                    Create some Cards!
                </div>
            )
        }
    } else {
        return (
            <div className="table-container">
                <table className="content-table">
                    < ResultsHeader showAnswer={showAnswer} />
                    < CurrentCardList cards={cards} showAnswer={showAnswer} />
                </table>
            </div>
        )
    }
}

const ResultsHeader = ({ showAnswer }) => {
    return (
        <thead>
            <tr>
                <th>CARD</th>
                <th>QUESTION</th>
                {showAnswer && <th>ANSWER</th>}
                {showAnswer && <th id="right_header">FOLLOWS</th>}
            </tr>
        </thead>
    )
}

const CurrentCardList = ({ cards, showAnswer }) => {

    return (
        <tbody>
            {cards
                .sort((a, b) => a.id - b.id)
                .map((card) => (
                    <tr key={card.id}>
                        <td id="left_header">{card.id}</td>
                        <td id="second_header">{card.question}</td>
                        {showAnswer && <td id="third_header">{card.answer}</td>}
                        {showAnswer && <td id="right_header">{card.follows}</td>}
                    </tr>
                ))}
        </tbody>
    )
}

export const PageHeader = ({ pageTitle }) => {
    const myAppContext = useMyAppContext()
    const myAppUpdateContext = useMyAppUpdateContext()

    const showBackButton = (myAppContext.subjectName !== "unselected")

    return (
        <div className="container">
            <div className="button-group-top">
                {showBackButton && <button className="header-button" onClick={() => myAppUpdateContext.updateCurrentPageTo(myAppContext.previousPage)}>Back</button>}
                <button className="header-button" onClick={myAppUpdateContext.handleLogout}> Logout </button>
            </div>
            <h4 id="page-subject" className="subject-sub-header"> Subject: {myAppContext.subjectName}</h4>
            <h3 id="page-title" className="page-title">{pageTitle}</h3>
            <hr />
        </div>
    )
}

export const SubmitButton = ({ showButton = true, onClick, children }) => {
    return (
        <div>
            {showButton && <button className="submit-button" onClick={onClick}> {children} </button>}
        </div>
    )
}

export const ChooseIdWidget = ({ formType }) => {
    const myAppContext = useMyAppContext()
    const myAppUpdateContext = useMyAppUpdateContext()
    const myTrainingContext = useMyTrainingContext()
    const myTrainingUpdateContext = useMyTrainingUpdateContext()

    let formRef = null
    let buttonLabel = null
    let submitCall = null

    switch (formType) {
        case 'edit':
            formRef = myAppContext.editCardFormRef
            buttonLabel = 'Edit Card'
            submitCall = myAppUpdateContext.handleSetCardToEditId
            break
        case 'delete':
            formRef = myAppContext.deleteCardFormRef
            buttonLabel = 'Delete Card'
            submitCall = myAppUpdateContext.handleDeleteCard
            break
        case 'training_session':
            formRef = myTrainingContext.trainingSessionsFormRef
            buttonLabel = 'View Session'
            submitCall = myTrainingUpdateContext.loadTrainingSessionPage
            break
        default:
            break
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        submitCall()
    }

    return (
        <div className="card-widget">
            <form ref={formRef} onSubmit={handleSubmit}>
                <label>
                    Id:
                    <input id="card_id" type="text" autoComplete="off" name="cardNumber" autoFocus required minLength="1" />
                </label>
                <br />
                <button className="button" type="submit">
                    {buttonLabel}
                </button>
            </form>
            <hr />
        </div>
    )
}


// export const ChooseIdWidget = ({ formType }) => {
//     const myAppContext = useMyAppContext()
//     const myAppUpdateContext = useMyAppUpdateContext()
//     const myTrainingContext = useMyTrainingContext()
//     const myTrainingUpdateContext = useMyTrainingUpdateContext()
//
//     let formRef = null
//     let buttonLabel = null
//
//     if (formType === 'edit') {
//         formRef = myAppContext.editCardFormRef
//         buttonLabel = "Edit Card"
//     } else if (formType === 'delete') {
//         formRef = myAppContext.deleteCardFormRef
//         buttonLabel = 'Delete Card'
//     } else if (formType === 'training_session') {
//         formRef = myTrainingContext.trainingSessionsFormRef
//         buttonLabel = 'View Session'
//         console.log('IN HERE!!')
// //         {formType === 'edit' ? 'Edit Card' : 'Delete Card'}
//         }
//     const handleSubmit = (e) => {
//         e.preventDefault()
//         if (formType === 'edit') {
//             myAppUpdateContext.handleSetCardToEditId()
//         } else if (formType === 'delete') {
//             myAppUpdateContext.handleDeleteCard()
//         } else if (formType === 'training_session') {
//             myTrainingUpdateContext.loadTrainingSessionPage()
//         }
//     }
//
//     return (
//         <div>
//             <form ref={formRef} onSubmit={handleSubmit}>
//                 <label>
//                     Id:
//                     <input id="card_id" type="text" autoComplete="off" name="cardNumber" autoFocus required minLength="1" />
//                 </label>
//                 <br/>
//                 <button className="button" type="submit"> {buttonLabel} </button>
//             </form>
//             <hr />
//         </div>
//     )
// }