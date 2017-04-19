# README


## Description
Sally's Lemonade Stand is a web project that allows us to manage a list of inventory items.

The web site provides all the standard CRUD operations (Create, Update and Delete).

## Setup

We need to be able to set up both the Python server and it's requiemnents and the front end
Javascript Node.js server.

### Database Setup

The first step is to set up the database for the Lemonade Stand with schema versioning.

If Postgres is not installed, use ```brew install postgresql``` on Mac OS X or ```apt-get install postgresql-9.4``` for Ubuntu or debian.

To  set up the database login to the console as follows:

```
psql -U postgres
```


We can then run a series of commands in the Postgresql console, feel free to change 'example' with a username or password of your choice:

**NOTE**: In a real database setup one would create another user that only has read, write and delete privileges on the items table.

```
create database lemonade_stand_test;
create database lemonade_stand;
CREATE USER example WITH PASSWORD 'example_password';
GRANT ALL PRIVILEGES ON DATABASE "lemonade_stand" to example;
GRANT ALL PRIVILEGES ON DATABASE "lemonade_stand_test" to example;
```

We can now run the migration script to set up our db and test db with the items table:

```
python lemonade_stand_repo/manage.py version_control 'postgresql://example:example_password@localhost/lemonade_stand' lemonade_stand_repo
python lemonade_stand_repo/manage.py upgrade 'postgresql://example:example_password@localhost/lemonade_stand' lemonade_stand_repo

python lemonade_stand_repo/manage.py version_control 'postgresql://example:example_password@localhost/lemonade_stand_test' lemonade_stand_repo
```

More about flask-Migrate can be found at https://flask-migrate.readthedocs.io/en/latest/

### Python Dependencies Setup

Make sure Python3 is installed, on OS X for example:

```
brew install python3
```

We then need to set up a virtualenv in the root project folder:
```
pip install --upgrade virtualenv
virtualenv -p python3 lemonade_flask

```

Activate the virtualenv:
```
. ./lemonade_flask/bin/activate
```
Install the dependencies:
```
pip install -r requirements.txt
```

### Node Dependencies Setup
From the project root diretory run the following command.

```
npm install
```

## Running The Application

### Running the Python App
In the project root directory:
First alter the set_env_vars.sh to use the username and password we set up for our db:

```
. ./set_env_vars.sh
```
Then ensure we have activated our virtualenv if we have not already.
```
. ./lemonade_flask/bin/activate
```
Then to run our application, first cd to the lemonade directory:
```
cd lemonade
```
Then:
```
python lemonade.py
```

### Running the Node.js App

Note both the Node.js app and the Python server need to be running.

```
npm start
```

### Running App Url

The app is now running at http://localhost:5000

## Further Documentation for the API


http://localhost:5000/docs

**Note**: We are using the JSON API standard as described at http://jsonapi.org/.


### Running the Tests

We will need to install the selenium web driver, for Mac OS X:

```brew install selenium-server-standalone```

The Chrome webdriver will need to be installed in your path it can be downloaded from:
https://chromedriver.storage.googleapis.com/index.html?path=2.29/

Next install mocha globally:

```
npm install -g mocha
```
Now we can run the web test.  From the root dir which holds the test directory run the following command which will run the tests in the test folder:
```
mocha 
```
In the test folder of the project root dir.

To run the Python unit tests:
```
python lemonade_stand_tests.py
```

In the tests folder of the project root dir.

## General Notes

If there was a lot more css for each individual component then we would use css modules (to avoid name conflicts) and have a directory for each React component where anything related to that component css or
sass would be there.

For more info see: https://github.com/gajus/react-css-modules

Because this is a very simple app stylesheet wise then placing all the styles in a single file (main.css) is fine.
