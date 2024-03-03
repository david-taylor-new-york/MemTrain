import { React, useState, useEffect } from 'react'
import { useMyAppContext, useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import { LogOutButton, BackButton } from '../Components'
import { getSubjectsBy } from '../../utils/httpClient'
import { ToastContainer } from 'react-toastify'
import '../commonStyles.css'

export const SubjectPage = () => {
    const myAppContext = useMyAppContext()
    const myAppUpdateContext = useMyAppUpdateContext()

    const Header = () => {
        const myAppContext = useMyAppContext()

        if (myAppContext.subjectName === "unselected") {
            return (
                <>
                    < LogOutButton />
                </>
            )
        } else {
            return (
                <>
                    < BackButton previousPage="MainMenuPage" />
                    < LogOutButton />
                </>
            )
        }
    }

    const ChooseSubjectForm = () => {

        if (myAppContext.subjectName === "unselected") {
            return (
                SubjectsDropdown('Select a subject')
            )
        } else {
            return (
                SubjectsDropdown(myAppContext.subjectName)
            )
        }
    }

    const SubjectsDropdown = (defaultValue) => {
        const myAppContext = useMyAppContext()
        const [subjects, setSubjects] = useState([])

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
            <div className="subject-dropdown">
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

    function SubmitButton() {

        if (myAppContext.subjectName !== 'unselected') {

            return (
                <div >
                    <button className="button" type="button" onClick={() => { myAppUpdateContext.updateCurrentPageTo("MainMenuPage") }}> Select </button>
                </div>
            )
        }
    }

    function CreateSubject() {

        return (
            <form >
                <label>
                    or create new:{" "}
                    <input type="text" autoComplete="off" ref={myAppContext.newSubjectNameFormRef} id="newSubjectName" name="newSubjectName" autoFocus required minLength="1" />
                </label>
                <button id="add-button" type="text" onClick={myAppUpdateContext.handleCreateSubject} > Add </button>
            </form>
        )
    }

    return (
        <div className="container">
            <div>
                < Header />
                <h4 className="subject-sub-header"> Subject: {myAppContext.subjectName}</h4>
            </div>
            <div>
                <h3 className="page-title">Select Subject</h3>
                < ChooseSubjectForm />
            </div>
            < SubmitButton />
            <hr />
            < CreateSubject />
            < ToastContainer />
        </div>
    )
}
