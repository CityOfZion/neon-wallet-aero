export class PasswordHelper {
  static readonly minimumPasswordLength = 4

  static #hasMinimumGoodPasswordLength(password: string) {
    return password.length >= 24
  }

  static #getPasswordConditions = (password: string) => {
    let conditions = 0

    if (/[A-Z]/.test(password)) conditions++
    if (/[a-z]/.test(password)) conditions++
    if (/\d/.test(password)) conditions++
    if (/[^a-zA-Z\d]/.test(password)) conditions++

    return conditions
  }

  static isWeakPassword(password: string) {
    return password.length >= this.minimumPasswordLength
  }

  static isGoodPassword(password: string) {
    if (!PasswordHelper.isWeakPassword(password)) return false

    const conditions = PasswordHelper.#getPasswordConditions(password)

    return (
      conditions >= 3 ||
      (conditions >= 1 && PasswordHelper.#hasMinimumGoodPasswordLength(password)) ||
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(password)
    )
  }

  static isStrongPassword(password: string) {
    if (!PasswordHelper.isGoodPassword(password)) return false

    return (
      (PasswordHelper.#getPasswordConditions(password) >= 3 &&
        PasswordHelper.#hasMinimumGoodPasswordLength(password)) ||
      (password.length >= 16 &&
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).+$/.test(password))
    )
  }
}
