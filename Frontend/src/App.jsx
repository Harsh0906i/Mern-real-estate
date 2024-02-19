import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './Pages/Home';
import Signup from "./Pages/Signup";
import Signin from "./Pages/Signin";
import About from "./Pages/About";
import Profile from "./Pages/Profile";
import Header from "./Components/Header";
function App() {
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
