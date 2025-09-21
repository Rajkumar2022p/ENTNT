
import Navbar from "./components/common/Navbar"
import JobCard from "./components/Jobs/JobCard";
import JobsBoard from "./components/Jobs/JobsBoard";
import { makeServer } from "./mirage/server";

makeServer(); // 👈 Start MirageJS server
function App() {
  return (
    <div className="App">
      <header className="App-header">
      
        
       
      </header>
      <div>
        <Navbar/>
        
    </div>
    <div className="H">
       <JobsBoard/>
    </div>
    </div>
  );
}

export default App;
