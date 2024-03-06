import React from 'react'
import { useMyAppContext, useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import { PageHeader, CurrentCardsTable } from '../Components'
import { ToastContainer } from 'react-toastify'
import '../commonStyles.css'

export const CreateCardsPage = () => {
    const myAppUpdateContext = useMyAppUpdateContext()
    const myAppContext = useMyAppContext()

    const CreateCardWidget = () => {
        return (
            <div className="create-card-form" >
                <form ref={myAppContext.createCardFormRef} onSubmit={myAppUpdateContext.handleCreateCard}>
                    Question:
                    <input type="text" autoComplete="off" name="question" autoFocus required minLength="1" />
                    Answer:
                    <input type="text" autoComplete="off" name="answer" required minLength="1" />
                    Card (Id) To Follow:
                    <input id="card_id" type="number" name="cardToFollow" minLength="1" />
                    <br/>
                    <button type="submit" className="button">Create Card</button>
                </form>
                <hr />
            </div>
        )
    }

    const PageBody = () => {
        return (
            <div className="container">
                <CreateCardWidget />
                <CurrentCardsTable />
                <ToastContainer />
            </div>
        );
    }

    return (
        <div>
            <PageHeader pageTitle="Create Card" previousPage="CardMenuPage" />
            <PageBody />
        </div>
    )
}
