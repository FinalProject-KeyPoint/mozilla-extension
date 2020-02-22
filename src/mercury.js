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

const tribunExtractor = {
    domain: "tribunnews.com",
    title: {
        selectors: ['#arttitle']
    },
    author: {
        selectors: []
    },
    content: {
        selectors: ['.txt-article'],
        clean: [
            '.txt-article > h4',
            'strong:first-of-type'
        ]
    },
    next_page_url: {
        selectors: ['.paging a']
    }
}

Mercury.addExtractor(cnnindonesiaExtractor);
Mercury.addExtractor(kompasExtractor);
Mercury.addExtractor(tribunExtractor);

export default Mercury;