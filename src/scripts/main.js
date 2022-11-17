'use strict';

import 'regenerator-runtime/runtime'
import * as echarts from 'echarts'

const myChart = echarts.init(document.querySelector('.charts'));

const BASE_URL = 'https://www.ag-grid.com/example-assets/olympic-winners.json';

const fetchData = fetch(BASE_URL)
  .then((data) => data.json());

const showChart = async() => {
  const dataFromApi = await fetchData;
  const names = dataFromApi.map(item => item.athlete);
  const filtered = dataFromApi
    .filter(({ athlete }, index) => !names.includes(athlete, index + 1))
    .slice(0, 15);

  const getValue = (num, value) => {
    return filtered[num][value]
  }

  const source = [];

  for (let i = 0; i < filtered.length; i++) {
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
      text: 'Medals chart'
    },
    tooltip: {
      trigger: 'item',
      formatter:
      function() {
        const {name, age} = arguments[0].data;

        return `${name} ` +
         `${age}y.o.: ` +
         `${arguments[0].data[arguments[0]["seriesName"]]} medals`
    }
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
  };

  myChart.setOption(option);
};

showChart();
