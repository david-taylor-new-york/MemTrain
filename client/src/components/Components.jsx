import React from 'react';
import { useMyAppContext, useMyAppUpdateContext } from '../contexts/AppContextProvider';
import './commonStyles.css';  // Import the common styles

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
                <table className="table">
                    <ResultsHeader showAnswer={showAnswer} />
                    <CurrentCardList cards={cards} showAnswer={showAnswer} />
                </table>
            </div>
        );
    };
}

const ResultsHeader = ({ showAnswer }) => {
    return (
        <thead>
            <tr>
                <th>Card</th>
                <th>Question</th>
                { showAnswer && <th>Answer</th> }
                { showAnswer && <th>Follows</th> }
            </tr>
        </thead>
    );
};

const CurrentCardList = ({ cards, showAnswer }) => {

    return (
        <tbody>
            {cards.map((card) => (
                <tr key={card.id}>
                    <td>{card.id}</td>
                    <td>{card.question}</td>
                    { showAnswer && <td>{card.answer}</td> }
                    { showAnswer && <td>{card.card_to_follow}</td> }
                </tr>
            ))}
        </tbody>
    );
};

export const LogOutButton = () => {
    const myAppUpdateContext = useMyAppUpdateContext();

    return (
        <button className="button" onClick={myAppUpdateContext.handleLogout}>
            Logout
        </button>
    );
};

export const BackButton = ({ previousPage }) => {
    const myAppUpdateContext = useMyAppUpdateContext();

    return (
        <button className="button" onClick={() => myAppUpdateContext.updateCurrentPageTo(previousPage)}>
            Back
        </button>
    );
};
