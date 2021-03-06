


### request_time 和 upstream_response_time 差别

`$request_time` 包含了用户数据接收时间，而真正程序的响应时间应该用 `$upstream_response_time`。

下面介绍下 2 者的差别：

1、request_time
官网描述：
> request processing time in seconds with a milliseconds resolution; time elapsed between the first bytes were read from the client and the log write after the last bytes were sent to the client 。

指的就是从接受用户请求的第一个字节到发送完响应数据的时间，即包括接收请求数据时间、程序响应时间、输出
响应数据时间。

2、upstream_response_time
官网描述：
> keeps times of responses obtained from upstream servers; times are kept in seconds with a milliseconds resolution. Several response times are separated by commas and colons like addresses in the $upstream_addr variable

是指从 Nginx 向后端（php-cgi) 建立连接开始到接受完数据然后关闭连接为止的时间。

从上面的描述可以看出，`$request_time` 肯定比 `$upstream_response_time` 值大，特别是使用 POST 方式传递参数时，因为 Nginx 会把 request body 缓存住，接受完毕后才会把数据一起发给后端。所以如果用户网络较差，或者传递数据较大时，`$request_time` 会比 `$upstream_response_time` 大很多。

所以如果使用 nginx 的 accesslog 查看 php 程序中哪些接口比较慢的话，记得在 log_format 中加入 `$upstream_response_time`。