module.exports = {
    apiEndpoint: 'https://tzukuri.prismic.io/api',
    accessToken: 'MC5XVWlHRGljQUFGMVUwT2FU.77-977-977-9Te-_ve-_vVMKdEBo77-9a--_ve-_ve-_vUbvv73vv73vv73vv709Ae-_ve-_ve-_vUzvv73vv71q77-977-9',

    // OAuth
    clientId: 'WUiGDicAALR40OaS',
    clientSecret: 'a0f1839a0baf235c447993cf8623c4c0',

    linkResolver: (doc, ctx) => {
        if (doc.uid == 'homepage')
            return '/'

        return '/' + doc.uid
    }
}
