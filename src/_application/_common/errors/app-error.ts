class AppError {
  public readonly message: string

  public readonly statusCode: number

  public readonly errorDetail: string

  constructor(message: string, statusCode = 400, errorDetail = '') {
    this.message = message
    this.statusCode = statusCode
    this.errorDetail = errorDetail
  }
}

export default AppError
