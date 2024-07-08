import GlobalNavbar from './components/globalNavbar';
import {
  Route,
  Routes,
} from "react-router-dom";
import Home from './components/home';
import Guides from './components/guides';
import Experts from './components/experts';
import Browse from './components/browse';
import Payment from './components/payment';
import Forum from './components/forum';

function App() {
  return (
    <div>
      <GlobalNavbar />
      <Routes>
        <Route path="/" element={<Home />} exact />
        <Route path="/guides" element={<Guides />} />
        <Route path="/experts" element={<Experts />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/forum" element={<Forum />} />
      </Routes>
    </div>
  )
}

export default App;