export ContentfulConfig = {
    defaultLocale: 'en-AU',

    pages: {
        homepage: {
            layout: 'index',
            path: (page) => '/'
        },

        page: {
            layout: 'page',
            path: (page) => `/${page.fields.slug}`
        }

        post: {
            layout: 'post',
            path: (page) => `/blog/${page.fields.slug}`
        }
    }
}
