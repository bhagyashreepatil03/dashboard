import React, { useEffect, useState } from 'react';
import axios from 'axios';
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
const Reason4FailureChart = () => {
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
        axios.get('http://localhost:8080/api/v1/loan_accounts/failure-reason4-count')
            .then(response => {
                setData(response.data);
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
            ['CBO SRM ID', 'Count'],
            ...data.map(item => [item.cboSrmId, item.count])
        ];

        const dataTable = window.google.visualization.arrayToDataTable(chartData);
        const options = {
            title: 'Failure Reason Cust_Email_blank by CBO SRM ID',
            hAxis: {
                title: 'CBO SRM ID',
                slantedText: true
            },
            vAxis: {
                title: 'Count'
            },
            chartArea: {
                width: '70%',
                height: '60%'
            },
            bar: { groupWidth: '75%' }
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
                <h2>Failure Reason Customer Email is blank Count by CBO SRM ID</h2>
                <center><div id="chart_div" style={{ width: '400px', height: '400px' }}></div></center>
            </div>
            <button onClick={downloadChart}>Download Chart</button>
        </div>
    );
};

export default Reason4FailureChart;