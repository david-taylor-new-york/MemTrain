import { toast } from 'react-toastify'

export const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export const showLingeringToast = (msg) => {
    console.log("lingering toast...")
    toast.info(msg, { autoClose: 4000 })
}

export const showToast = (msg) => {
    console.log("regular toast...")
    toast.info(msg, { autoClose: 1000 })
}

export const getFibonacci = (n) => {
    if (n <= 0) {
        return 0
    } else if (n === 1) {
        return 1
    } else {
        return getFibonacci(n - 1) + getFibonacci(n - 2)
    }
}

export const formatDate = (date) => {
    const session_month = date.getMonth() + 1
    const session_start_date = date.getDate()
    const session_start_year = date.getFullYear().toString().slice(-2)

    return `${session_month}/${session_start_date}/${session_start_year}`
}

export const formatTime = (date) => {
    let hours = date.getHours()
    let minutes = date.getMinutes()
    let ampm = hours >= 12 ? 'pm' : 'am'

    hours = hours % 12
    hours = hours ? hours : 12
    minutes = minutes < 10 ? '0' + minutes : minutes

    return `${hours}:${minutes} ${ampm}`
}

export const calculatePercentCorrect = (trainingSession) => {
    let percentCorrect = 100
    if (trainingSession.first_pass_incorrect !== 0) {
        percentCorrect = Math.trunc(trainingSession.first_pass_correct / (trainingSession.first_pass_correct + trainingSession.first_pass_incorrect) * 100)
    }

    return `${percentCorrect}%`
}
