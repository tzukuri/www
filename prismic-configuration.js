module.exports = {

  apiEndpoint: 'https://your-repo-name.prismic.io/api',

  // -- Access token if the Master is not open
  accessToken: 'MC5XVWlHRGljQUFGMVUwT2FU.77-977-977-9Te-_ve-_vVMKdEBo77-9a--_ve-_ve-_vUbvv73vv73vv73vv709Ae-_ve-_ve-_vUzvv73vv71q77-977-9',

  // OAuth
  clientId: 'WUiGDicAALR40OaS',
  clientSecret: 'a0f1839a0baf235c447993cf8623c4c0',

  // -- Links resolution rules
  // This function will be used to generate links to Prismic.io documents
  // As your project grows, you should update this function according to your routes
  linkResolver: function(doc, ctx) {
    if (doc.type == 'page' && doc.uid != 'homepage') {
        return '/' + doc.uid;
    }
    return '/';
  }
};
