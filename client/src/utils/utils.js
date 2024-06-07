import { toast } from 'react-toastify'

export const wrongAnswerToast = (msg) => {
  toast.info(msg, { autoClose: 16000 })
}
export const showToast = (msg) => {
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
