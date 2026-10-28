import 'server-only'

import { cookies, headers } from 'next/headers'
import Negotiator from 'negotiator'
import { match } from '@formatjs/intl-localematcher'
import type { Locale } from '.'
import { i18n } from '.'

export const getLocaleOnServer = async (): Promise<Locale> => {
  // @ts-expect-error locales are readonly
  const locales: string[] = i18n.locales

  let languages: string[] = []

  // Get locale from cookie
  const localeCookie = (await cookies()).get('locale')

  if (localeCookie?.value) {
    languages = [localeCookie.value]
  }

  // Get languages from browser headers
  if (!languages.length) {
    const negotiatorHeaders: Record<string, string> = {}
    const headersList = await headers()

    headersList.forEach((value, key) => {
      negotiatorHeaders[key] = value
    })

    languages = new Negotiator({
      headers: negotiatorHeaders,
    }).languages()
  }

  // Remove invalid locale values
  const validLanguages = languages.filter((language) => {
    try {
      Intl.getCanonicalLocales(language)
      return true
    }
    catch {
      return false
    }
  })

  // Match supported locale safely
  try {
    const matchedLocale = match(
      validLanguages,
      locales,
      i18n.defaultLocale,
    ) as Locale

    return matchedLocale
  }
  catch {
    return i18n.defaultLocale as Locale
  }
}
