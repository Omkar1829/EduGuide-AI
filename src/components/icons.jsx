// Lightweight inline icons so we don't need another icon library.
const baseProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export const HomeIcon = (p) => (
  <svg {...baseProps} {...p}>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <path d="M9 22V12h6v10" />
  </svg>
)
export const BookIcon = (p) => (
  <svg {...baseProps} {...p}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
)
export const UserIcon = (p) => (
  <svg {...baseProps} {...p}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)
export const SettingsIcon = (p) => (
  <svg {...baseProps} {...p}>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)
export const LogoutIcon = (p) => (
  <svg {...baseProps} {...p}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="m16 17 5-5-5-5" />
    <path d="M21 12H9" />
  </svg>
)
export const BookmarkIcon = ({ filled, ...p }) => (
  <svg
    {...baseProps}
    fill={filled ? 'currentColor' : 'none'}
    {...p}
  >
    <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
)
export const StarIcon = (p) => (
  <svg {...baseProps} fill="currentColor" stroke="none" {...p}>
    <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
  </svg>
)
export const ClockIcon = (p) => (
  <svg {...baseProps} {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
)
export const PlayIcon = (p) => (
  <svg {...baseProps} fill="currentColor" stroke="none" {...p}>
    <path d="m8 5 11 7-11 7z" />
  </svg>
)
export const CheckIcon = (p) => (
  <svg {...baseProps} {...p}>
    <path d="m5 13 4 4L19 7" />
  </svg>
)
export const SearchIcon = (p) => (
  <svg {...baseProps} {...p}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
)
export const ChevronLeftIcon = (p) => (
  <svg {...baseProps} {...p}>
    <path d="m15 18-6-6 6-6" />
  </svg>
)
export const ChevronRightIcon = (p) => (
  <svg {...baseProps} {...p}>
    <path d="m9 18 6-6-6-6" />
  </svg>
)
export const MenuIcon = (p) => (
  <svg {...baseProps} {...p}>
    <path d="M3 6h18" />
    <path d="M3 12h18" />
    <path d="M3 18h18" />
  </svg>
)
export const CloseIcon = (p) => (
  <svg {...baseProps} {...p}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
)
export const FireIcon = (p) => (
  <svg {...baseProps} {...p}>
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c1.38 0 2.5-1.12 2.5-2.5 0-1.52-1-2.5-3-5.5 4 1.5 6 4 6 7.5a6.5 6.5 0 1 1-13 0c0-3.5 3-7 5-9 0 2 2 4 2 4.5z" />
  </svg>
)
export const TrophyIcon = (p) => (
  <svg {...baseProps} {...p}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0z" />
  </svg>
)
