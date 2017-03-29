import os
import config

 # This part below is based on the flask-user example under BSD license 
# Use a Class-based config to avoid needing a 2nd file
# os.getenv() enables configuration through OS environment variables
class ConfigClass(object):
    # Flask settings
    SECRET_KEY =              os.getenv('SECRET_KEY',       'THIS IS AN INSECURE SECRET')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL',     'sqlite:///UsersAppDB.sqlite')
    CSRF_ENABLED = True

    # Flask-Mail settings
    MAIL_USERNAME =           os.getenv('MAIL_USERNAME',        'email@example.com')
    MAIL_PASSWORD =           os.getenv('MAIL_PASSWORD',        'password')
    MAIL_DEFAULT_SENDER =     os.getenv('MAIL_DEFAULT_SENDER',  '"MyApp" <noreply@example.com>')
    MAIL_SERVER =             os.getenv('MAIL_SERVER',          'smtp.gmail.com')
    MAIL_PORT =           int(os.getenv('MAIL_PORT',            '465'))
    MAIL_USE_SSL =        int(os.getenv('MAIL_USE_SSL',         True))

    # Flask-User settings
    USER_APP_NAME        = "CITY_DASHBOARD"                # Used by email templates
    USER_ENABLE_INVITATION = True
    USER_REQUIRE_INVITATION          = True
    USER_INVITE_URL= "/"
    USER_AFTER_LOGIN_ENDPOINT                = "admin.home_page"

# This part above is based on the flask-user example under BSD license

    # Upload folders
    UPLOADED_PHOTOS_DEST = "app/upload_photos"

# Admin user creation settings
class CreateAdminUser(object):
    ADMIN_USER = os.getenv('ADMIN_USER',        'admin')
    ADMIN_EMAIL = os.getenv('ADMIN_EMAIL',        'email@example.com')
    ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD',        'password')
