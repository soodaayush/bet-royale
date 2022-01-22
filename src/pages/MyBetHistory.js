import { useState, useEffect, useRef } from "react";

import Loading from "../components/Loading";
import BetHistoryTable from "../components/BetHistoryTable";
import { motion } from "framer-motion";
import BetService from "../api/Bet";
import '../styles/bet-history.scss'
import { Form } from 'react-bootstrap';
import moment from "moment";




const MyBetHistory = () => {
  const [activeBets, setActiveBets] = useState([]);
  const [completedBets, setCompletedBets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortedTable, setSortedTable] = useState([]);

  let sortVal = useRef("completedBets");
  
  useEffect(() => {
    let currentTime = moment.utc().local().format("YYYY/MM/DD h:mm A");
    setIsLoading(true);

    BetService.getInstance()
      .getBetHistory()
      .then((data) => {
        const betLogs = [];

        for (const key in data) {
          const betLog = {
            id: key,
            ...data[key],
          };
          betLogs.push(betLog);
        }
        setCompletedBets(betLogs);
        setSortedTable(betLogs)
      });

      
    BetService.getInstance()
    .getCurrentBets()
    .then((data) => {
      const currentBetLogs = [];

      for (const key in data) {
        const currentBetLog = {
          id: key,
          ...data[key],
        };
        currentBetLogs.push(currentBetLog);
      }
      setActiveBets(currentBetLogs.filter(bet => localStorage.getItem('username') === bet.betCreator && moment.utc(bet.results).local().format("YYYY/MM/DD h:mm A") > currentTime));
    });
      

    setIsLoading(false);

  }, []);

  function sortTable() {
    if(sortVal.current.value === "completedBets") {
      setSortedTable(completedBets);
    } else if(sortVal.current.value === "activeBets") {
      setSortedTable(activeBets);
    } 
  }



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
        <h1 className="text-4xl bet-history__title">My Betting History</h1>
        <div class="bet-history__desc bet-history__bg">
          <p>The below bets are either completed or active bets related to your Discord User.</p>
          {/* <QuestionCircle size={90}/> */}
        </div>
        <div className="bet-history__filter">
          <label htmlFor="betHistorySort">
            Sort by:
          </label>
          <Form.Select onChange={() => sortTable()} size="sm" ref={sortVal}>
            <option value="completedBets">Completed bets</option>
            <option value="activeBets">Active bets</option>
          </Form.Select>
        </div>
        <div className="bet-history__table-wrapper">
          <BetHistoryTable data={sortedTable} />
        </div>
      </div>
    </motion.div>
  );
};

export default MyBetHistory;
