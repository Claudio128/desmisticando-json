async function fetchData(url) {
  let response = await fetch(url);
  let data = await response.json();
  return data;
}

// ============================== ChartJS + API ====================== //

const X_AXIS = "Horário";
const CHART_LIST = [];
const All = [];
const BEGIN_AT_ZERO = false;
const SHOW_GRID = true;
const SHOW_LEGEND = true;

const ENUM_FIELDS = {
  1: "TEMPERATURA",
  2: "UMIDADE",
  3: "LUMINOSIDADE",
  4: "PRESSÃO",
  5: "ALTITUDE",
};

const FIELDS = {
  field1: "TEMPERATURA",
  field2: "UMIDADE",
  field3: "LUMINOSIDADE",
  field4: "PRESSÃO",
  field5: "ALTITUDE",
};

const Y_AXYS_LEGENDS = {
  TEMPERATURA: "Tempertura - Cº",
  UMIDADE: "Tempertura - Cº",
  LUMINOSIDADE: "Tempertura - Cº",
  PRESSÃO: "Tempertura - Cº",
  ALTITUDE: "Tempertura - Cº",
};

const createLabels = (objBase) => {
  let y_axis = "";
  let title = "";
  let field = "";

  Object.keys(FIELDS).forEach((fieldKey) => {
    if (objBase.hasOwnProperty(fieldKey)) {
      y_axis = Y_AXYS_LEGENDS[FIELDS[fieldKey]];
      title = FIELDS[fieldKey];
      field = fieldKey;
    }
  });

  return {
    y_axis,
    title,
    field,
  };
};

function setData(data, ctx) {
  const page_title = data.channel.name;

  const feeds = data.feeds;
  const labels = [];
  const datasets = [{ data: [] }];
  const dataToChart = { labels, datasets };

  const { y_axis, field, title } = createLabels(feeds[0]);

  feeds
    .filter((feedField) => feedField[field])
    .forEach((filteredFeed) => {
      datasets[0].data.push(Number(filteredFeed[field]));
      labels.push(new Date(filteredFeed["created_at"]));
    });

  initChart(ctx, title, y_axis, dataToChart);
}

function refreshData(data, index) {
  const feeds = data.feeds;
  const labels = [];
  const datasets = [{ data: [] }];
  const { field } = createLabels(feeds[0]);

  feeds
    .filter((feedField) => feedField[field])
    .forEach((filteredFeed) => {
      datasets[0].data.push(Number(filteredFeed[field]));
      labels.push(filteredFeed["created_at"]);
    });

  CHART_LIST[index].data.datasets = datasets;
  CHART_LIST[index].data.labels = labels;
  CHART_LIST[index].update();
}

function initChart(ctx, title, y_axis, data) {
  const chart = new Chart(ctx, {
    type: "line",
    data,
    options: {
      title: {
        display: true,
        text: title,
        fontSize: 14,
      },
      legend: {
        display: false,
      },
      maintainAspectRatio: false,
      scales: {
        xAxes: [
          {
            scaleLabel: {
              display: X_AXIS !== "",
              labelString: X_AXIS,
            },
            gridLines: {
              display: SHOW_GRID,
            },
            ticks: {
              maxTicksLimit: 10,
              callback: function (value, index, values) {
                return value.toLocaleString();
              },
            },
          },
        ],
        yAxes: [
          {
            stacked: false, // `true` for stacked area chart, `false` otherwise
            beginAtZero: true,
            scaleLabel: {
              display: y_axis !== "",
              labelString: y_axis,
            },
            gridLines: {
              display: SHOW_GRID,
            },
            ticks: {
              maxTicksLimit: 10,
              beginAtZero: BEGIN_AT_ZERO,
              callback: function (value, index, values) {
                return value.toLocaleString();
              },
            },
          },
        ],
      },
      tooltips: {
        displayColors: false,
        callbacks: {
          label: function (tooltipItem, all) {
            return (
              all.datasets[tooltipItem.datasetIndex].label +
              ": " +
              tooltipItem.yLabel.toLocaleString()
            );
          },
        },
      },
      plugins: {
        colorschemes: {
          /*
              Replace below with any other scheme from
              https://nagix.github.io/chartjs-plugin-colorschemes/colorchart.html
            */
          scheme: "brewer.DarkTwo5",
        },
      },
    },
  });

  CHART_LIST.push(chart);
}

const start = () => {
  for (let index = 1; index < 6; index++) {
    fetchData(
      `https://api.thingspeak.com/channels/1638970/field/${index}.json?&amp;offset=0&amp;results=60`
    )
      .then((dado) => {
        const ctx = document
          .getElementById(`chart-container-${index}`)
          .getContext("2d");

        setData(dado, ctx);
      })
      .catch((er) => {
        console.log(er);
      });
  }
};

const refresh = () => {
  for (let index = 1; index < 6; index++) {
    fetchData(
      `https://api.thingspeak.com/channels/1638970/field/${index}.json?&amp;offset=0&amp;results=60`
    )
      .then((e) => {
        refreshData(e, index - 1);
      })
      .catch((er) => {
        console.log(er);
      });
  }

  setTimeout(() => {
    refresh();
  }, 60000);
};

// start();

// ==================== CHART JS =========================== //

function startChartJS(params) {
  const ctx = document.getElementById(`chart-container`).getContext("2d"); // HTMLElement

  const labels = ["primeira", "segunda", "terceira", "quarta", "quinta"];

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Dataset 1",
        data: [6, 1, 2, 3, 4, 8],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Dataset 2",
        data: [5, 2, 9, 3, 2, 8],
        borderColor: "rgb(153, 102, 255)",
        backgroundColor: "rgba(153, 102, 255, 0.5)",
      },
    ],
  };

  new Chart(ctx, {
    type: "line",
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Chart.js Line Chart",
        },
      },
    },
  });
}

// startChartJS();

// ============================== JSON ====================== //

function consumirJSON(dado) {
  console.log(dado);
  // const backEnviaString = JSON.stringify(dado);
  // console.log(backEnviaString);
  // const jsTrataString = JSON.parse(backEnviaString);
  // console.log(jsTrataString);
}

function startJSON() {
  fetchData("data-2.json")
    .then((dado) => {
      consumirJSON(dado);
    })
    .catch((er) => {
      console.log(er);
    });
}

// startJSON();

// ============================== JSON + DOG API ====================== //

function inserirImagemDog(dado) {
  console.log(dado);

  const img = document.getElementById(`pokemon-img`); // HTMLElement
  img.setAttribute("src", dado.sprites.front_default);

  const name = document.getElementById(`pokemon-name`); // HTMLElement
  name.innerHTML = dado.name;
}

function getPokeApi() {
  const idPokemon = Math.floor(Math.random() * (100 - 1 + 1) + 1);
  fetchData(`https://pokeapi.co/api/v2/pokemon/${idPokemon}`)
    .then((dado) => {
      inserirImagemDog(dado);
    })
    .catch((er) => {
      console.log(er);
    });
}

// getPokeApi();

// ============================== JS functions ====================== //

function retornaSoma(val1, val2) {
  return val1 + val2;
}

function retornaNome(nome) {
  return "Olá " + nome + " seja bem vinde";
}

console.log(retornaSoma(1, 2));
console.log(retornaNome("nome"));
