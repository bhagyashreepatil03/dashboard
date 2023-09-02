import React, { useEffect, useState } from 'react';
import axios from 'axios';
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";

const LoanAccountFailureReasonsChart = () => {
    const [data, setData] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [srNo, setSrNo] = useState("");
    const [updateSuccess, setUpdateSuccess] = useState(false);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://www.gstatic.com/charts/loader.js";
        script.onload = () => {
            window.google.charts.load('current', { packages: ['corechart', 'bar'] });
            window.google.charts.setOnLoadCallback(fetchData);
        };
        document.body.appendChild(script);
    }, []);

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen]);

    const fetchData = () => {
        axios.get('http://localhost:8080/api/v1/loan_accounts/failure-counts')
            .then(response => {
                const filteredData = response.data.filter(item => item.sol_id === "NFS003" || !isNaN(Number(item.sol_id)));
                setData(filteredData);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    };
    const downloadChart = () => {
        const chartContainer = document.getElementById("chart_div");

        html2canvas(chartContainer).then(canvas => {
            canvas.toBlob(blob => {
                saveAs(blob, "chart.png");
            });
        });
    };

    const updateProcessingStatus = () => {
        // Call your API endpoint to update processing_status based on sr_no.
        axios.put(`http://localhost:8080/api/v1/loan_accounts/updateProcessingStatus`, null, {
            params: {
                sr_no: srNo,
                processing_status: 'Done'
            }
        })
            .then(response => {
                setUpdateSuccess(true);
                // Close the modal after a 3 seconds delay once updated successfully
                setTimeout(() => {
                    setModalOpen(false);
                    setUpdateSuccess(false);  // Reset the success state
                }, 2000);
                fetchData(); // Refetch the data after updating.
            })
            .catch(error => {
                console.error("Error updating data:", error);
            });
    };

    const drawChart = () => {
        const chartData = [
            ['SOL ID', 'Reason 1 Count', 'Reason 4 Count'],
            ...data.map(item => [item.sol_id, item.reason1Count, item.reason4Count])
        ];

        const dataTable = new window.google.visualization.arrayToDataTable(chartData);
        const options = {
            title: 'Loan Account Failures by SOL ID',
            hAxis: {
                title: 'SOL_ID',
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
            colors: ['#e95d4e', '#fbc658'],
            bar: { groupWidth: '90%' }
        };

        const chart = new window.google.visualization.ColumnChart(document.getElementById('chart_div'));
        chart.draw(dataTable, options);
    };

    useEffect(() => {
        if (data.length > 0 && window.google && window.google.visualization) {
            drawChart();
        }
    }, [data]);

    return (
        <div>
            <button onClick={() => setModalOpen(true)} className="update-btn">Update Processing Status</button>

            {isModalOpen && (
                <div className="modalBackdrop">
                    <div className="modal">
                        <h3>Update Processing Status</h3>
                        {updateSuccess ? (
                            <div>Status Updated Successfully!</div>
                        ) : (
                            <>
                                <label htmlFor="srNo">Enter SR No:</label>
                                <input type="text" id="srNo" value={srNo} onChange={(e) => setSrNo(e.target.value)} />

                                <button onClick={updateProcessingStatus} className="modal-btn update-modal-btn">Update</button>
                                <button onClick={() => { setModalOpen(false); setUpdateSuccess(false); }} className="modal-btn close-modal-btn">Close</button>
                            </>
                        )}
                    </div>
                </div>
            )}



            <div className="scrollableContainer">
                <h2>Loan Account Failures by SOL ID</h2>
                <div id="chart_div" style={{ width: '2000px', height: '500px' }}></div>
            </div>
            <button onClick={downloadChart}>Download Chart</button>
        </div>
    );
};


export default LoanAccountFailureReasonsChart;


