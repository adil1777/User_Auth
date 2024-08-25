import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterPage from "./Pages/RegisterPage";
import LoginPage from "./Pages/LoginPage";
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
