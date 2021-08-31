import "./mainChart.css";
import React, { useEffect, useState } from "react";
// import ApexCharts from "apexcharts";
import ReactApexChart from "react-apexcharts";

function MainChart(props) {
  const { portfolio } = props;

  let today = new Date();
  let aWeekAgo = new Date();
  aWeekAgo.setDate(today.getDate() - 7);

  const [series, setSeries] = useState([{ name: "yield", data: [] }]);

  const [options, setObject] = useState({
    chart: {
      id: "area-datetime",
      type: "area",
      height: 350,
      toolbar: {
        show: true,
        tools: {
          download: false,
          selection: true,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false | '<img src="/static/icons/reset.png" width="20">',
        },
      },
      animations: {
        enabled: true,
      },
      zoom: {
        autoScaleYaxis: true,
        enabled: true,
      },
    },

    stroke: {
      width: 1.2,
    },
    annotations: {
      yaxis: [
        {
          y: 30,
          borderColor: "#999",
          label: {
            show: true,
            text: "Test",
            style: {
              color: "#fff",
              background: "#3c4682",
            },
          },
        },
      ],
      xaxis: [
        {
          x: new Date("14 Nov 2012").getTime(),
          borderColor: "#999",
          yAxisIndex: 0,
          label: {
            show: true,
            text: "Test2",
            style: {
              color: "#fff",
              background: "#3c4682",
            },
          },
        },
      ],
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
      style: "hollow",
    },
    xaxis: {
      type: "datetime",
      min: new Date(aWeekAgo).getTime(),
      max: new Date().getTime(),
      tickAmount: 6,
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy",
      },
    },

    //Gradient backgrount color
    colors: ["#28347d"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.6,
        opacityTo: 0.9,
        stops: [0, 100],
      },
    },
  });
  // const [selection, setSelection] = useState("one_month");

  // const [title, setTitle] = useState("7 Days");

  useEffect(() => {
    setTimeout(() => {
      if (portfolio.length > 0) {
        setSeries([
          {
            data: portfolio[0].apexData.data,
          },
        ]);
      }
    }, 0);
  }, [portfolio]);

  // const [selection, setSelection] = useState("one_month");

  // console.log(option);

  return (
    <div id="chart">
      <div class="toolbar"></div>

      <div id="chart-timeline">
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          width={"100%"}
          height={280}
        />
      </div>
    </div>
  );
}

export default MainChart;
