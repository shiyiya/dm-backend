## DM-SERVER OPEN SOURCE

- https://typegraphql.com/docs/
- https://mikro-orm.io/docs/

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
