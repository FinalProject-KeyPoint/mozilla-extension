import Mercury from '@postlight/mercury-parser'

const cnnindonesiaExtractor = {
    domain: 'cnnindonesia.com',
    title: {
        selectors: ['.title']
    },
    author: {
        selectors: ['.detail_text > b']
    },
    content: {
        selectors: ['.detail_text']
    }
}

Mercury.addExtractor(cnnindonesiaExtractor);

export default Mercury;