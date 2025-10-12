import React, {useState} from 'react';
import './ApexChart.css';
import ReactApexChart from "react-apexcharts";

const DailyCharts = ({revenue}) => {

    const [series] = useState({
        series: [{
            name: 'Продажі',
            type: 'line',
            data: revenue.totalPrice
        }, {
            name: 'Дохід',
            type: 'line',
            data: revenue.totalProfit
        }],
        options: {
            tooltip: {
                enabled: true,
                hideEmptySeries: true,
                theme: "light",
                x: {
                    show: false
                },
                followCursor: true,

                custom: function ({series, seriesIndex, dataPointIndex, w}) {
                    return (
                        '<div style="background: rgba(22, 27, 37, .6);color: #fff;padding: 8px 16px;border-radius: 10px;font-size: 14px;">' +
                        "<span>" +
                        w.globals.seriesNames[seriesIndex] +
                        ": " +
                        series[seriesIndex][dataPointIndex] + " ₴" +
                        "</span>" +
                        "</div>"
                    )
                }
            },
            chart: {
                height: 350,
                type: 'line',
                stacked: false,
                toolbar: {
                    show: false
                }
            },
            stroke: {
                curve: 'smooth',
                width:2
            },
            legend: {
                show: true,
                showForSingleSeries: true,
                showForNullSeries: true,
                showForZeroSeries: true,
                position: 'top',
                horizontalAlign: 'right',
                fontFamily: 'e-Ukraine-light,serif',
                labels: {
                    colors: '#5e5e5e'
                }
            },
            dataLabels: {
                enabled: false
            },
            theme: {
                mode: 'light'
            },
            colors: ['#ffcc00', '#fc1b1b', '#46b211', '#1f4ce5', '#FF9800'],
            grid: {
                show: true,
                borderColor: '#cecece',
                strokeDashArray: 5,
                position: 'back',
            },
            fill: {
                type: 'solid'
            },
            xaxis: {
                type: 'category',
                labels: {
                    style: {
                        colors: "#5e5e5e",
                        fontSize: "12px !important"
                    }
                },
                tooltip: {
                    enabled: false
                }
            },
            yaxis: {
                stepSize: 1000,
                labels: {
                    style: {
                        colors: "#5e5e5e",
                        fontSize: "12px !important"
                    }
                },
            },
            labels: revenue.day,
        }

    });

    return (
        <div className="charts_container">
            <div className="customApexCharts">
                <h2>Місячна динаміка продажів, грн.</h2>
                <ReactApexChart options={series.options} series={series.series} type="area" height={350}/>
            </div>
        </div>
    );
};

export default DailyCharts;