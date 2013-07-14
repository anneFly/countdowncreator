import flask

def get_or_404(cls, id):
    try:
        cd = cls.get_by_id(int(id))
    except ValueError:
        cd = None
    if not cd:
        flask.abort(404)
    return cd