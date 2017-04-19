#!flask/bin/python
import os
import sys
from flask import Flask, jsonify, abort, make_response, request, render_template, send_from_directory
from db.db import connect
from db.item import Item
from sqlalchemy.orm import sessionmaker
from flask_rest_jsonapi import Api, ResourceDetail, ResourceList
from marshmallow_jsonapi.flask import Schema
from marshmallow_jsonapi import fields
from flask_uploads import UploadSet, IMAGES, configure_uploads
from flask_webpack import Webpack
webpack = Webpack()



def create_app(settings_override=None):
    """
    Create a test application.
    :param settings_override: Override settings
    :type settings_override: dict
    :return: Flask app
    """
    app = Flask(__name__,instance_relative_config=True,static_url_path='')
    app.config.from_pyfile('flask.cfg')
    params = {
        'DEBUG': True,
        'WEBPACK_MANIFEST_PATH': '../build/manifest.json'
    }

    app.config.update(params)

    if settings_override:
        app.config.update(settings_override)
    webpack.init_app(app)

    return app


app = create_app()

# Configure the image uploading via Flask-Uploads
photos = UploadSet('images', IMAGES)
configure_uploads(app, photos)

def connect_to_database():
    if(os.environ.get('LEMONADE_DATABASE_USERNAME')
       and os.environ.get('LEMONADE_DATABASE_PASSWORD')
       and os.environ.get('LEMONADE_DATABASE_NAME')):
        db_name =  os.environ.get('LEMONADE_DATABASE_NAME') if __name__ == '__main__' else os.environ.get('LEMONADE_DATABASE_TEST_NAME') #TEST IF we are called as script
        con, meta = connect(os.environ.get('LEMONADE_DATABASE_USERNAME'),  os.environ.get('LEMONADE_DATABASE_PASSWORD'),  db_name)
        Session = sessionmaker(bind=con)
        Session.configure(bind=con)
        return Session()
    else:
        print("Please ensure that the following environment variables are set:")
        print ("LEMONADE_DATABASE_USERNAME, LEMONADE_DATABASE_PASSWORD and LEMONADE_DATABASE_NAME")
        sys.exit()

session = connect_to_database()

# Create schema
class ItemSchema(Schema):
    class Meta:
        type_ = 'items'
        self_view = 'item_detail'
        self_view_kwargs = {'id': '<id>'}
        self_view_many = 'item_list'

    id = fields.Str(dump_only=True)
    name = fields.Str()
    description = fields.Str()
    price = fields.Decimal(places=2, rounding=None, allow_nan=False, as_string=True)
    image = fields.Str()

# Create resource managers
class ItemList(ResourceList):
    schema = ItemSchema
    data_layer = {'session': session,
                  'model': Item}

class ItemDetail(ResourceDetail):
    schema = ItemSchema
    data_layer = {'session': session,
                  'model': Item}



# Create the API object
api = Api(app)


api.route(ItemList, 'item_list', '/api/v1.0/items')
api.route(ItemDetail, 'item_detail', '/api/v1.0/items/<int:id>')

@app.route('/')
def index():
    return render_template('index.jinja2')


@app.route('/image_upload', methods=['POST'])
def upload():
    #import code; code.interact(local=dict(globals(), **locals()))
    filename  = ""

    if request.method == 'POST':
        keys = list(request.files.to_dict().keys())
        if len(keys) > 0:
            filename = photos.save(request.files[keys[0]])
            return make_response(jsonify( { "message": "Created", "path" : "/uploads/" + filename } ), 201)


    return make_response(jsonify( { "error": "Bad or empty request" } ), 400)



@app.route('/uploads/<path:path>')
def send_images(path):
    return send_from_directory('uploads', path)
    
    
@app.route('/docs/<path:path>')
def send_docs(path):
    return send_from_directory('docs', path)

@app.route('/docs')
def send_docs_index():
    print("Here")
    return send_from_directory('docs', 'index.html')

@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify( { "error": "Resource not found" } ), 404)
    
@app.errorhandler(405)
def not_found(error):
    return make_response(jsonify( { "error": "Method not allowed" } ), 404)    

@app.errorhandler(400)
def create_failed(error):
    return make_response(jsonify( { "error": "Resource modification failed" } ), 400)

# Start the flask loop   
if __name__ == '__main__':
    app.run(debug=True)
