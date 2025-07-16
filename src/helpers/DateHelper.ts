export class DateHelper {
  static getNowUnix = (): number => {
    return Date.now() / 1000
  }
}
