
# JobBoard

This project aims to create a complete job offer management solution. It includes a database to store job offers, a frontend web page to display these announcements and provide an administration interface for authorized users. Additionally, a backend API will be there to allow users to apply for jobs and to perform basic database operations, such as creating, reading, updating and deleting adverts.

## Deployment

To deploy this project run :

```bash
docker compose up -d
```
or for docker compose V1 :
```bash
docker-compose up -d
```

### Schema

![Schema of deploiment](assets/infra.svg)

## Technology used

**Client:** Html, Javascript, Bootstrap

**Server:** Python with FastAPI

### Dependencies

**Server** : 

```
pydantic==2.4.2
fastapi==0.103.2
uvicorn[standard]==0.23.2
sqlalchemy==2.0.22
mysql-connector-python==8.1.0
fastapi-login==1.9.1
starlette==0.27.0
python-multipart==0.0.6
pydantic[email]
```


## Authors

- [@Fbrisset](https://github.com/Fbrisset)
- [@Zoroxus](https://github.com/Zoroxus)

