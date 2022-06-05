# Building with docker

Build:

```bash
docker build --label hummus --tag hummus:latest .
```

```bash
docker run --env-file ./backend/.env -p 8080:8080  --name hummus  --detach hummus
```