import React from 'react'
import { useMyAppContext, useMyAppUpdateContext } from '../contexts/AppContextProvider'
import './commonStyles.css'

export const CurrentCardsTable = () => {
    const myAppContext = useMyAppContext()
    const cards = myAppContext.allCards
    const showAnswer = (myAppContext.currentPage !== "MainMenuPage")

    if ((cards === null) || (cards.length === 0)){
        if (myAppContext.currentPage === "CardMenuPage") {
            return (
                <div>
                    <br/>
                    Create some Cards!
                </div>
            )
        }
    } else {
        return (
            <div className="table-container">
                <table className="content-table">
                    <ResultsHeader showAnswer={showAnswer} />
                    <CurrentCardList cards={cards} showAnswer={showAnswer} />
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
                { showAnswer && <th>ANSWER</th> }
                { showAnswer && <th id="right_header">FOLLOWS</th> }
            </tr>
        </thead>
    )
}

const CurrentCardList = ({ cards, showAnswer }) => {

    return (
        <tbody>
            {cards.sort((a, b) => a.id > b.id ? 1 : -1)
            .map((card) => (
                <tr key={card.id}>
                    <td id="left_header">{card.id}</td>
                    <td id="second_header">{card.question}</td>
                    { showAnswer && <td id="third_header">{card.answer}</td> }
                    { showAnswer && <td id="right_header">{card.follows}</td> }
                </tr>
            ))}
        </tbody>
    )
}

export const PageHeader = ({ pageTitle, previousPage }) => {
    const myAppContext = useMyAppContext()
    const myAppUpdateContext = useMyAppUpdateContext()

        const showBackButton = (myAppContext.subjectName !== "unselected")

        return (
            <div className="container">
                <div className="button-group-top">
                    { showBackButton && <button className="button" onClick={() => myAppUpdateContext.updateCurrentPageTo(previousPage)}>Back</button> }
                    <button className="button" onClick={myAppUpdateContext.handleLogout}> Logout </button>
                </div>
                <h4 className="subject-sub-header"> Subject: {myAppContext.subjectName}</h4>
                <h3 className="page-title">{pageTitle}</h3>
                <hr />
            </div>
        );
    }
