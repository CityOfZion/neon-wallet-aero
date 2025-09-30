export class QueryParamsHelper {
  static getUrlWithoutQueryParams(url: string): string {
    const index = url.lastIndexOf('?')

    return index === -1 ? url : url.slice(0, index)
  }
}
