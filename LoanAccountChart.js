import React, { useEffect, useState } from 'react';
import axios from 'axios';
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
const LoanAccountChart = () => {
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
        axios.get('http://localhost:8080/api/v1/loan_accounts/good-customers')
            .then(response => {
                setData(response.data); // No need to filter as we trust the data source
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
            ['CBO SRM ID', 'Count'],
            ...data.map(item => [item.cbo_srm_id, item.count])
        ];

        const dataTable = new window.google.visualization.arrayToDataTable(chartData);
        const options = {
            title: 'Good Customers Count by CBO SRM ID',
            hAxis: {
                title: 'CBO SRM ID',
                slantedText: true
            },
            vAxis: {
                title: 'Count'
            },
            explorer: { actions: ['dragToPan'] },
            chartArea: {
                width: '83%',
                height: '60%'
            },
            bar: { groupWidth: '90%' }
        };

        const chart = new window.google.visualization.ColumnChart(document.getElementById('chart_div'));
        chart.draw(dataTable, options);
    };

    return (
        <div>
            <h2>Good Customers Count by CBO SRM ID</h2>
            <div className="scrollableContainer">
                <div id="chart_div" style={{ width: '1800px', height: '500px' }}></div>
            </div>
            <button onClick={downloadChart}>Download Chart</button>
        </div>
    );
};

export default LoanAccountChart;


