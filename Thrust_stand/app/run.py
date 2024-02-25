from flask import Flask, render_template, request
from flask_socketio import SocketIO
from random import random
from time import sleep


app = Flask(
    __name__,
)
socketio = SocketIO(app)


@app.route("/")
def main():
    return render_template("main.html")


@socketio.on("update_chart")
def handle_update_chart(dt):
    # Broadcast the received data to all clients
    for i in range(50):
        data = {"label": dt["x"] + i, "value": random(), "name": dt["name"]}
        socketio.emit("chart_data", data)
        sleep(0.07)


@app.route("/<i>")
def unknown(i):
    return f'<h1 style="color : red; text-align: center;"> Unknown adresss "{i}" '


if __name__ == "__main__":
    app.run(debug=True)
