import React from 'react'
import { useMyAppContext, useMyAppUpdateContext } from '../contexts/AppContextProvider'

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
            <div>
                <hr/>
                <table style={{ border: "1px solid black" }} >
                    <tbody>
                        < ResultsHeader showAnswer = {showAnswer} />
                        < CurrentCardList cards = {cards} showAnswer = {showAnswer} />
                    </tbody>
                </table>
            </div>
        )
    }
}

const ResultsHeader = (props) => {

    return (
        <tr>
            <th>Card</th>
            <th>Question</th>
            { props.showAnswer ? <th>Answer</th> : null }
            { props.showAnswer ? <th>Follows</th> : null }
        </tr>
    )
}

const CurrentCardList = (props) => {
    let localCards = props.cards

    return (
        localCards.sort((a, b) => a.id - b.id)
        .map((card) => {
            return (
                <tr key={card.id} >
                    <td style={{ textAlign: 'center' }} > {card.id} </td>
                    <td> {card.question} </td>

                    { props.showAnswer ? <td key={card.answer}> {card.answer} </td> : null }
                    { props.showAnswer ? <td key={card.card_to_follow} style={{ textAlign: 'center' }} > {card.card_to_follow} </td>: null }
                    
                </tr>
            )
        })
    )
}

export const LogOutButton = () => {
    const myAppUpdateContext = useMyAppUpdateContext()
    return (
        <input id="LogOutButton" type="button" className="button-main-css" order="6" defaultValue="Logout" onClick={() => { myAppUpdateContext.handleLogout() }} />
    )
}

export const BackButton = ({ previousPage }) => {
    const myAppUpdateContext = useMyAppUpdateContext()
    return (
        <input type="button" className="button-main-css" defaultValue="Back" onClick={() => { myAppUpdateContext.updateCurrentPageTo(previousPage) }} />
    )
}
