from flask import Flask, render_template, request
from flask_socketio import SocketIO
from random import random
from time import sleep
import csv
import re

app = Flask(
    __name__,
)
socketio = SocketIO(app)


def float_from_string(string):
    # Regular expression to find float
    float_pattern = r"[-+]?\d*\.\d+|\d+"
    matches = re.findall(float_pattern, string)
    # Convert each match to float and return the first one found
    for match in matches:
        try:
            return float(match)
        except ValueError:
            pass
    return "NaN"  # Return None if no float found


def writecsv(data):
    if not data:  # Check if data is empty
        return

    with open("data/data.csv", "a", newline="") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=list(data.keys()))
        writer.writerow(data)


@app.route("/", methods=["GET", "POST"])
def main():
    return render_template("main.html")


@socketio.on("update_chart")
def update_chart(dt):
    # Broadcast the received data to all clients
    for i in range(50):
        data = {"label": dt["x"] + i, "value": random(), "name": dt["name"]}
        socketio.emit("chart_data", data)
        sleep(0.07)


@socketio.on("stats")
def get_stats(stats):
    tmean, pmean, emean, rmean, tstd, pstd, estd, rstd = [
        float_from_string(i) for i in list(stats.values())[:-1]
    ]
    name = stats["name"]
    writecsv(
        {
            "name": name,
            "meanThrust": tmean,
            "stdThrust": tstd,
            "meanPowerUsage": pmean,
            "stdPowerUsage": pstd,
            "meanEfficiency": emean,
            "stdEfficiency": estd,
            "meanRPM": rmean,
            "stdMean": rstd,
        }
    )


@app.route("/<i>")
def unknown(i):
    return f'<h1 style="color : red; text-align: center;"> Unknown adresss "{i}" '


if __name__ == "__main__":
    app.run(debug=True)
