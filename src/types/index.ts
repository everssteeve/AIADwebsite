// src/types/index.ts

export type {
  HeroContent,
  HeroContentInput,
  HeroContentUpdate,
  HeroMetadata,
} from './hero'

export type {
  BenefitItem,
  BenefitItemInput,
  BenefitItemUpdate,
  BenefitItemList,
  BenefitIcon,
} from './benefit'

export { BENEFIT_ICONS } from './benefit'

export type {
  StatItem,
  StatItemInput,
  StatItemUpdate,
  StatItemList,
  StatUnit,
} from './stat'

export { STAT_UNITS } from './stat'

export type {
  NavigationItem,
  NavigationItemInput,
  NavigationItemUpdate,
  NavigationTree,
  NavigationSection,
  NavigationBadge,
  BreadcrumbItem,
  BreadcrumbList,
  TableOfContentsItem,
  TableOfContentsList,
  TOCHeadingDepth,
  PrevNextItem,
  PrevNextLinks,
  FlatNavigationItem,
  FlatNavigationList,
} from './navigation'

export {
  NAVIGATION_SECTIONS,
  NAVIGATION_BADGES,
  MAX_NAVIGATION_DEPTH,
  TOC_HEADING_DEPTHS,
} from './navigation'
