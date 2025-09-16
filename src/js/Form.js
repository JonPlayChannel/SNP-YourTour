const selectors = {
    root: '[data-js-form]',
    formSelect: '[data-js-form-select]',
    formEmail: '[data-js-form-email]',
    formPhone: '[data-js-form-phone]',
    formDateForm: '[data-js-form-date-from]',
    formDateTo: '[data-js-form-date-to]',
}

const stateClasses = {
    notSelected: 'not-selected',
    invalid: 'invalid',
}

const rootElement = document.querySelector(selectors.root)
const formSelectElement = rootElement.querySelector(selectors.formSelect)
const formEmailElement = rootElement.querySelector(selectors.formEmail)
const formPhoneElement = rootElement.querySelector(selectors.formPhone)
const formDateFromElement = rootElement.querySelector(selectors.formDateForm)
const formDateToElement = rootElement.querySelector(selectors.formDateTo)

export const setInheritColorOnChange = () => {
    formSelectElement.addEventListener('change', () => {
        formSelectElement.classList.remove(stateClasses.notSelected)
    })
}

export const changeEmailInputStyles = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    let emailInputValue = formEmailElement.value

    formEmailElement.addEventListener('change', () => {
        if (!emailRegex.test(emailInputValue)) {
            formEmailElement.classList.add(stateClasses.invalid)
        }
    })

    formEmailElement.addEventListener('input', () => {
        formEmailElement.classList.remove(stateClasses.invalid)
    })

    formEmailElement.addEventListener('blur', () => {
        if (!emailRegex.test(emailInputValue)) {
            formEmailElement.classList.add(stateClasses.invalid)
        } else {
            formEmailElement.classList.remove(stateClasses.invalid)
        }
    })
}

export const formatPhoneNumber = () => {
    formPhoneElement.addEventListener('input', () => {
        const numbers = formPhoneElement.value.replace(/\D/g, '').substring(0, 11)

        const cleanNumbers = numbers.startsWith('7') || numbers.startsWith('8')
            ? numbers.substring(1)
            : numbers

        formPhoneElement.value = '+7'
            + (cleanNumbers.length > 0 ? ' (' + cleanNumbers.substring(0, 3) : '')
            + (cleanNumbers.length > 3 ? ') ' + cleanNumbers.substring(3, 6) : '')
            + (cleanNumbers.length > 6 ? '-' + cleanNumbers.substring(6, 8) : '')
            + (cleanNumbers.length > 8 ? '-' + cleanNumbers.substring(8, 10) : '')

        formPhoneElement.setSelectionRange(formPhoneElement.value.length, formPhoneElement.value.length);
    })
}

function validateDate(formDateElement) {
    if (!formDateElement) return false

    const value = formDateElement.value.trim()

    const dateRegex = /^(\d{2})\.(\d{2})\.(\d{4})$/
    if (!dateRegex.test(value)) {
        return false
    }

    const [, day, month, year] = value.match(dateRegex)
    const dayNum = parseInt(day, 10)
    const monthNum = parseInt(month, 10)
    const yearNum = parseInt(year, 10)

    if (dayNum < 1 || dayNum > 31) return false
    if (monthNum < 1 || monthNum > 12) return false
    if (yearNum < 1000 || yearNum > 9999) return false

    if (monthNum === 2 && dayNum > 29) return false
    if ([4, 6, 9, 11].includes(monthNum) && dayNum > 30) return false

    if (monthNum === 2 && dayNum === 29) {
        const isLeapYear = (yearNum % 4 === 0 && yearNum % 100 !== 0) || (yearNum % 400 === 0)
        if (!isLeapYear) return false
    }

    const inputDate = new Date(yearNum, monthNum - 1, dayNum)

    if (inputDate.getDate() !== dayNum ||
        inputDate.getMonth() !== monthNum - 1 ||
        inputDate.getFullYear() !== yearNum) {
        return false
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (inputDate < today) {
        return false
    }

    if (formDateElement === formDateToElement && formDateFromElement && formDateFromElement.value) {
        const fromValue = formDateFromElement.value.trim()
        if (dateRegex.test(fromValue)) {
            const [, fromDay, fromMonth, fromYear] = fromValue.match(dateRegex)
            const fromDate = new Date(parseInt(fromYear), parseInt(fromMonth) - 1, parseInt(fromDay))

            if (inputDate < fromDate) {
                return false
            }
        }
    }

    return true
}

function formatDate(formDateElement) {
    if (!formDateElement) return

    const cursorPosition = formDateElement.selectionStart
    let numbers = formDateElement.value.replace(/\D/g, '')
    numbers = numbers.substring(0, 8)

    let formatted = ''
    if (numbers.length > 0) formatted = numbers.substring(0, 2)
    if (numbers.length > 2) formatted += '.' + numbers.substring(2, 4)
    if (numbers.length > 4) formatted += '.' + numbers.substring(4, 8)

    formDateElement.value = formatted

    let newCursorPosition = cursorPosition
    if (cursorPosition === 3 && numbers.length >= 2) newCursorPosition = 4
    if (cursorPosition === 6 && numbers.length >= 4) newCursorPosition = 7
    formDateElement.setSelectionRange(newCursorPosition, newCursorPosition)

    if (formatted.length === 10) {
        const isValid = validateDate(formDateElement)
        if (isValid) {
            formDateElement.classList.remove(stateClasses.invalid)
        } else {
            formDateElement.classList.add(stateClasses.invalid)
        }
    } else {
        formDateElement.classList.remove(stateClasses.invalid)
    }
}

function validateDateWithAlert(formDateElement) {
    if (!formDateElement || !formDateElement.value) return

    const isValid = validateDate(formDateElement)
    if (!isValid) {
        if (formDateElement === formDateFromElement) {
            alert('Поле "Дата от" не может имеет значение раньше сегодняшнего дня')
        } else {
            if (formDateFromElement && formDateFromElement.value) {
                alert('Поле "Дата до" не может имеет значение раньше поля "Дата от"')
            } else {
                alert('Поле "Дата до" не может имеет значение раньше сегодняшнего дня')
            }
        }
        formDateElement.value = ''
        formDateElement.classList.remove(stateClasses.invalid)
    }
}

export function setupDateValidationListeners() {
    if (formDateFromElement) {
        formDateFromElement.addEventListener('input', function(e) {
            if (e.data && !/\d/.test(e.data)) {
                this.value = this.value.replace(/[^\d.]/g, '')
            }
            formatDate(this)
        })

        formDateFromElement.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault()
                validateDateWithAlert(this)
            }

            if (!e.ctrlKey && !e.altKey && !e.metaKey && e.key.length === 1 && !/\d/.test(e.key)) {
                e.preventDefault()
            }
        })

        formDateFromElement.addEventListener('blur', function() {
            validateDateWithAlert(this)
        })

        formDateFromElement.addEventListener('paste', function(e) {
            e.preventDefault()
            const pastedText = (e.clipboardData || window.clipboardData).getData('text')
            const numbers = pastedText.replace(/\D/g, '')
            this.value = this.value + numbers
            formatDate(this)
        })
    }

    if (formDateToElement) {
        formDateToElement.addEventListener('input', function(e) {
            if (e.data && !/\d/.test(e.data)) {
                this.value = this.value.replace(/[^\d.]/g, '')
            }
            formatDate(this)
        })

        formDateToElement.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault()
                validateDateWithAlert(this)
            }

            if (!e.ctrlKey && !e.altKey && !e.metaKey && e.key.length === 1 && !/\d/.test(e.key)) {
                e.preventDefault()
            }
        })

        formDateToElement.addEventListener('blur', function() {
            validateDateWithAlert(this)
        })

        formDateToElement.addEventListener('paste', function(e) {
            e.preventDefault()
            const pastedText = (e.clipboardData || window.clipboardData).getData('text')
            const numbers = pastedText.replace(/\D/g, '')
            this.value = this.value + numbers
            formatDate(this)
        })
    }
}