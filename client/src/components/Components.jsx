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
                { showAnswer && <th>ANSWER</th> }
                { showAnswer && <th id="right_header">FOLLOWS</th> }
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
        console.log(" writing header: previousPage= " + myAppContext.previousPage)
        console.log(" writing header: currentPage= " + myAppContext.currentPage)

        return (
            <div className="container">
                <div className="button-group-top">
                    { showBackButton && <button className="button" onClick={() => myAppUpdateContext.updateCurrentPageTo(myAppContext.previousPage)}>Back</button> }
                    <button className="button" onClick={myAppUpdateContext.handleLogout}> Logout </button>
                </div>
                <h4 id="page-subject" className="subject-sub-header"> Subject: {myAppContext.subjectName}</h4>
                <h3 id="page-title" className="page-title">{pageTitle}</h3>
                <hr />
            </div>
        );
    }

export const MenuButton = ({ onClick, children }) => {
  return (
    <button className="menu-button" onClick={onClick}>
      {children}
    </button>
  );
};
