import * as echarts from 'echarts/core';
import { DatasetComponent, TitleComponent, TooltipComponent, GridComponent, LegendComponent } from 'echarts/components';
import { ScatterChart, LineChart } from 'echarts/charts';
import { UniversalTransition, LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  DatasetComponent,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  ScatterChart,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
  LabelLayout,
]);

import ecStat from 'echarts-stat';

var chartDom = document.getElementById('main');
var myChart = echarts.init(chartDom);
var option;

// See https://github.com/ecomfe/echarts-stat

const mainTitle = '下横沥';
const subTitle = '站综合过程线图';

function addRandomError(numbers, errorMargin, decimalPlaces = 3) {
  // 确保errorMargin是一个正数
  if (errorMargin < 0) {
    throw new Error('Error margin must be a non-negative number');
  }

  // 创建一个新数组来存储带有误差的数据
  const numbersWithError = [];

  // 遍历原始数组
  for (let i = 0; i < numbers.length; i++) {
    // 生成一个介于-errorMargin和errorMargin之间的随机数
    const randomError = Math.random() * (2 * errorMargin) - errorMargin;
    // 将随机误差加到原始数据上
    const newValue = numbers[i] + randomError;

    const roundedValue = Number(newValue.toFixed(decimalPlaces));

    // 将带有误差的新值添加到新数组中
    numbersWithError.push(roundedValue);
  }

  // 返回带有误差的新数组
  return numbersWithError;
}

function generateHourlyTimestamps(startDateStr, hours = 24) {
  // 直接使用提供的字符串创建Date对象，这里假设startDateStr已经是本地时间
  const startDate = new Date(startDateStr);
  if (isNaN(startDate.getTime())) {
    throw new Error('Invalid date string');
  }

  const timestamps = [];

  // 循环遍历每一个小时
  for (let i = 0; i < hours; i++) {
    // 复制startDate以避免修改原始对象（虽然在这个特定函数中不是必需的，但通常是一个好习惯）
    const currentDate = new Date(startDate);
    // 设置当前小时（注意：这里直接加小时数，因为startDate已经是本地时间了）
    currentDate.setHours(startDate.getHours() + i, 0, 0, 0);
    // 如果超过23小时，则自动调整到下一天（这通常由setHours方法处理）
    timestamps.push(currentDate.getTime());
  }

  return timestamps;
}

const data1 = [
  0.122, 0.134, 0.192, 0.182, 0.177, 0.128, 0.12, 0.104, 0.116, 0.121, 0.121, 0.164, 0.159, 0.165, 0.124, 0.166, 0.153, 0.182, 0.165, 0.124,
  0.127, 0.101, 0.1, 0.144, 0.155, 0.157, 0.136, 0.129, 0.156, 0.13, 0.079, 0.091, 0.099, 0.111, 0.14, 0.132, 0.102, 0.099, 0.126, 0.123,
  0.099, 0.104, 0.109, 0.093, 0.097, 0.077, 0.098, 0.088, 0.119, 0.127, 0.103, 0.126, 0.1, 0.116, 0.099, 0.084, 0.109, 0.073, 0.064, 0.07,
  0.075, 0.106, 0.107, 0.104, 0.094, 0.069, 0.073, 0.086, 0.044, 0.081, 0.061, 0.091, 0.088, 0.071, 0.08, 0.087, 0.098, 0.09, 0.078, 0.071,
  0.061, 0.061, 0.058, 0.069, 0.081, 0.077, 0.09, 0.072, 0.033, 0.092, 0.123, 0.087, 0.1, 0.061, 0.051, 0.053, 0.07, 0.05, 0.08, 0.095,
  0.085, 0.099, 0.058, 0.066, 0.067, 0.076, 0.063, 0.066, 0.056, 0.043, 0.039, 0.062, 0.057, 0.048, 0.053, 0.046, 0.066, 0.06, 0.026, 0.088,
  0.099, 0.11, 0.095, 0.084, 0.048, 0.068, 0.09, 0.112, 0.091, 0.069, 0.074, 0.072, 0.041, 0.039, 0.054, 0.03, 0.055, 0.058, 0.038, 0.029,
  0.033, 0.053, 0.052, 0.061, 0.06, 0.041, 0.066, 0.066, 0.066, 0.049, 0.052, 0.055, 0.073, 0.042, 0.035, 0.043, 0.059, 0.094, 0.097, 0.076,
  0.081, 0.117, 0.127, 0.098, 0.064, 0.064, 0.047, 0.046, 0.063, 0.063, 0.038, 0.046, 0.061, 0.059, 0.077, 0.048, 0.049, 0.04, 0.041, 0.058,
  0.025, 0.035, 0.061, 0.064, 0.032, 0.057, 0.027, 0.041, 0.06, 0.067, 0.068, 0.035, 0.052, 0.067, 0.069, 0.038, 0.033, 0.061, 0.06, 0.07,
  0.07, 0.043, 0.065, 0.051, 0.047, 0.046, 0.028, 0.049, 0.045, 0.046, 0.052, 0.046, 0.05,
];
const data2 = addRandomError(data1, 0.004);
const timeS = generateHourlyTimestamps('2020-06-16 14:00:00', data1.length);
const data = data1.map((value, idx) => [timeS[idx], value, data2[idx]]);

echarts.registerTransform(ecStat.transform.regression);
option = {
  legend: {
    show: true,
    orient: 'vertical', // 图例垂直排列
    x: '80%', // 图例水平位置在右侧
    y: '10%', // 图例垂直位置在顶部附近，也可以是一个数值（如'20%'）来调整具体位置
    padding: [20, 20, 20, 20], // 图例内边距，这里假设我们想要图例与右侧和顶部保持一定距离
    data: ['实测数据', '模拟数据'], // 图例项数据
  },

  dataset: [
    {
      source: {
        timeS: timeS,
        实测: data1,
      },
    },
    {
      source: {
        timeS: timeS,
        模拟: data2,
      },
    },
  ],
  title: {
    text: mainTitle,
    subtext: subTitle,
    sublink: 'https://github.com/ecomfe/echarts-stat',
    left: 'center',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
    },
  },
  xAxis: {
    type: 'time',
    show: true,
    axisLine: {
      onZero: false,
      symbol: ['none', 'none'], // 箭头
    },
    axisTick: {
      show: 1,
      interval: 0,
    },
    axisLabel: {
      show: 1,
      formatter: '{MM}-{dd}/{mm}:{ss}',
      // formatter: function (value) {
      //     // 格式化时间戳，这里只是简单示例，可以根据需要调整
      //     var date = new Date(value);
      //     return date.getHours() + ':00';
      //     // return new Date(value).toLocaleString()
      //     // 如果需要更详细的日期显示，可以使用 `date.toLocaleString()` 或其他日期格式化方法
      // }
    },
    splitLine: {
      lineStyle: {
        type: 'dashed',
      },
    },
  },
  yAxis: {
    name: '输\n沙\n率\n(kg/s)',
    nameLocation: 'center',
    nameRotate: 0,
    nameGap: 50,
    nameTextStyle: {
      fontSize: 14,
      align: 'center',
      borderDashOffset: 200,
      verticalAlign: 'middle',
    },
    min: 0.3,
    max: -0.1,
    inverse: true,
    axisLine: {
      show: true,
      onZero: false,
      symbol: ['none', 'none'], // 箭头
    },
    // splitLine: {
    //   lineStyle: {
    //     type: 'dashed'
    //   }
    // }
  },
  series: [
    {
      id: '0',
      name: '模拟数据',
      type: 'scatter',
      datasetIndex: 1,
      symbolSize: 5,
      itemStyle: {
        color: 'red',
      },
    },
    {
      id: '1',
      name: '实测数据',
      type: 'line',
      smooth: false,
      datasetIndex: 0,
      symbolSize: 1,
      symbol: 'circle',
      label: { show: false, fontSize: 16 },
      labelLayout: { dx: -20 },
      encode: { label: 2, tooltip: 1 },
    },
  ],
};

option && myChart.setOption(option);
