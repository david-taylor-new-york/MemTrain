import React from 'react'
import { useMyAppContext, useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import { PageHeader, CurrentCardsTable } from '../Components'
import { ToastContainer } from 'react-toastify'
import '../commonStyles.css'

const CreateCardsPageBody = () => {
    const myAppUpdateContext = useMyAppUpdateContext()
    const myAppContext = useMyAppContext()

    const CreateCardWidget = () => {
        return (
            <div className="card-form" >
                <form ref={myAppContext.createCardFormRef} onSubmit={myAppUpdateContext.handleCreateCard}>
                    Question:
                    <input type="text" autoComplete="off" name="question" autoFocus required minLength="1" />
                    Answer:
                    <input type="text" autoComplete="off" name="answer" required minLength="1" />
                    Card (Id) To Follow:
                    <input id="card_id" type="number" name="cardToFollow" minLength="1" />
                    <br/>
                    <button type="submit" >Create Card</button>
                </form>
            </div>
        )
    }
    return (
        <div className="container">
            < CreateCardWidget />
            < CurrentCardsTable />
            < ToastContainer />
        </div>
    );
}

export const CreateCardsPage = () => {
    return (
        <div>
            < PageHeader pageTitle="Create Card" />
            < CreateCardsPageBody />
        </div>
    );
};
