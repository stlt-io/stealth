const intl = () => {
  return new Promise((resolve, reject) => {
    try {
      resolve({
        language: navigator.language,
        numberFormat: new Intl.NumberFormat(undefined, {
          notation: 'compact',
          compactDisplay: 'long'
        }).format(21000000),
        listFormat: new Intl.ListFormat(undefined, {
          style: 'long',
          type: 'disjunction'
        }).format(['0', '1']),
        displayNames: new Intl.DisplayNames(undefined, {
          type: 'language'
        }).of(navigator.language),
        dateTimeFormat: new Intl.DateTimeFormat(undefined, {
          month: 'long',
          timeZoneName: 'long'
        }).format(974_764_800_000),
        pluralRules: new Intl.PluralRules().select(1),
        relativeFormat: new Intl.RelativeTimeFormat(undefined, {
          localeMatcher: 'best fit',
          numeric: 'auto',
          style: 'long'
        }).format(1, 'day')
      })
    } catch (error) {
      reject(error)
    }
  })
}

export default intl
