


- 配置文件

[example file](https://github.com/docker/distribution/blob/master/cmd/registry/config-example.yml)

```
docker run -d -p 5000:5000 --restart=always --name registry \
             -v `pwd`/config.yml:/etc/docker/registry/config.yml \
             registry:2
```


详细：https://docs.docker.com/registry/configuration/

- 使用证书

```
docker run -d -p 5000:5000 --restart=always --name registry \
  -v `pwd`/certs:/certs \
  -e REGISTRY_HTTP_TLS_CERTIFICATE=/certs/domain.crt \
  -e REGISTRY_HTTP_TLS_KEY=/certs/domain.key \
  registry:2
```

```
docker pull ubuntu
docker tag ubuntu myregistrydomain.com:5000/ubuntu
docker push myregistrydomain.com:5000/ubuntu
docker pull myregistrydomain.com:5000/ubuntu
```

使用自签名证书：https://docs.docker.com/registry/insecure/


- Native basic auth

> Warning: You cannot use authentication with an insecure registry. You have to configure TLS first for this to work.


```
mkdir auth
docker run --entrypoint htpasswd registry:2 -Bbn testuser testpassword > auth/htpasswd

docker run -d -p 5000:5000 --restart=always --name registry \
  -v `pwd`/auth:/auth \
  -e "REGISTRY_AUTH=htpasswd" \
  -e "REGISTRY_AUTH_HTPASSWD_REALM=Registry Realm" \
  -e REGISTRY_AUTH_HTPASSWD_PATH=/auth/htpasswd \
  -v `pwd`/certs:/certs \
  -e REGISTRY_HTTP_TLS_CERTIFICATE=/certs/domain.crt \
  -e REGISTRY_HTTP_TLS_KEY=/certs/domain.key \
  registry:2
```

You should now be able to:

```
docker login myregistrydomain.com:5000
```


- 使用Compose

docker-compose.yml

```
registry:
  restart: always
  image: registry:2
  ports:
    - 5000:5000
  environment:
    REGISTRY_HTTP_TLS_CERTIFICATE: /certs/domain.crt
    REGISTRY_HTTP_TLS_KEY: /certs/domain.key
    REGISTRY_AUTH: htpasswd
    REGISTRY_AUTH_HTPASSWD_PATH: /auth/htpasswd
    REGISTRY_AUTH_HTPASSWD_REALM: Registry Realm
  volumes:
    - /path/data:/var/lib/registry
    - /path/certs:/certs
    - /path/auth:/auth
```
