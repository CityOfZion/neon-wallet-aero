import type {
  TMessageApiListener,
  TMessageApiSendArgs,
  TMessageApiSendResponse,
  TMessageBackgroundApi,
  TMessageRendererApi,
} from './api'

const handlers = new Map<keyof TMessageBackgroundApi, TMessageApiListener<any, any>>()

async function send<
  K extends keyof TMessageRendererApi = keyof TMessageRendererApi,
  T extends TMessageApiSendArgs<TMessageRendererApi[K]> = TMessageApiSendArgs<TMessageRendererApi[K]>,
  R extends TMessageApiSendResponse<TMessageRendererApi[K]> = TMessageApiSendResponse<TMessageRendererApi[K]>,
>(...args: T extends undefined ? [K] | [K, T] : [K, T]): Promise<R> {
  const channel = args[0]
  const params = args[1]

  const response = await chrome.runtime.sendMessage({
    type: channel,
    from: 'background',
    args: params,
  })

  if (response?.error) {
    throw new Error(response?.error)
  }

  return (response ?? undefined) as R
}

function listen<
  K extends keyof TMessageBackgroundApi = keyof TMessageBackgroundApi,
  L extends TMessageBackgroundApi[K] = TMessageBackgroundApi[K],
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
  if (message.from === 'renderer') {
    handleMessage(message, sender, sendResponse)
    return true
  }

  return false
})

export const backgroundApi = {
  listen,
  send,
}
