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

const kompasExtractor = {
    domain: 'kompas.com',
    title: {
        selectors: ['.read__title']
    },
    author: {
        selectors: ['#penulis > a']
    },
    content: {
        selectors: ['.read__content'],
        clean: [
            'p > strong',
            '.ads-on-body',
            '.twitter-tweet'
        ]
    }
}

Mercury.addExtractor(cnnindonesiaExtractor);
Mercury.addExtractor(kompasExtractor);

export default Mercury;