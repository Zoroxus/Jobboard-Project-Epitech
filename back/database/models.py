import sqlalchemy as sa
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func


Base = declarative_base()


class Companies(Base):

    __tablename__ = 'companies'

    id = sa.Column(sa.BigInteger(), primary_key=True)
    name = sa.Column(sa.Text(), nullable=False)


class Users(Base):

    __tablename__ = 'users'

    id = sa.Column(sa.BigInteger(), primary_key=True)
    companies_id = sa.Column(sa.BigInteger(), sa.ForeignKey('companies.id'))
    email = sa.Column(sa.String(255), nullable=False, unique=True)
    password = sa.Column(sa.Text(), nullable=False)
    admin = sa.Column(sa.Boolean(), nullable=False, server_default='FALSE')
    firstname = sa.Column(sa.Text(), nullable=False)
    name = sa.Column(sa.Text(), nullable=False)
    birthdate = sa.Column(sa.Date(), nullable=False)
    phone = sa.Column(sa.Text(), nullable=False)
    adress = sa.Column(sa.Text(), nullable=False)


class Advertisements(Base):

    __tablename__ = 'advertisements'

    id = sa.Column(sa.BigInteger(), primary_key=True)
    users_id = sa.Column(sa.BigInteger(), sa.ForeignKey('users.id'), nullable=False)
    name = sa.Column(sa.Text(), nullable=False)
    short_descriptions = sa.Column(sa.Text(), nullable=False)
    descriptions = sa.Column(sa.Text(), nullable=False)
    wages = sa.Column(sa.Integer(), nullable=False)
    location = sa.Column(sa.Text(), nullable=False)
    worktime = sa.Column(sa.Text(), nullable=False)
    creation_time = sa.Column(sa.TIMESTAMP(), server_default=func.now())


class Applications(Base):

    __tablename__ = 'applications'

    id = sa.Column(sa.BigInteger(), primary_key=True)
    users_id = sa.Column(sa.BigInteger(), sa.ForeignKey('users.id'), nullable=False)
    advertisements_id = sa.Column(sa.BigInteger(), sa.ForeignKey('advertisements.id'), nullable=False)
    creation_time = sa.Column(sa.TIMESTAMP(), server_default=func.now())
    message = sa.Column(sa.Text(), nullable=False)
