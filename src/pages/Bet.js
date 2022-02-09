import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import BetService from "../api/Bet";
import "../styles/bet-details.scss";
import ReactHtmlParser from "react-html-parser";
import moment from "moment";
import { motion } from "framer-motion";
import Loading from "../components/Loading";
import { ArrowLeftCircleFill } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

import ModalAlert from "../components/modals/ModalAlert";
import ModalBetOption from "../components/modals/ModalBetOption";
import ModalBetResult from "../components/modals/ModalBetResult";

import Web3 from "web3";

function Bet(props) {
  const [currentBet, setCurrentBet] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [betState, setBetState] = useState([]);
  const [betData, setBetData] = useState();
  const [betOptions, setBetOptions] = useState("");

  const [alertModal, setAlertModal] = useState(false);
  const [description, setDescription] = useState("");
  const [betOptionModal, setBetOptionModal] = useState(false);
  const [betResultModal, setBetResultModal] = useState(false);
  const [creatorUrl, setCreatorUrl] = useState();
  const web3 = new Web3(Web3.givenProvider);

  const { id } = useParams();

  useEffect(() => {
    setIsLoading(true);
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
        const betIndex = currentBetLogs.findIndex((bet) => bet.id === id);
        setCurrentBet(currentBetLogs[betIndex]);
        setCreatorUrl(
          currentBetLogs[betIndex].betCreator
            .replace(/[0-9]/g, "")
            .replace("#", "")
        );
      });
    setIsLoading(false);
  }, [id]);

  function openBetOptionModal(bet) {
    if (!window.ethereum) {
      setAlertModal(true);
      setDescription("Please install Metamask!");
      return;
    }

    if (!localStorage.getItem("address")) {
      setAlertModal(true);
      setDescription("Please connect your wallet!");
      return;
    }

    if (!localStorage.getItem("username")) {
      setAlertModal(true);
      setDescription("Please connect your Discord account!");
      return;
    }

    if (
      localStorage.getItem("chainID") !== "0x63564c40" &&
      localStorage.getItem("chainID") !== "0x63564c41" &&
      localStorage.getItem("chainID") !== "0x63564c42" &&
      localStorage.getItem("chainID") !== "0x63564c43"
    ) {
      setAlertModal(true);
      setDescription("Please connect to the Harmony Mainnet!");
      return;
    }

    setBetData(bet);

    let newOptions = bet.choices.split(",");

    setBetOptionModal(true);
    setBetOptions(newOptions);
  }

  function openBetResultsModal(bet) {
    if (!window.ethereum) {
      setAlertModal(true);
      setDescription("Please install Metamask!");
      return;
    }

    if (!localStorage.getItem("address")) {
      setAlertModal(true);
      setDescription("Please connect your wallet!");
      return;
    }

    setBetData(bet);

    let newOptions = bet.choices.split(",");

    setBetResultModal(true);
    setBetOptions(newOptions);
  }

  async function placeBet(data) {
    await handleBet({
      objData: data,
    });
  }
  async function handleBet({ objData }) {
    try {
      await window.ethereum.send("eth_requestAccounts");

      let tokenAddress = "0xfe1b516a7297eb03229a8b5afad80703911e81cb";
      let toAddress = "0x2ADe6e328953a132911e0ad197E68BE882865241";
      let fromAddress = localStorage.getItem("address");

      let decimals = web3.utils.toBN(18);

      let amount = web3.utils.toBN(parseInt(objData.size));

      let minABI = [
        {
          constant: false,
          inputs: [
            {
              name: "_to",
              type: "address",
            },
            {
              name: "_value",
              type: "uint256",
            },
          ],
          name: "transfer",
          outputs: [
            {
              name: "",
              type: "bool",
            },
          ],
          type: "function",
        },
      ];

      let contract = new web3.eth.Contract(minABI, tokenAddress);

      let value = amount.mul(web3.utils.toBN(10).pow(decimals));

      contract.methods
        .transfer(toAddress, value)
        .send({ from: fromAddress })
        .on("transactionHash", function (hash) {
          setBetOptionModal(false);
          setBetOptions("");

          setBetState([...betState, objData.id]);

          setBetData();

          incrementCurrentBetters(objData);
        });
    } catch (error) {
      console.log(error);

      setBetOptionModal(false);
      setBetOptions("");
    }
  }

  function incrementCurrentBetters(data) {
    let selectedOption = data.selectedOption;

    delete data.selectedOption;

    data.currentBets = data.currentBets + 1;
    BetService.getInstance().editBet(data, data.id);

    data.selectedOption = selectedOption;

    BetService.getInstance().logBet(data);
  }

  if (isLoading) {
    return <Loading />;
  }
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(2px)" }}
      transition={{ ease: "easeInOut", duration: 0.5, delay: 1 }}
      animate={{ opacity: 1, filter: "blur(0)" }}
      exit={{ opacity: 0, filter: "blur(2px)" }}
      key="betDetails"
    >
      <ModalAlert
        alertDesc={description}
        alertState={alertModal}
        alertStateChanger={setAlertModal}
      />
      <ModalBetOption
        placeBetFunc={placeBet}
        betOptions={betOptions}
        betOptState={betOptionModal}
        betOptStateChanger={setBetOptionModal}
        betData={betData}
      />
      <ModalBetResult
        betData={betData}
        betOptions={betOptions}
        betResultState={betResultModal}
        betResultStateChanger={setBetResultModal}
      />
      <div className="mt-5 bet-details">
        <div className="bet-details__heading">
          <h1 className="text-cente bet-details__heading__name">
            {currentBet.name}
          </h1>
          <div className="bet-details__sub">
            <div className="bet-details__sub__avatar">
              <div className="bet-details__sub__avatar__img">
                <img
                  src={`https://avatars.dicebear.com/api/initials/${creatorUrl}.svg`}
                  alt=""
                />
              </div>
              <span className="bet-details__sub__avatar__name">
                {currentBet.betCreator}
              </span>
            </div>
            <p className="bet-details__sub__text bet-details__bg">
              {currentBet.shortDescription}
            </p>
          </div>
        </div>
        <div className="bet-details__main ">
          <div className="bet-details__main__data__wrapper">
            <h3>Bet Details</h3>
            <div className="bet-details__main__data bet-details__bg">
              <ul>
                <li>
                  Deadline:
                  <span>
                    {moment
                      .utc(currentBet.deadline)
                      .local()
                      .format("YYYY/MM/DD h:mm A")}
                  </span>
                </li>
                <li>
                  Results:
                  <span>
                    {moment
                      .utc(currentBet.results)
                      .local()
                      .format("YYYY/MM/DD h:mm A")}
                  </span>
                </li>
                <li>
                  Bet Size: <span>{currentBet.size}</span>
                </li>
                <li>
                  Players / Pot:{" "}
                  <span>
                    {currentBet.currentBets} Bets /{" "}
                    {currentBet.currentBets * currentBet.size} ROY
                  </span>
                </li>
                <li>
                  Maximum Betters: <span>{currentBet.maxBetters}</span>
                </li>
                {currentBet.selectedChoice && (
                  <li className="betting-table__bet__body__data__result">
                    <span>Result:</span>
                    {currentBet.selectedChoice}
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="bet-details__main__description_wrapper">
            <h3>Full Bet description</h3>
            <div className="bet-details__main__description bet-details__bg">
              {ReactHtmlParser(currentBet.description)}
            </div>
          </div>

          <div className="bet-details__main__placebet">
            {!betState.includes(currentBet.id) &&
              moment(currentBet.results).format("x") > +new Date() &&
              moment(currentBet.deadline).format("x") > +new Date() &&
              parseInt(currentBet.currentBets) !==
                parseInt(currentBet.maxBetters) &&
              !currentBet.selectedChoice && (
                <button
                  className="outline-none btn"
                  onClick={() => openBetOptionModal(currentBet)}
                >
                  Place Bet
                </button>
              )}
            {moment(currentBet.results).format("x") < +new Date() &&
              !currentBet.selectedChoice &&
              localStorage.getItem("username") !== currentBet.betCreator && (
                <button className="outline-none btn no-cursor">
                  Results coming soon
                </button>
              )}
            {currentBet.betCreator === localStorage.getItem("username") &&
              moment(currentBet.results).format("x") < +new Date() &&
              !currentBet.selectedChoice && (
                <button
                  className="outline-none btn mt-3 set-result"
                  onClick={() => openBetResultsModal(currentBet)}
                >
                  Set Result
                </button>
              )}
            {moment(currentBet.deadline).format("x") < +new Date() &&
              moment(currentBet.results).format("x") > +new Date() && (
                <button className="outline-none btn no-cursor">
                  Deadline Passed
                </button>
              )}
            {currentBet.selectedChoice && (
              <button className="outline-none btn finished no-cursor">
                Bet Finished
              </button>
            )}
            {betState.includes(currentBet.id) && (
              <button disabled className="outline-none btn placed no-cursor">
                Bet Placed
              </button>
            )}
            {currentBet.currentBets === parseInt(currentBet.maxBetters) &&
              moment(currentBet.deadline).format("x") > +new Date() &&
              moment(currentBet.results).format("x") > +new Date() && (
                <button className="outline-none btn placement-full">
                  Bet Placements Full
                </button>
              )}
            <button className="bet-details__goback">
              <Link className="bet-details__goback" to="/">
                <ArrowLeftCircleFill />
                Back to Bet Table
              </Link>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
export default Bet;
