import os,sys,inspect
#Import paths for lemonade dir
currentdir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
parentdir = os.path.dirname(currentdir)
sys.path.insert(0,parentdir)
sys.path.insert(0,parentdir + "/lemonade") #so that any imports from lemonade work
import lemonade
import json
import unittest
import tempfile
from db.item import Item
from sqlalchemy.orm import sessionmaker, scoped_session

class LemonadeTestCase(unittest.TestCase):

    def setUp(self):
        self.db_fd, lemonade.app.config['DATABASE'] = tempfile.mkstemp()
        lemonade.app.config['TESTING'] = True
        self.app = lemonade.app.test_client()
        with lemonade.app.app_context():
            #create tables
            os.system("python ../lemonade/lemonade_stand_repo/manage.py upgrade 'postgresql://{0}:{1}@{2}/{3}' ../lemonade/lemonade_stand_repo".format(os.environ.get('LEMONADE_DATABASE_USERNAME'),os.environ.get('LEMONADE_DATABASE_PASSWORD'),
                                                                                                                                                       os.environ.get('LEMONADE_DATABASE_HOST'), os.environ.get('LEMONADE_DATABASE_TEST_NAME')  ))

            self.con, self.meta = lemonade.connect(os.environ.get('LEMONADE_DATABASE_USERNAME'),  os.environ.get('LEMONADE_DATABASE_PASSWORD'),  os.environ.get('LEMONADE_DATABASE_TEST_NAME'))
            self.db_session = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=self.con))


    def tearDown(self):
        #destroy tables
        self.db_session.close()
        lemonade.session.close()
        os.system("python ../lemonade/lemonade_stand_repo/manage.py downgrade 'postgresql://{0}:{1}@{2}/{3}' ../lemonade/lemonade_stand_repo 0".format(os.environ.get('LEMONADE_DATABASE_USERNAME'),
                                                                                                                                                       os.environ.get('LEMONADE_DATABASE_PASSWORD'), os.environ.get('LEMONADE_DATABASE_HOST'), os.environ.get('LEMONADE_DATABASE_TEST_NAME')))

    def test_model_create_item(self):
         item = Item(name='test', description='test_desc', price=3.33, image='')
         self.db_session.add(item)
         self.db_session.commit()
         Item.query = self.db_session.query_property()
         item = Item.query.filter_by(name='test').first()
         assert item.id == 1


    def test_home_page(self):
         rv = self.app.get('/')
         assert b'For more detail go to this site' in rv.data #test we can pull in our template home page

    def test_list_of_items(self):
         item = Item(name='test', description='test_desc', price=3.33, image='')
         self.db_session.add(item)
         self.db_session.commit()
         with lemonade.app.app_context():
             rv = self.app.get('/api/v1.0/items')
             #print(rv.data)
             assert b'test_desc' in rv.data

    def test_an_item(self):
          item = Item(name='test', description='test_desc', price=3.33, image='')
          self.db_session.add(item)
          self.db_session.commit()
          rv = self.app.get('/api/v1.0/items/1')
          #print(rv.data)
          assert b'test_desc' in rv.data


    def test_create_an_item(self):
         rv = self.app.post('/api/v1.0/items',data=json.dumps({'data': {'type':'items', 'attributes' : {'name' : 'bar','description':'ths','price':3.33, 'image':'thth'}}}), headers={'Content-Type': 'application/vnd.api+json'})
         print(rv.data)
         assert b'/api/v1.0/items/1' in rv.data



if __name__ == '__main__':
    unittest.main()
