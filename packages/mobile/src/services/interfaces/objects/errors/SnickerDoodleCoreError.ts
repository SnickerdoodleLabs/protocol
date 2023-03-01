import errorCodes from './errorCodes'

export class SnickerDoodleCoreError extends Error {
  protected errorCode: string = errorCodes[SnickerDoodleCoreError.name]
  constructor(message?: string, public src?: unknown) {
    super(message)
  }
}
