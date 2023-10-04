import React from 'react'
import { CurrentCardsTable, BackButton } from '../Components'
import { useMyAppContext, useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import { LogOutButton } from '../Components'

export const CardMenuPage = () => {
    const myAppContext = useMyAppContext()
    const myAppUpdateContext = useMyAppUpdateContext()

    const CreateCardsButton = () => {
        return (
            <input type="button" className="button-main-css" order="4" defaultValue="Create" progress="10" onClick={ () => { myAppUpdateContext.updateCurrentPageTo( "CreateCardsPage" ) }} />
        )
    }

    const EditCardsButton = () => {
        return (
            <input type="button" className="button-main-css" order="5" defaultValue="Edit" onClick={ () => { myAppUpdateContext.updateCurrentPageTo( "EditCardsPage" ) }} />
        )
    }

    const DeleteCardsButton = () => {
        return (
            <input type="button" className="button-main-css" order="5" defaultValue="Delete" onClick={ () => { myAppUpdateContext.updateCurrentPageTo( "DeleteCardsPage" ) }} />
        )
    }

    return (
        <>
            < BackButton previousPage="MainMenuPage" />
            < LogOutButton />
            <h5> Subject: { myAppContext.subjectName } </h5>
            <h3> Card Menu </h3>
            <hr/>
            <br/>
            <div>
                < CreateCardsButton />
                < EditCardsButton />
                < DeleteCardsButton />
            </div>
            <div>
                < CurrentCardsTable />
            </div>
        </>
    )
}
