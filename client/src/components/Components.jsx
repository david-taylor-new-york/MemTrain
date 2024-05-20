import React from 'react'
import { useMyAppContext, useMyAppUpdateContext } from '../contexts/AppContextProvider'

export const PageHeader = () => {
    const myAppContext = useMyAppContext()
    const myAppUpdateContext = useMyAppUpdateContext()

    const showBackButton = (myAppContext.currentSubjectName !== "unselected")

    return (
        <div className="section-container">
            <div className="button-group-top margin-bottom">
                <button className={`header-button ${showBackButton ? '' : 'hidden-element'}`} onClick={() => myAppUpdateContext.updateCurrentPageTo(myAppContext.previousPage)}>Back</button>
                <div className="current-page">{myAppContext.currentPage}</div>
                <button className="header-button" onClick={myAppUpdateContext.handleLogout}> Logout </button>
            </div>
            <div className="button-group-top">
                <div className="current-page"> Subject: {myAppContext.currentSubjectName}</div>
            </div>
        </div>
    )
}

export const CurrentCardsTable = () => {
    const myAppContext = useMyAppContext()
    const cards = myAppContext.allCardsBySubject
    const showAnswer = (myAppContext.currentPage !== "Main Menu")

    if ((cards === null) || (cards.length === 0)) {
        if (myAppContext.currentPage === "Card Menu") {
            return (
                <div id="create-some-cards-text">
                    <br />
                    Create some Cards!
                </div>
            )
        }
    } else {
        return (
            <div>
                <table className="table-container card-table-container">
                    < CurrentCardsTableHeader showAnswer={showAnswer} />
                    < CurrentCardList cards={cards} showAnswer={showAnswer} />
                </table>
            </div>
        )
    }
}

const CurrentCardsTableHeader = ({ showAnswer }) => {
    return (
        <thead >
            <tr>
                <th>CARD</th>
                <th>QUESTION</th>
                {showAnswer && <th>ANSWER</th>}
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
                        <td >{card.id}</td>
                        <td >{card.question}</td>
                        {showAnswer && <td>{card.answer}</td>}
                    </tr>
                ))}
        </tbody>
    )
}

export const SubmitButton = ({ showButton = true, id, onClick, children }) => {
    return (
        <div>
            {showButton && <button id={id} className="button" onClick={onClick}> {children} </button>}
        </div>
    )
}

export const ChooseIdWidget = ({ formRef, buttonLabel, submitCall }) => {
    const myAppUpdateContext = useMyAppUpdateContext()

    const handleSubmit = (e) => {
        e.preventDefault()
        submitCall()
    }

    return (
        <div className="section-container">
            <form ref={formRef} onSubmit={handleSubmit}>
                <label>
                    Id:
                    <input id="id-input-field" type="text" autoComplete="off" name="id_input_field" autoFocus required minLength="1" />
                </label>
                <br />
                <button id="submit-button" className="button" type="submit"> {buttonLabel} </button>
                <button id="cancel-button" className="button" type="button" onClick={myAppUpdateContext.handleCancel}>Cancel</button>
            </form>
            <hr />
        </div>
    )
}

export const CardForm = ({ formRef, onSubmit, defaultValue }) => {
    const myAppUpdateContext = useMyAppUpdateContext()
    return (
        <div className="section-container">
            <form ref={formRef} onSubmit={onSubmit}>
                Question:
                <input id="card-question" type="text" autoComplete="off" name="question" defaultValue={defaultValue ? defaultValue.question : ''} autoFocus required minLength="1" />
                Answer:
                <input id="card-answer" type="text" autoComplete="off" name="answer" defaultValue={defaultValue ? defaultValue.answer : ''} required minLength="1" />
                Card (Id) To Follow:
                <input id="card-id-to-follow" type="number" name="card_to_follow" defaultValue={defaultValue ? defaultValue.follows : ''} minLength="1" />
                <br />
                <div className="main-menu-button-group">
                    <button id="create-update-card-button" className="button" type="submit" >{defaultValue ? 'Update Card' : 'Create Card'}</button>
                    <button id="cancel-button" className="button" type="button" onClick={myAppUpdateContext.handleCancel}>Cancel</button>
                </div>
            </form>
        </div>
    )
}
