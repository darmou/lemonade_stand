from sqlalchemy import Table, Column, Integer, String, MetaData, Numeric, Text
from migrate import *

meta = MetaData()

items = Table(
    'items', meta,
    Column('id', Integer, primary_key=True),
    Column('name', String(255)),
    Column('description', Text),
    Column('price', Numeric(precision=15, scale=2, decimal_return_scale=None, asdecimal=True) ),
    Column('image', String(255)),
)


def upgrade(migrate_engine):
    meta.bind = migrate_engine
    items.create()


def downgrade(migrate_engine):
    meta.bind = migrate_engine
    items.drop()