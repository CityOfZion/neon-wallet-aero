import axios from 'axios'

import type { TClickupHelperCreateSupportTicketParams } from '@shared/types/helpers'

import { EnvHelper } from './EnvHelper'

export class ClickupHelper {
  static async createSupportTicket({ name, email, description }: TClickupHelperCreateSupportTicketParams) {
    const finalDescription = [`- Name: ${name}`, `- Email: ${email}`, '- Description:', description].join('\n')

    const normalPriority = 3

    await axios.post(
      `https://api.clickup.com/api/v2/list/${EnvHelper.VITE_CLICK_UP_LIST_ID}/task`,
      {
        name: `NWA - Help - ${name}`,
        markdown_content: finalDescription,
        tags: ['ProductSupport'],
        status: 'development',
        priority: normalPriority,
        assignees: [EnvHelper.VITE_CLICK_UP_ASSIGNEE_ID],
      },
      {
        headers: {
          Authorization: EnvHelper.VITE_CLICK_UP_KEY,
        },
      }
    )
  }
}
