import zod from 'zod'

const uInt160Schema = zod.string().regex(/^(0x)?[0-9a-fA-F]{40}$/, 'Invalid UInt160')
const uInt256Schema = zod.string().regex(/^(0x)?[0-9a-fA-F]{64}$/, 'Invalid UInt256')
const ecPointSchema = zod.string().min(1)
const base64Schema = zod.string()
const integerSchema = zod.union([zod.number(), zod.string()])

const contractParameterTypeSchema = zod.enum([
  'Any',
  'Boolean',
  'Integer',
  'ByteArray',
  'String',
  'Hash160',
  'Hash256',
  'PublicKey',
  'Signature',
  'Array',
  'Map',
  'InteropInterface',
  'Void',
])

const argumentSchema = zod.object({
  type: contractParameterTypeSchema,
  value: zod.any().optional(),
})

const witnessRuleSchema = zod.object({
  action: zod.enum(['Deny', 'Allow']),
  condition: zod.looseObject({ type: zod.string() }),
})

const signerSchema = zod.object({
  account: uInt160Schema,
  scopes: zod.string().min(1),
  allowedContracts: zod.array(uInt160Schema).optional(),
  allowedGroups: zod.array(ecPointSchema).optional(),
  rules: zod.array(witnessRuleSchema).optional(),
})

const transactionAttributeSchema = zod.union([
  zod.object({ type: zod.literal('HighPriority') }),
  zod.object({
    type: zod.literal('OracleResponse'),
    id: zod.number(),
    code: zod.string(),
    result: base64Schema.optional(),
  }),
])

const invocationArgumentsSchema = zod.object({
  hash: uInt160Schema,
  operation: zod.string().min(1),
  args: zod.array(argumentSchema).optional(),
  abortOnFail: zod.boolean().optional(),
})

const transactionOptionsSchema = zod.object({
  suggestedSystemFee: integerSchema.optional(),
  extraSystemFee: integerSchema.optional(),
  validUntilBlock: zod.number().optional(),
})

const contractParametersContextSchema = zod.object({
  type: zod.literal('Neo.Network.P2P.Payloads.Transaction'),
  hash: uInt256Schema,
  data: base64Schema,
  items: zod.record(
    zod.string(),
    zod.object({
      script: base64Schema,
      parameters: zod.array(argumentSchema),
      signatures: zod.record(zod.string(), base64Schema),
    })
  ),
  network: zod.number(),
})

const signOptionsSchema = zod.object({
  isBase64Encoded: zod.boolean().optional(),
  isTypedData: zod.boolean().optional(),
  isLedgerCompatible: zod.boolean().optional(),
})

const authenticationChallengePayloadSchema = zod.object({
  action: zod.literal('Authentication'),
  grant_type: zod.literal('Signature'),
  allowed_algorithms: zod.tuple([zod.literal('ECDSA-P256')]),
  domain: zod.string().min(1),
  networks: zod.array(zod.number()),
  nonce: zod.string().min(1),
  timestamp: zod.number(),
})

export const neo3DapiProviderArgsSchemaByMethod = {
  authenticate: zod.tuple([authenticationChallengePayloadSchema]),
  getAccounts: zod.tuple([]),
  pickAddress: zod.tuple([zod.string().optional()]),
  getBalance: zod.tuple([uInt160Schema, uInt160Schema]),
  send: zod.tuple([uInt160Schema, uInt160Schema, uInt160Schema, integerSchema, argumentSchema.optional()]),
  call: zod.tuple([invocationArgumentsSchema]),
  invoke: zod.tuple([
    zod.array(invocationArgumentsSchema).nonempty(),
    zod.array(signerSchema).optional(),
    zod.array(transactionAttributeSchema).optional(),
    transactionOptionsSchema.optional(),
  ]),
  makeTransaction: zod.tuple([
    zod.array(invocationArgumentsSchema).nonempty(),
    zod.array(signerSchema).optional(),
    zod.array(transactionAttributeSchema).optional(),
    transactionOptionsSchema.optional(),
  ]),
  sign: zod.tuple([contractParametersContextSchema]),
  signMessage: zod.tuple([
    zod.union([zod.string(), base64Schema]),
    uInt160Schema.optional(),
    signOptionsSchema.optional(),
  ]),
  relay: zod.tuple([contractParametersContextSchema]),
  getBlock: zod.tuple([zod.union([zod.number(), uInt256Schema])]),
  getBlockCount: zod.tuple([]),
  getTransaction: zod.tuple([uInt256Schema]),
  getApplicationLog: zod.tuple([uInt256Schema]),
  getStorage: zod.tuple([uInt160Schema, base64Schema]),
  getTokenInfo: zod.tuple([uInt160Schema]),
} satisfies Record<string, zod.ZodType>
