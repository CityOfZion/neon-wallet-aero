import { rendererApi } from '@shared/message-api/renderer'

export class StoreReviewHelper {
  static readonly #chromeStoreReviewUrl = `https://chromewebstore.google.com/detail/${chrome.runtime.id}/reviews`

  static openReview() {
    rendererApi.send('tab:open', { href: this.#chromeStoreReviewUrl })
  }
}
