import { React, useState, useEffect } from 'react'
import { PageHeader, SubmitButton } from '../Components'
import { useMyAppContext, useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import { getSubjectsBy } from '../../utils/httpClient'
import '../commonStyles.css'

export const SubjectPage = () => {

    return (
        <div className="page-container">
            <div className="page-section-container">
                < PageHeader pageTitle="Choose Subject" />
                < SubjectPageBody />
            </div>
        </div>
    )
}

const SubjectPageBody = () => {
    const myAppContext = useMyAppContext()
    const myAppUpdateContext = useMyAppUpdateContext()
    const showSubmitButton = (myAppContext.currentSubjectName !== "unselected")

    return (
        <div>
            <div className="page-section-container">
                < SubjectsDropdown />
                < SubmitButton showButton={showSubmitButton} onClick={() => myAppUpdateContext.updateCurrentPageTo("MainMenuPage")}> Select </SubmitButton>
                <br />
                < CreateSubjectForm />
            </div>
        </div>
    )
}

const SubjectsDropdown = () => {
    const myAppUpdateContext = useMyAppUpdateContext() // Use the app context hook directly
    const myAppContext = useMyAppContext()
    const [subjects, setSubjects] = useState([])
    let defaultValue = myAppContext.currentSubjectName
    if (myAppContext.currentSubjectName === "unselected") { defaultValue = 'Select a subject' }

    useEffect(() => {
        const subjects = []

        async function fetchData() {

            try {
                const response = await getSubjectsBy("user_id", myAppContext.userId)
                response.forEach((value) => {
                    subjects.push({
                        key: value.id,
                        value: value.subject_name,
                    })
                })

                setSubjects([
                    { key: new Date().getTime(), value: 'Select a subject' },
                    ...subjects
                ])

            } catch (error) {
                console.error('Error fetching subjects:', error)
            }
        }
        fetchData()
    }, [myAppContext.userId])

    return (
        <div>
            <label>
                <select
                    value={defaultValue}
                    onChange={myAppUpdateContext.handleSubjectChange}
                    className="select" >
                    {subjects.map((subject) => (
                        <option key={subject.key}> {subject.value} </option>
                    ))}
                </select>
            </label>
        </div>
    )
}

const CreateSubjectForm = () => {
    const myAppUpdateContext = useMyAppUpdateContext()
    const myAppContext = useMyAppContext()

    return (
        <div >
            <form ref={myAppContext.newSubjectNameFormRef} onSubmit={myAppUpdateContext.handleCreateSubject}>
                <label>
                    or create new:{" "}
                    <input id="newSubjectName" name="newSubjectName" type="text" autoComplete="off" autoFocus required minLength="1" />
                </label>
                <button className="submit-button" type="submit" > Add </button>
            </form>
        </div>
    )
}
