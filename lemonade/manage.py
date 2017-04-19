#!/usr/bin/env python

import sys
import os

type = 'standard'

if (sys.argv[-1] == "-t"):
    type = 'test'
    del sys.argv[-1]

from migrate.versioning.shell import main

if __name__ == '__main__':
     if(os.environ.get('LEMONADE_DATABASE_USERNAME')
         and os.environ.get('LEMONADE_DATABASE_PASSWORD')
         and os.environ.get('LEMONADE_DATABASE_NAME')):
         db_name = os.environ.get('LEMONADE_DATABASE_TEST_NAME') if (type == "test") else  os.environ.get('LEMONADE_DATABASE_NAME')
         db_username = os.environ.get('LEMONADE_DATABASE_USERNAME')
         db_password = os.environ.get('LEMONADE_DATABASE_PASSWORD')
         repo = 'lemonade_stand_repo'
         db_host = os.environ.get('LEMONADE_DATABASE_HOST') if (os.environ.get('LEMONADE_DATABASE_HOST')) else 'localhost'
         main(repository='{0}'.format(repo), url='postgresql://{0}:{1}@{2}/{3}'.format(db_username, db_password, db_host, db_name), debug='True')
     else:
         print("Please ensure that the following environment variables are set:")
         print ("LEMONADE_DATABASE_USERNAME, LEMONADE_DATABASE_PASSWORD and LEMONADE_DATABASE_NAME")
         sys.exit()

