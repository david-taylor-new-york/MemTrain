import { React, useState, useEffect } from 'react'
import { PageHeader, SubmitButton } from '../Components'
import { useMyAppContext, useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import { getSubjectsBy } from '../../utils/httpClient'
import { ToastContainer } from 'react-toastify'
import '../commonStyles.css'

<ToastContainer id="toast_container" />

export const SubjectPage = () => {

    return (
        <div>
            < PageHeader pageTitle="Choose Subject" />
            < SubjectPageBody />
        </div>
    )
}

const SubjectPageBody = () => {
    const myAppContext = useMyAppContext()
    const myAppUpdateContext = useMyAppUpdateContext()
    const showSubmitButton = (myAppContext.subjectName !== "unselected")

    return (
        <div className="container">
            < SubjectsDropdown />
            < SubmitButton showButton={showSubmitButton} onClick={() => myAppUpdateContext.updateCurrentPageTo("MainMenuPage")}> Select </SubmitButton>
            <br />
            < CreateSubjectForm />
            < ToastContainer />
        </div>
    )
}

const SubjectsDropdown = () => {
    const myAppUpdateContext = useMyAppUpdateContext() // Use the app context hook directly
    const myAppContext = useMyAppContext()
    const [subjects, setSubjects] = useState([])
    let defaultValue = myAppContext.subjectName
    if (myAppContext.subjectName === "unselected") { defaultValue = 'Select a subject' }

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
                <select value={defaultValue} onChange={myAppUpdateContext.handleSubjectChange}>
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
        <div>
            <form >
                <label>
                    or create new:{" "}
                    <input id="newSubjectName" name="newSubjectName" type="text" autoComplete="off" ref={myAppContext.newSubjectNameFormRef} autoFocus required minLength="1" />
                </label>
                <button id="add-button" type="text" onClick={myAppUpdateContext.handleCreateSubject} > Add </button>
            </form>
        </div>
    )
}
