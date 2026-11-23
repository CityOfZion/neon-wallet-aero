import { EnvHelper } from '@shared/helpers/EnvHelper'

export class CrispHelper {
  static get url() {
    return `https://go.crisp.chat/chat/embed/?website_id=${EnvHelper.VITE_CRISP_WEBSITE_ID}`
  }
}
