import { backgroundApi } from '@shared/message-api/background'

export function registerPopupHandlers() {
  backgroundApi.listen('popup:open', async () => {
    chrome.action.openPopup()
  })
}
