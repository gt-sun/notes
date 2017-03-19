

## overlay

### Add an overlay network in swarm

First, create an overlay network on a manager node the docker network create command:

```sh
$ docker network create --driver overlay my-network

etjpu59cykrptrgw0z0hk5snf
```

After you create an overlay network in swarm mode, all manager nodes have access to the network.
When you create a service and pass the `--network` flag to attach the service to the overlay network:

```sh
$ docker service create \
  --replicas 3 \
  --network my-network \
  --name my-web \
  nginx

716thylsndqma81j6kkkb5aus
```

The swarm extends my-network to each node running the service.

## update services

```sh
$ docker service create \
  --replicas 10 \
  --name my_web \
  --update-delay 10s \
  --update-parallelism 2 \
  --update-failure-action continue \
  alpine

0u6a4s31ybk7yw2wyvtikmu50
```
