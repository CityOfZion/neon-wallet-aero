import type {
  TMessageApiListener,
  TMessageApiSendArgs,
  TMessageApiSendResponse,
  TMessageBackgroundApi,
  TMessageRendererApi,
} from './api'

const handlers = new Map<keyof TMessageRendererApi, TMessageApiListener<any, any>>()

async function send<
  K extends keyof TMessageBackgroundApi = keyof TMessageBackgroundApi,
  T extends TMessageApiSendArgs<TMessageBackgroundApi[K]> = TMessageApiSendArgs<TMessageBackgroundApi[K]>,
  R extends TMessageApiSendResponse<TMessageBackgroundApi[K]> = TMessageApiSendResponse<TMessageBackgroundApi[K]>,
>(...args: T extends undefined ? [K] | [K, T] : [K, T]): Promise<R> {
  const channel = args[0]
  const params = args[1]

  const response = await chrome.runtime.sendMessage({
    type: channel,
    from: 'renderer',
    args: params,
  })

  if (response?.error) {
    throw new Error(response?.error)
  }

  return (response || undefined) as R
}

function listen<
  K extends keyof TMessageRendererApi = keyof TMessageRendererApi,
  L extends TMessageRendererApi[K] = TMessageRendererApi[K],
>(type: K, handler: L) {
  handlers.set(type, handler)

  return () => {
    handlers.delete(type)
  }
}

async function handleMessage(message: any, sender: any, sendResponse: any) {
  const handler = handlers.get(message.type)

  if (!handler) {
    return sendResponse({ error: `No handler registered for message type: ${message.type}` })
  }

  try {
    const result = await handler({
      args: message?.args,
      sender,
    })

    return sendResponse(result)
  } catch (error: any) {
    return sendResponse({ error: error?.message })
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.from === 'background') {
    handleMessage(message, sender, sendResponse)
    return true
  }

  return false
})

export const rendererApi = {
  send,
  listen,
}
