import { useState, useEffect } from "react";

import Loading from "../components/Loading";
import BetHistoryTable from "../components/BetHistoryTable";
import { motion } from "framer-motion";
import BetService from "../api/Bet";
import "../styles/bet-history.scss";

const MyBetHistory = () => {
  const [betsHistoryLogs, setBetsHistoryLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    BetService.getInstance()
      .getBetsHistory()
      .then((data) => {
        const betsHistoryLogs = [];

        for (const key in data) {
          const betHistoryLog = {
            id: key,
            ...data[key],
          };

          betsHistoryLogs.push(betHistoryLog);
        }

        setBetsHistoryLogs(betsHistoryLogs);
      });

    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(2px)" }}
      transition={{ ease: "easeInOut" }}
      animate={{ opacity: 1, filter: "blur(0)" }}
      exit={{ opacity: 0, filter: "blur(2px)" }}
    >
      <div className="bet-history pt-4">
        <h1 className="text-4xl bet-history__title">General Betting History</h1>
        <div className="bet-history__desc bet-history__bg">
          <p>The below bets are completed bets from every Bet Royale User.</p>
        </div>
        <div className="bet-history__table-wrapper d-flex justify-content-center w-100">
          <BetHistoryTable data={betsHistoryLogs} />
        </div>
      </div>
    </motion.div>
  );
};

export default MyBetHistory;
