/**
 *  a minimal ajax lib
 *  @author chaoshuai
 *  @data   2018/3/6
 */
(function(window) {
    // 主函数
    function ajax(options) {
        // 参数列表
        var url              = options.url       ||  '',
            method           = options.method    ||  'get',
            data             = options.data      ||  null,
            headers          = options.headers   ||  [],
            success_callback = options.success   ||  function () {},
            fail_callback    = options.fail      ||  function () {},
            async            = options.async     ||  true;

        // XHR
        var xhr = new XMLHttpRequest();
        url = dataToGetUrl(method, url, data);
        xhr.open(method, url, async);
        setHeaders(xhr, headers);
        xhr.send(objectToQueryString(data));

        // 监听
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4){
                if (xhr.status >= 200 && xhr.status < 300){
                    success_callback(parseResponse(xhr.responseText));
                } else {
                    fail_callback('出错了');
                }
            }
        }
    }
    // 设置post请求头部信息
    function setHeaders (xhr, headers) {
        headers = headers || {};
        if (!hasContentType(headers)) {
            headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }
        Object.keys(headers).forEach(function (name) {
            (headers[name] && xhr.setRequestHeader(name, headers[name]));
        })
    }
    // 检测 content-type 是否设置
    function hasContentType (headers) {
        return Object.keys(headers).some(function (name) {
            return name.toLowerCase() === 'content-type'
        })
    }

    // 处理get请求时，所携带数据进行URl拼接
    function dataToGetUrl (method, url, data) {

        if (method.toLowerCase() !== 'get' || !data) return url;
        var urlSegment = objectToQueryString(data);
        var urlSeparator = url.indexOf('?') > -1 ? '&' : '?';
        return url + urlSeparator + urlSegment;
    }

    // 对象格式化成url参数   {a:1,b:2} => 'a=1&b=2'
    function objectToQueryString (obj) {
        var queryString = '';
         Object.keys(obj).forEach(function (item) {
             queryString += '&' + encodeURIComponent(item) + '=' + encodeURIComponent(obj[item]);
        });
        return queryString.replace(/&/, '')
    }

    // 解析响应数据
    function parseResponse (xhr) {
        var result;
        try {
            result = JSON.parse(xhr.responseText);
        } catch (e) {
            result = xhr.responseText;
        }
        return result;
    }

    window.ajax = ajax;
})(window);