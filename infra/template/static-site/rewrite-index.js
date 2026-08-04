function toQueryString(querystring) {
    var parts = [];
    querystring = querystring || {};

    // Preserve query strings when redirecting Storybook URLs such as
    // /branch/foo?path=/docs/... .
    for (var key in querystring) {
        if (querystring[key].multiValue) {
            querystring[key].multiValue.forEach(function (item) {
                parts.push(key + '=' + item.value);
            });
        } else {
            parts.push(key + '=' + querystring[key].value);
        }
    }

    return parts.length ? '?' + parts.join('&') : '';
}

function handler(event) {
    var request = event.request;
    var uri = request.uri;

    // Append index.html to directory-style requests so a private S3 origin
    // (served via OAC, which has no website-endpoint index document behavior)
    // resolves "/path/" and "/path" to "/path/index.html".
    if (uri.endsWith('/')) {
        request.uri = uri + 'index.html';
        return request;
    }

    // Redirect extensionless directory URLs to their trailing-slash form so
    // relative Storybook manager assets resolve under the branch prefix.
    if (!uri.includes('.')) {
        return {
            statusCode: 301,
            statusDescription: 'Moved Permanently',
            headers: {
                location: {
                    value: uri + '/' + toQueryString(request.querystring)
                }
            }
        };
    }

    return request;
}
