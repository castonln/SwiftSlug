export const TitlePageNodeNames = {
  TITLE: 'title-page-title',
  CREDIT: 'title-page-credit',
  AUTHOR: 'title-page-author',
  SOURCE: 'title-page-source',
  CONTACT: 'title-page-contact',
  DATE: 'title-page-date',
} as const

export type NodeName = typeof TitlePageNodeNames[keyof typeof TitlePageNodeNames];