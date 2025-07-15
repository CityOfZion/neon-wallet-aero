import PlusIcon from '../../assets/images/tb-plus.svg?react'

type Props = {
  onPrimary?: () => void
  title?: string
  ctaLabel?: string
}

export default function ConnectionEmptyState({
  onPrimary,
  title = 'No dApps connected',
  ctaLabel = 'Connect a dApp',
}: Props) {
  return (
    <div
      style={{
        maxWidth: 414,
        height: 'min(585px, calc(100vh - 40px))',
        margin: '20px auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        background: '#333D46',
        borderRadius: 16,
      }}
    >
      <h2
        style={{
          fontSize: 19,
          lineHeight: '28px',
          fontWeight: 400,
          color: '#B0C0C8',
          textAlign: 'center',
          margin: '0 0 24px 0',
        }}
      >
        {title}
      </h2>

      <button
        onClick={onPrimary}
        aria-label={ctaLabel}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          padding: '0 24px',
          minHeight: 56,
          borderRadius: 16,
          border: '1.5px dashed #B0C0C8',
          background: 'transparent',
          color: '#FFFFFF',
          fontSize: 14,
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        <PlusIcon style={{ width: 20, height: 20 }} />
        <span>{ctaLabel}</span>
      </button>
    </div>
  )
}
