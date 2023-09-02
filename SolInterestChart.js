import React, { useEffect, useState } from 'react';
import axios from 'axios';
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
const SolInterestChart = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://www.gstatic.com/charts/loader.js";
        script.onload = () => {
            window.google.charts.load('current', { packages: ['corechart', 'bar'] });
            window.google.charts.setOnLoadCallback(fetchData);
        };
        document.body.appendChild(script);
    }, []);

    const fetchData = () => {
        axios.get('http://localhost:8080/api/v1/loan_accounts/total-interest-by-sol')
            .then(response => {
                const filteredData = response.data.filter(item => item.sol_id !== "1609" && item.total_interest > 0)
                    .sort((a, b) => b.total_interest - a.total_interest);
                setData(filteredData);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    }
    const downloadChart = () => {
        const chartContainer = document.getElementById("chart_div");

        html2canvas(chartContainer).then(canvas => {
            canvas.toBlob(blob => {
                saveAs(blob, "chart.png");
            });
        });
    };
    useEffect(() => {
        if (data.length > 0 && window.google && window.google.visualization) {
            drawChart();
        }
    }, [data]);

    const drawChart = () => {
        const chartData = [
            ['SOL ID', 'Total Interest Payment'],
            ...data.map(item => [item.sol_id, item.total_interest])
        ];

        const dataTable = window.google.visualization.arrayToDataTable(chartData);
        const options = {
            title: 'Total amount of interest payment to be received from all customers mapped to a specific SOL ID',
            hAxis: {
                title: 'SOL_ID',
                textStyle: { fontSize: 10 },
                slantedText: true,
                slantedTextAngle: 45
            },
            vAxis: { title: 'Total Interest Payment',
                textStyle: { fontSize: 15 }
            },
            explorer: { actions: ['dragToPan'] },
            chartArea: {
                width: '83%',
                height: '60%'
            }, // Adjust width and height as needed
            bar: { groupWidth: '90%' }  // Makes bars thicker
        };

        const chart = new window.google.visualization.ColumnChart(document.getElementById('chart_div'));
        chart.draw(dataTable, options);
    };

    return (
        <div style={{ padding: 0, margin: 0 }}>
            <div className="scrollableContainer">
                <div id="chart_div" style={{ width: '320%', height: '1250px' }}></div> {/* Adjust width and height as needed */}
            </div>
            <button onClick={downloadChart}>Download Chart</button>
        </div>
    );
};

export default SolInterestChart;


