function handler(event) {
    var request = event.request;
    var uri = request.uri;

    // Append index.html to directory-style requests so a private S3 origin
    // (served via OAC, which has no website-endpoint index document behavior)
    // resolves "/path/" and "/path" to "/path/index.html".
    if (uri.endsWith('/')) {
        request.uri = uri + 'index.html';
    } else if (!uri.includes('.')) {
        request.uri = uri + '/index.html';
    }

    return request;
}
