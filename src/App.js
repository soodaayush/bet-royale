import { BrowserRouter as Router, Route, useLocation } from "react-router-dom";

import Header from "./components/Header";
import Home from "./pages/Home";
import CreateBet from "./pages/CreateBet";
import MyBetHistory from "./pages/MyBetHistory";
import BetHistory from "./pages/BetHistory";
import Guide from "./pages/Guide";
import Footer from "./components/Footer";
import Bet from "./pages/Bet"
import { AnimatePresence } from 'framer-motion';
import "./styles/header.scss";
import "./index.scss";
import "./styles/main.scss";
import "./styles/bettingtable.scss";
import "./styles/modal.scss";
import "./styles/footer.scss";


import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const location = useLocation();
  return (
    <div
      id="main-container"
      className="min-vh-100 px-4 font-poppins text-white"
    >
      <Header />
      <AnimatePresence exitBeforeEnter>
      <Router location={location} key={location.pathname}>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/createBet" exact>
          <CreateBet />
        </Route>
        <Route path="/my-bets-history" exact>
          <MyBetHistory />
        </Route>
        <Route path="/bets-history" exact>
          <BetHistory />
        </Route>
        <Route path="/guide" exact>
          <Guide />
        </Route>
        <Route path="/bet/:id">
          <Bet/>
          </Route>
      </Router>
      <Footer />
      </AnimatePresence>
    </div>
  );
};

export default App;
