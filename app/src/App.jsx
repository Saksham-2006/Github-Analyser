import { Routes, Route } from "react-router-dom";

import AppLayout from "./layouts/AppLayout";

import Dashboard from "./pages/Dashboard";
import Activity from "./pages/Activity";
import Repos from "./pages/Repos";
import Analyze from "./pages/Analyze";

function App() {
  return (
    < div className="relative z-10" >
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/repos" element={<Repos />} />
          <Route path="/analyze" element={<Analyze />} />
        </Route>
      </Routes>
    </div >

  );
}

export default App;