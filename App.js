
import './App.css';
import TotalInterestPayment from "./TotalInterestPayment";
import LoanAccountChart from "./LoanAccountChart";
import SolInterestChart from "./SolInterestChart";
import VisualizationDashboard from "./VisualizationDashboard";
import LoanAccountFailureReasonsChart from "./LoanAccountFailureReasonsChart";
function App() {
  // return (
  //
  //     <div className="App">
  //       <h1>Dashboard</h1>
  //      {/*<TotalInterestPayment />*/}
  //      {/*   <LoanAccountChart />*/}
  //      {/*   <VisualizationDashboard />*/}
  //      {/*   <LoanAccountFailureReasonsChart/>*/}
  //         <SolInterestChart />
  //     </div>
  //
  // );
    return (

        <div className="App">
            <header className="App-header">
                <h1>Axis Data Analytics Dashboard</h1>
            </header>
            <main>
                <VisualizationDashboard />
            </main>
            <footer>
                <p>© Axis 2023</p>
            </footer>
        </div>
    );
}

export default App;
