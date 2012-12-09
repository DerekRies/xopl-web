#!/usr/bin/env python

import webapp2
import os
import json
import jinja2

from google.appengine.api import memcache
from google.appengine.ext import db
from google.appengine.api import users

template_dir = os.path.join(os.path.dirname(__file__), 'templates')
jinja_environment = jinja2.Environment(
    loader=jinja2.FileSystemLoader(template_dir), autoescape=True, variable_start_string='{{{', variable_end_string='}}}')



class BaseHandler(webapp2.RequestHandler):
    def write(self, *a, **kw):
        self.response.out.write(*a,**kw)

    def render_str(self, template, params):
        t = jinja_environment.get_template(template)

        if self.adminCheck():
            params['admin'] = True;

        return t.render(params)

    def render(self, template, kw):
        self.write(self.render_str(template, kw))

    def adminCheck(self):
        user = users.get_current_user()
        if user:
            if users.is_current_user_admin():
                return True;
            else:
                return False
        else:
            return False



class MainHandler(BaseHandler):
    def get(self):
        self.render('index-async.html',{"planets":814,"stars":630})


class LearnHandler(BaseHandler):
    def get(self):
        self.render('index-async.html',{"planets":889,"stars":630})


class DemoHandler(BaseHandler):
    def get(self):
        self.render('index-async.html',{"planets":814,"stars":630})

class AboutHandler(BaseHandler):
    def get(self):
        self.render('index-async.html',{"planets":814,"stars":630})


app = webapp2.WSGIApplication([
    ('/', MainHandler),
    ('/learn', LearnHandler),
    ('/about', AboutHandler),
    ('/demo', DemoHandler),
],debug=True)


