import "./mainChart.css";
import React, { useEffect, useState } from "react";
import ApexCharts from "apexcharts";
import ReactApexChart from "react-apexcharts";

function MainChart(props) {

  const {
    portfolio,
    option
  } = props

  let today = new Date();
  let aWeekAgo = new Date();
  aWeekAgo.setDate(today.getDate() - 7);
  var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  var lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0 );
  var firstOfYear = new Date(today.getFullYear(), 1, 1);
  var lastOfYear = new Date(today.getFullYear(), 12, 31);
  
  const [series, setSeries] = useState([
    { name: "yield",
      data: [],
    }]);
  
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
  })
  const [selection, setSelection] = useState('one_month')

  useEffect(() => {
    setTimeout(() => {
      if(portfolio.length > 0){
      setSeries([{
        data: portfolio[0].apexData.data
      }]);
      }
    }, 0)
    

  }, [portfolio]);

  const updateData = (timeline) => {
    setSelection(timeline)
    switch (selection) {
      case "one_week":
        ApexCharts.exec(
          "area-datetime",
          "zoomX",
          new Date(aWeekAgo).getTime(),
          new Date().getTime()
        );
        break;
      case "one_month":
        ApexCharts.exec(
          "area-datetime",
          "zoomX",
          new Date(firstDay).getTime(),
          new Date(lastDay).getTime()
        );
        break;
      case "one_year":
        ApexCharts.exec(
          "area-datetime",
          "zoomX",
          new Date(firstOfYear).getTime(),
          new Date(lastOfYear).getTime()
        );
        break;
      case "all":
        ApexCharts.exec(
          "area-datetime",
          "zoomX",
          new Date("18 May 2020").getTime(),
          new Date().getTime()
        );
        break;
      default:
    }
  }

  if(option === 0){
    updateData("all");
  } else if(option === 1){
    console.log('one week');
    updateData("one_week");
  }

  return (
      <div id="chart">
        <div class="toolbar">
          <button
            id="one_week"
            onClick={() => updateData("one_week")}
            className={selection === "one_week" ? "active" : ""}
          >
            1W
          </button>
          &nbsp;
          <button
            id="one_month"
            onClick={() => updateData("one_month")}
            className={selection === "one_month" ? "active" : ""}
          >
            1M
          </button>
          &nbsp;
          <button
            id="one_year"
            onClick={() => updateData("one_year")}
            className={selection === "one_year" ? "active" : ""}
          >
            1Y
          </button>
          &nbsp;
          <button
            id="all"
            onClick={() => updateData("all")}
            className={selection === "all" ? "active" : ""}
          >
            ALL
          </button>
        </div>

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