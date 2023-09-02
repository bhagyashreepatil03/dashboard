import React, { useEffect, useState } from 'react';
import axios from 'axios';
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";

const TotalInterestPayment = () => {
    const [data, setData] = useState([]);
    const [totalInterest, setTotalInterest] = useState(0);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://www.gstatic.com/charts/loader.js";
        script.onload = () => {
            window.google.charts.load('current', { packages: ['corechart'] });
            window.google.charts.setOnLoadCallback(fetchData);
        };
        document.body.appendChild(script);
    }, []);

    const fetchData = () => {
        axios.get('http://localhost:8080/api/v1/loan_accounts/total-interest-by-sol')
            .then(response => {
                const filteredData = response.data.filter(item => item.total_interest > 0);
                setData(filteredData);

                const total = filteredData.reduce((acc, curr) => acc + curr.total_interest, 0);
                setTotalInterest(total);
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
            is3D: true
        };

        const chart = new window.google.visualization.PieChart(document.getElementById('chart_div'));
        chart.draw(dataTable, options);
    };

    return (
        <div>

            <div id="chart_div" style={{ width: '130%', height: '500px' }}></div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <h3>Total Interest Payment: {totalInterest.toFixed(2)}</h3>  {/* Displaying total interest received by all SOL IDs */}
            </div>
            <button onClick={downloadChart}>Download Chart</button>
        </div>
    );
};
export default TotalInterestPayment;