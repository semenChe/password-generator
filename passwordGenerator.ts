const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const DIGITS = '0123456789'
const SPECIAL = '!@#$%^&*'
const MIN_LENGTH = 8
const EVALUATION_TEMPLATES = {
    weak: 'Слабый',
    middle: 'Средний',
    reliable: 'Надёжный',
    veryReliable: 'Очень надёжный',
}

type GeneratePasswordOptions = {
  useUppercase?: boolean;
  useDigits?: boolean;
  useSpecial?: boolean;
};
type ReliabilityAssessment = 0 | 1 | 2 | 3 | 4 | 5

const nextRandom = (number: number) => (16807 * number) % 2147483647

const getReliabilityAssessmentText = (assessment: number) => {
    switch (assessment) {
        case 3:
            return EVALUATION_TEMPLATES.middle;
        case 4:
            return EVALUATION_TEMPLATES.reliable;
        case 5:
            return EVALUATION_TEMPLATES.veryReliable;
        default:
            return EVALUATION_TEMPLATES.weak;
    }
}

const generatePassword = (length: number, seed: number, options: GeneratePasswordOptions = {}) => {
    const {useUppercase = true, useDigits = true, useSpecial = false} = options;
    const defaultCurrentNumber = 1
    let alphabet = LOWERCASE
    let current = Math.abs(seed) || defaultCurrentNumber
    let result = ''

    if (useUppercase) {
        alphabet += UPPERCASE;
    }

    if (useDigits) {
        alphabet += DIGITS;
    }

    if (useSpecial) {
        alphabet += SPECIAL;
    }


    for (let i = 0; i < length; i += 1) {
        current = nextRandom(current);
        const index = current % alphabet.length;
        result  = result + alphabet[index]
    }

    return result
};

const checkPassword = (password: string) => {
    let reliabilityAssessment: ReliabilityAssessment = (password.length >= MIN_LENGTH) ? 1 : 0

    if (/[a-z]/.test(password)) {
        reliabilityAssessment += 1
    }

    if (/[A-Z]/.test(password)) {
        reliabilityAssessment += 1
    }

    if (SPECIAL.split('').some((char) => password.includes(char))) {
        reliabilityAssessment += 1
    }

    if (/\d/.test(password)) {
        reliabilityAssessment += 1
    }

    const reliabilityAssessmentText = getReliabilityAssessmentText(reliabilityAssessment)

    return `${reliabilityAssessmentText} пароль (оценка ${reliabilityAssessment} из 5)`
}

export {generatePassword, checkPassword}