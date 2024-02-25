var socket = io.connect("http://127.0.0.1:5000/");

function randChart() {
  const chart = document.getElementById("chartName").value;
  let xvals = [];
  let yvals = [];

  for (let i = 1; i <= 15; i++) {
    xvals.push(i);
    yvals.push(Math.floor(Math.random() * 20));
  }

  console.log("Randomized" + chart + "succesfully");

  if (chart == "Thrust") {
    thrustChart.data.labels = xvals;
    thrustChart.data.datasets[0].data = yvals;
    thrustChart.update();
  } else if (chart == "RPM") {
    rpmChart.data.labels = xvals;
    rpmChart.data.datasets[0].data = yvals;
    rpmChart.update();
  } else if (chart == "Efficiency") {
    efficiencyChart.data.labels = xvals;
    efficiencyChart.data.datasets[0].data = yvals;
    efficiencyChart.update();
  } else if (chart == "Power Usage") {
    powerUsageChart.data.labels = xvals;
    powerUsageChart.data.datasets[0].data = yvals;
    powerUsageChart.update();
  }
}

function sendValSocket() {
  const chart = document.getElementById("chartName").value;
  var x = 0;
  if (chart == "Thrust") {
    x = thrustChart.data.labels.slice(-1)[0] + 1;
  }
  else if (chart == "RPM") {
    x = rpmChart.data.labels.slice(-1)[0] + 1;
  }
  else if (chart == "Efficiency") {
    x = efficiencyChart.data.labels.slice(-1)[0] + 1;
  }
  else if (chart == "Power Usage") {
    x = powerUsageChart.data.labels.slice(-1)[0] + 1;
  }
  socket.emit("update_chart", {"x" : x, "name" : chart})
}

function getMean(chart) {
  const data = chart.data.datasets[0].data;
  const sum = data.reduce((a,b) => a+b, 0);
  const average = (sum/data.length) || 0 

  return Math.round((average + Number.EPSILON) * 100) / 100
}

socket.on("chart_data", function (data) {
  const chart = data.name;
  console.log("Received chart data for:", chart, data);
  
  try {
    if (chart == "Thrust") {
      const mean = getMean(thrustChart)
      thrustChart.data.labels.push(data.label);
      thrustChart.data.datasets[0].data.push(data.value);
      document.getElementById("thrustMean").innerHTML = "Thrust : " + mean + " N";
      thrustChart.update();
    } else if (chart == "RPM") {
      const mean = getMean(rpmChart)
      rpmChart.data.labels.push(data.label);
      rpmChart.data.datasets[0].data.push(data.value);
      document.getElementById("rpmMean").innerHTML = "RPM : " + mean + " rad/s";
      rpmChart.update();
    } else if (chart == "Efficiency") {
      const mean = getMean(efficiencyChart)
      efficiencyChart.data.labels.push(data.label);
      efficiencyChart.data.datasets[0].data.push(data.value);
      document.getElementById("efficiencyMean").innerHTML = "Efficiency : " + mean + " N/W";
      efficiencyChart.update();
    } else if (chart == "Power Usage") {
      const mean = getMean(powerUsageChart)
      powerUsageChart.data.labels.push(data.label);
      powerUsageChart.data.datasets[0].data.push(data.value);
      document.getElementById("powerMean").innerHTML = "Power Usage : " + mean + " W" ;
      powerUsageChart.update();
    }
  } catch (error) {
    console.error("Error updating chart:", error);
  }
});


const thrustChart = new Chart("thrustChart", {
  type: "line",
  data: {
    labels: [0],
    datasets: [
      {
        fill: false,
        lineTension: 0,
        backgroundColor: "rgba(0,0,255,1.0)",
        borderColor: "rgba(0,0,255,0.1)",
        data: [0],
      },
    ],
  },
  options: {
    legend: { display: false },
    title: {
      display: true,
      text: "Thrust", // Set the title text
      fontSize: 18, // Optionally set the font size
      fontColor: "#333", // Optionally set the font color

    },
  },
});

const efficiencyChart = new Chart("efficiencyChart", {
  type: "line",
  data: {
    labels: [0],
    datasets: [
      {
        fill: false,
        lineTension: 0,
        backgroundColor: "rgba(0,0,255,1.0)",
        borderColor: "rgba(0,0,255,0.1)",
        data: [0],
      },
    ],
  },
  options: {
    legend: { display: false },
    title: {
      display: true,
      text: "Efficiency", // Set the title text
      fontSize: 18, // Optionally set the font size
      fontColor: "#333", // Optionally set the font color
    },
  },
});

const powerUsageChart = new Chart("powerUsageChart", {
  type: "line",
  data: {
    labels: [0],
    datasets: [
      {
        fill: false,
        lineTension: 0,
        backgroundColor: "rgba(0,0,255,1.0)",
        borderColor: "rgba(0,0,255,0.1)",
        data: [0],
      },
    ],
  },
  options: {
    legend: { display: false },
    title: {
      display: true,
      text: "Power Usage", // Set the title text
      fontSize: 18, // Optionally set the font size
      fontColor: "#333", // Optionally set the font color
    },
  },
});

const rpmChart = new Chart("rpmChart", {
  type: "line",
  data: {
    labels: [0],
    datasets: [
      {
        fill: false,
        lineTension: 0,
        backgroundColor: "rgba(0,0,255,1.0)",
        borderColor: "rgba(0,0,255,0.1)",
        data: [0],
      },
    ],
  },
  options: {
    legend: { display: false },
    title: {
      display: true,
      text: "RPM", // Set the title text
      fontSize: 15, // Optionally set the font size
      fontColor: "#333", // Optionally set the font color
    },
  },
});


