interface AvatarProps {
  pose?: 'default' | 'thinking' | 'presenting' | 'analyzing'
  className?: string
}

export default function Avatar({ pose = 'default', className = '' }: AvatarProps) {
  return (
    <svg
      viewBox="0 0 200 280"
      className={`w-full h-full ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Head */}
      <ellipse cx="100" cy="80" rx="45" ry="50" fill="#e8dcc8" />

      {/* Hair */}
      <path
        d="M 55 60 Q 55 20 100 15 Q 145 20 145 60 Q 145 50 130 40 Q 115 30 100 28 Q 85 30 70 40 Q 55 50 55 60"
        fill="#2c2c2c"
      />

      {/* Hair Volume/Pompadour */}
      <path
        d="M 75 25 Q 85 10 100 8 Q 115 10 125 25"
        fill="#1a1a1a"
      />

      {/* Eyes */}
      <g>
        {/* Left Eye */}
        <ellipse cx="80" cy="75" rx="8" ry="12" fill="#fff" />
        <circle cx="80" cy="77" r="6" fill="#8b6f47" />
        <circle cx="82" cy="74" r="3" fill="#1a1a1a" />

        {/* Right Eye */}
        <ellipse cx="120" cy="75" rx="8" ry="12" fill="#fff" />
        <circle cx="120" cy="77" r="6" fill="#8b6f47" />
        <circle cx="122" cy="74" r="3" fill="#1a1a1a" />

        {/* Eyebrows */}
        <path
          d="M 70 65 Q 80 62 90 63"
          stroke="#2c2c2c"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 110 63 Q 120 62 130 65"
          stroke="#2c2c2c"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </g>

      {/* Nose */}
      <line x1="100" y1="70" x2="100" y2="95" stroke="#d4b896" strokeWidth="2" />

      {/* Mouth */}
      {pose === 'thinking' && (
        <path
          d="M 85 110 Q 100 115 115 110"
          stroke="#c9836d"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      )}
      {pose === 'presenting' && (
        <path
          d="M 80 108 Q 100 120 120 108"
          stroke="#c9836d"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      )}
      {pose === 'analyzing' && (
        <path
          d="M 85 112 Q 100 118 115 112"
          stroke="#c9836d"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      )}
      {pose === 'default' && (
        <path
          d="M 85 110 Q 100 113 115 110"
          stroke="#c9836d"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      )}

      {/* Beard */}
      <path
        d="M 65 95 Q 100 115 135 95"
        stroke="#3c3c3c"
        strokeWidth="2"
        fill="none"
        opacity="0.4"
      />

      {/* Neck */}
      <rect x="85" y="125" width="30" height="20" fill="#e8dcc8" />

      {/* Shoulders & Body */}
      {pose === 'thinking' && (
        <>
          {/* Tilted head position */}
          <g transform="translate(-5, 0)">
            {/* Left shoulder */}
            <path
              d="M 70 145 Q 60 160 55 180"
              stroke="#1a1a1a"
              strokeWidth="35"
              fill="none"
              strokeLinecap="round"
            />
            {/* Right shoulder */}
            <path
              d="M 130 145 Q 140 160 145 180"
              stroke="#1a1a1a"
              strokeWidth="35"
              fill="none"
              strokeLinecap="round"
            />
          </g>
          {/* Shirt detail */}
          <rect x="50" y="175" width="100" height="80" rx="5" fill="#0f0f0f" />
          <line x1="100" y1="175" x2="100" y2="255" stroke="#1a1a1a" strokeWidth="1" opacity="0.5" />
        </>
      )}
      {pose === 'presenting' && (
        <>
          {/* Open chest position */}
          <path
            d="M 70 145 Q 50 165 45 190"
            stroke="#1a1a1a"
            strokeWidth="35"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 130 145 Q 150 165 155 190"
            stroke="#1a1a1a"
            strokeWidth="35"
            fill="none"
            strokeLinecap="round"
          />
          <rect x="45" y="185" width="110" height="75" rx="5" fill="#0f0f0f" />
          {/* Open hands gesture */}
          <circle cx="35" cy="220" r="8" fill="#e8dcc8" />
          <circle cx="165" cy="220" r="8" fill="#e8dcc8" />
        </>
      )}
      {pose === 'analyzing' && (
        <>
          {/* Focused position */}
          <path
            d="M 70 145 Q 65 160 60 180"
            stroke="#1a1a1a"
            strokeWidth="35"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 130 145 Q 135 160 140 180"
            stroke="#1a1a1a"
            strokeWidth="35"
            fill="none"
            strokeLinecap="round"
          />
          <rect x="50" y="175" width="100" height="80" rx="5" fill="#0f0f0f" />
          {/* Hand to chin gesture */}
          <circle cx="75" cy="200" r="10" fill="#e8dcc8" />
        </>
      )}
      {pose === 'default' && (
        <>
          {/* Neutral position */}
          <path
            d="M 70 145 Q 65 160 60 185"
            stroke="#1a1a1a"
            strokeWidth="35"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 130 145 Q 135 160 140 185"
            stroke="#1a1a1a"
            strokeWidth="35"
            fill="none"
            strokeLinecap="round"
          />
          <rect x="50" y="180" width="100" height="75" rx="5" fill="#0f0f0f" />
        </>
      )}

      {/* Glasses (optional, can be toggled) */}
      <g opacity="0.8">
        {/* Left lens */}
        <rect x="68" y="70" width="20" height="16" rx="3" fill="none" stroke="#2c2c2c" strokeWidth="1.5" />
        {/* Right lens */}
        <rect x="112" y="70" width="20" height="16" rx="3" fill="none" stroke="#2c2c2c" strokeWidth="1.5" />
        {/* Bridge */}
        <line x1="88" y1="78" x2="112" y2="78" stroke="#2c2c2c" strokeWidth="1.5" />
      </g>

      {/* Shine/highlight */}
      <ellipse cx="90" cy="50" rx="12" ry="15" fill="#fff" opacity="0.1" />
    </svg>
  )
}
