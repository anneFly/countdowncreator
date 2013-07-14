from google.appengine.ext import ndb


class Countdown(ndb.Model):
    title = ndb.StringProperty(indexed=False)
    date = ndb.DateTimeProperty()