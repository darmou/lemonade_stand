from sqlalchemy import Column, Integer, String, Numeric, Text
from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()

class Item(Base):
     __tablename__ = 'items'

     id = Column(Integer, primary_key=True)
     name = Column(String)
     description = Column(Text)
     price = Column(Numeric)
     image = Column(String)
     
     def as_dict(self):
        return { "id" : self.id, "name" : self.name, "description" : self.descripion, "price" : str(self.price), "image": self.image }
        
     def __repr__(self):
        return "<Item(name='%s', descripion='%s', cost=$%0.2f, image='%s')>" % (
                             self.name, self.description, self.price, self.image)