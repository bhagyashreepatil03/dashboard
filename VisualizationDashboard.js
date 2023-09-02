import React, { useState } from 'react';
import LoanAccountFailureReasonsChart from './LoanAccountFailureReasonsChart';
import SolInterestChartPie from './TotalInterestPayment';
import SolInterestChart from "./SolInterestChart";
import TotalInterestPayment from "./TotalInterestPayment";
import LoanAccountChart from "./LoanAccountChart";
import Reason4FailureChart from "./Reason4FailureChart";

const VisualizationDashboard = () => {
    const [selectedOption, setSelectedOption] = useState('');
    const [chartTypeForSolId, setChartTypeForSolId] = useState('Bar'); // Default to Bar chart
    const [activeVisualization, setActiveVisualization] = useState(null);

    const handleDropdownChange = (e) => {
        setSelectedOption(e.target.value);
        if (e.target.value !== 'Interest by SOL ID') {
            setChartTypeForSolId('Bar');  // Reset to Bar chart if the option is not 'Interest by SOL ID'
        }
    };

    const handleGenerateClick = () => {
        switch (selectedOption) {
            case 'Interest by CBO SRM':
                setActiveVisualization(<LoanAccountFailureReasonsChart />);
                break;
            case 'Reason4Failure':
                setActiveVisualization(<Reason4FailureChart />);
                break;
            case 'Good Customers':
                setActiveVisualization(<LoanAccountChart />);
                break;
            case 'Interest by SOL ID':
                if (chartTypeForSolId === 'Bar') {
                    setActiveVisualization(<SolInterestChart />);
                } else if (chartTypeForSolId === 'Pie') {
                    setActiveVisualization(<TotalInterestPayment />);
                }
                break;
            default:
                setActiveVisualization(null);
        }
    };

    return (
        <div>
            {/* Dropdown for selecting visualization type */}
            <select value={selectedOption} onChange={handleDropdownChange}>
                <option value="" disabled>Select Visualization Type</option>
                <option value="Interest by CBO SRM">Sol id-wise count of number of cases marked with failure reason 1 and 4</option>
                <option value="Interest by SOL ID">Total amount of interest payment to be received from all customers mapped to a specific SOL ID</option>
                <option value="Good Customers">CBO SRM wise list of good customers (mails not sent for valid reason 2 and 3)</option>
                <option value="Reason4Failure">CBO SRM-wise (column name: cbo_srm_id) count of number of cases marked with Cust_Email_is_blank</option>
            </select>

            {/* Conditionally show the chart type dropdown */}
            {selectedOption === 'Interest by SOL ID' && (
                <select value={chartTypeForSolId} onChange={(e) => setChartTypeForSolId(e.target.value)}>
                    <option value="Bar">Bar Chart</option>
                    <option value="Pie">Pie Chart</option>
                </select>
            )}

            {/* Generate button */}
            <button className="generate-btn" onClick={handleGenerateClick}>Generate</button>

            {/* Placeholder area to display visualization */}
            <div className="visualization-container">
                {activeVisualization}
            </div>
        </div>
    );
};

export default VisualizationDashboard;





