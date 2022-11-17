'use strict';

require('regenerator-runtime/runtime');

const echarts = require('echarts');

const myChart = echarts.init(document.querySelector('.charts'));

const BASE_URL = 'https://www.ag-grid.com/example-assets/olympic-winners.json';

// eslint-disable-next-line no-undef
const fetchData = fetch(BASE_URL)
  .then((data) => data.json());

const showChart = async() => {
  const dataFromApi = await fetchData;

  const filteredData = dataFromApi
    .filter((value, index, array) =>
      array.findIndex(el => el.athlete === value.athlete) === index)
    .slice(0, 15);

  const getValue = (num, value) => {
    return filteredData[num][value];
  };

  const source = [];

  for (let i = 0; i < filteredData.length; i++) {
    source.push({
      name: getValue(i, 'athlete'),
      gold: getValue(i, 'gold'),
      silver: getValue(i, 'silver'),
      bronze: getValue(i, 'bronze'),
      age: getValue(i, 'age'),
    });
  }

  const option = {
    color: ['#D4AF37', '#AAA9AD', '#CD7F32'],
    title: {
      text: 'Medals chart',
    },
    tooltip: {
      trigger: 'item',
      formatter:
      function() {
        const { name, age } = arguments[0].data;

        return `${name} `
        + `${age}y.o.: `
        + `${arguments[0].data[arguments[0]['seriesName']]} medals`;
      },
    },
    legend: {
      orient: 'vertical',
      left: 'right',
    },
    dataset: [{
      dimensions: ['name', 'gold', 'silver', 'bronze'],
      source,
    }],
    xAxis: {
      type: 'category',
      axisLabel: {
        rotate: 35,
      },
    },
    yAxis: {},
    series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }],
    grid: {
      right: '15%',
    },
  };

  myChart.setOption(option);
};

showChart();
