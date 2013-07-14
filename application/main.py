import flask
from datetime import datetime
import utils
from models import Countdown
from application import app



@app.route('/')
def route_to_index():
    return flask.render_template('index.html')


@app.route('/create')
def route_to_create():
    return flask.render_template('create.html', input={})


@app.route('/create', methods=['POST'])
def create_countdown():
    data = flask.request.form
    cd = Countdown()
    cd.title = data.get('title', None)
    date = data.get('date', '')
    time = data.get('hour', '') + ':' + data.get('minute', '') + ':' + data.get('second', '')
    try:
        cd.date = datetime.strptime(date + ' ' + time, "%Y-%m-%d %H:%M:%S")
    except ValueError:
        return flask.render_template('create.html', error=True, input=data)
    cd.put()
    return flask.redirect(flask.url_for('create_success', id=cd.key.id()))


@app.route('/create/success/<id>')
def create_success(id):
    cd = utils.get_or_404(Countdown, id)
    return flask.render_template('create_success.html', countdown=cd)


@app.route('/details/<id>')
def details(id):
    cd = utils.get_or_404(Countdown, id)
    return flask.render_template('details.html', countdown=cd)