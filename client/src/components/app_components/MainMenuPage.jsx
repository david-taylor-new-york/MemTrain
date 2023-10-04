import React from 'react'
import { useMyAppContext, useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import { useMyTrainingUpdateContext } from '../../contexts/TrainingContextProvider'
import { LogOutButton } from '../Components'

  export const MainMenuPage = () => {
    const myAppContext = useMyAppContext()
    const myAppUpdateContext = useMyAppUpdateContext()
    const myTrainingUpdateContext = useMyTrainingUpdateContext()
    
    const SubjectPageButton = () => {
        return (
            <input type="button" className="button-main-css" order="1" defaultValue="Change Subject" onClick={ () => { myAppUpdateContext.updateCurrentPageTo( "SubjectPage" ) }} />
        )
    }

    const CardMenuPageButton = () => {
        return (
            <input type="button" className="button-main-css" order="2" defaultValue="Update Cards" onClick={ () => { myAppUpdateContext.updateCurrentPageTo( "CardMenuPage" ) }} />
        )
    }

    const TrainingMenuPageButton = () => {
        return (
            <input type="button" className="button-main-css" order="4" defaultValue="Training" progress="10" onClick={ () => { myTrainingUpdateContext.loadTrainingMenuPage() }} />
        )
    }

    return (
        <>
            <div>
                < LogOutButton />
                <h5> Subject: { myAppContext.subjectName } </h5>
                <h3> Main Menu </h3>
                <hr/>
                <br/>
                <div>
                    < SubjectPageButton />
                    < CardMenuPageButton />
                    < TrainingMenuPageButton />
                </div>
                <br/>
            </div>
        </>
    )
}
