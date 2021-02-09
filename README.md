## DM-SERVER OPEN SOURCE

- https://typegraphql.com/docs/
- https://mikro-orm.io/docs/

## RUN

```
docker-compose up -d

docker-compose logs -f
docker logs  dm_backend -f

docker exec -i -t  dm_backend /bin/bash

docker system prune -a
docker system prune --volumes
```

```ts
getConnection()
  .createQueryBuilder()
  .select('user')
  .from(User, 'u')
  .leftJoinAndSelect('u.posts', 'post')
  .getOne()

  //
  .delete()
  .from(User)
  .where('email = :email', { email })
  .execute()
  //
  .update(User)
  .set({ username: 'admin' })
  .execute()
```

```shell
docker-compose down
docker-compose build
docker-compose up
```
