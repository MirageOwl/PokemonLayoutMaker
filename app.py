from flask import Flask, render_template

app = Flask(__name__)

app.config["TEMPLATES_AUTO_RELOAD"] = True
app.debug = True

@app.route('/')
def index():
    return render_template("main.html")
