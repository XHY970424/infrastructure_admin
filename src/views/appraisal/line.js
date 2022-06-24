// 柱状图
export const Columnar=(data)=>{
  return {
    title: {
      text: data.title,
      left: "center",
    },
    // color:data.colorChart,
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    // legend: {
    //   orient: "vertical",
    //   left: "left",
    // },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        data: data.name,
        axisTick: {
          alignWithLabel: true,
        },
      },
    ],
    yAxis: [
      {
        type: "value",
      },
    ],
    series: [
      {
        name: "分数",
        type: "bar",
        barWidth: "60%",
        data: data.value,
      },
    ],
  }
};
//环状图
export const pie =(data)=>{
  return {
    title: {
      text: data.title,
      left: "center",
    },
    color: data.colorChart,
    // tooltip: {
    //   trigger: "item",
    // },
    legend: {
      orient: "vertical",
      left: "right",
      // bottom: "bottom",
      padding: [150, 50, 0, 0],
    },
  
    series: [
      {
        name: "分类",
        type: "pie",
        radius: "50%",
        data: data.objChart,
        label: {
          alignTo: "edge",
          formatter: "{name|{b}}\n{time| {d} %}",
          rich: {
            time: {
              fontSize: 18,
              color: "#333",
            },
          },
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  }
};
// 雷达图
export const radar=(data)=>{
  console.log(data)
  return {
    color: ["#fff"],
    
    radar: {
      shape: "circle",
      indicator: data.value,
      name:{
        textStyle:{color:'#1283F9'},
       },
      axisLine: { // (圆内的几条直线)坐标轴轴线相关设置
        lineStyle: {
            color: '#fff',
            // 坐标轴线线的颜色。
            width: 1,
            // 坐标轴线线宽。
            type: 'solid',
            // 坐标轴线线的类型。
        },
      },
      splitLine: { // (这里是指所有圆环)坐标轴在 grid 区域中的分隔线。
        lineStyle: {
            // color: '#fff',
            // 分隔线颜色
            width: 0,
            // 分隔线线宽
        }
    },
      splitArea : {
        show : true,   
        areaStyle : {
            color: ["#1283F9","##2792FF","#489FF9","#74BDFF","#B9DBF9"]  // 图表背景网格的颜色
        }
    },
    },
    series: [
      {
        type: "radar",
        areaStyle: {},
        itemStyle: {
          normal: {
              color : "#0073FF", // 图表中各个图区域的边框线拐点颜色
              lineStyle: {
                  color:"#0756B6" // 图表中各个图区域的边框线颜色
              },
              areaStyle: {
                  type: 'default'
              }
          }
      },
        data: [
          {
            value: data.count,
            color:"#fff",
            symbolSize: 5,
            label: {
              show: true,
              color:"#333",
              formatter: function (params) {
                return params.value;
              },
            },
          },
        ],
        
      },
    ],
  }
 
};
