import flask

def get_or_404(cls, id):
    try:
        cd = cls.get_by_id(int(id))
    except ValueError:
        cd = None
    if not cd:
        flask.abort(404)
    return cd

def build_string(dct, keys, separator=' '):
    lst = [dct.get(k) for k in keys if k in dct]
    print(lst)
    print separator.join(lst)
    return separator.join(lst)