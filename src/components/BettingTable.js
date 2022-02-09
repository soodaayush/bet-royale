import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { Trash, BoxArrowUpRight } from "react-bootstrap-icons";
import moment from "moment";
import Web3 from "web3";
import Masonry from "react-masonry-css";
import { motion } from "framer-motion";

import BetService from "../api/Bet";

import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

import ModalDesc from "../components/modals/ModalDesc";
import ModalAlert from "../components/modals/ModalAlert";
import ModalBetOption from "../components/modals/ModalBetOption";
import ModalBetResult from "../components/modals/ModalBetResult";
import ModalDeleteBet from "../components/modals/ModalDeleteBet";

const BettingTable = (props) => {
  const [betState, setBetState] = useState([]);
  const [betData, setBetData] = useState();
  const [allBets, setAllBets] = useState([]);

  const [alertModal, setAlertModal] = useState(false);
  const [descriptionModal, setDescriptionModal] = useState(false);
  const [description, setDescription] = useState("");
  const [betOptionModal, setBetOptionModal] = useState(false);
  const [betDeleteModal, setBetDeleteModal] = useState(false);
  const [betResultModal, setBetResultModal] = useState(false);

  const [betToast, setBetToast] = useState(false);
  const [betToastDescription, setBetToastDescription] = useState("");
  const [betOptions, setBetOptions] = useState("");
  const [betID, setBetID] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  const web3 = new Web3(Web3.givenProvider);

  useEffect(() => {
    const currentBets = props.data;
    setAllBets(currentBets);
  }, [props.data, props.betHistoryData]);

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

          if (objData.participants === "none") {
            objData.participants = [];
          }

          objData.participants.push({
            address: localStorage.getItem("address"),
            selectedOption: objData.selectedOption,
          });

          setBetToast(true);
          setBetToastDescription("This bet has been successfully placed!");

          setBetState([...betState, objData.id]);

          setBetData();

          incrementCurrentBetters(objData);
        });
    } catch (error) {
      console.log(error);

      setBetOptionModal(false);
      setBetOptions("");

      setBetToast(true);
      setBetToastDescription("Bet successfully rejected");
    }
  }

  function openDescriptionModal(description) {
    setDescription(description);
    setDescriptionModal(true);
  }

  function closeBetDeleteModal() {
    setBetDeleteModal(false);
    setDescription("");
  }

  function openBetDeleteModal(id, name) {
    setBetDeleteModal(true);
    setDescription(`Are you sure you want to delete "${name}"?`);
    setBetID(id);
  }

  function closeBetToast() {
    setBetToast(false);
  }

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

    if (localStorage.getItem("chainID") !== "0x63564c40") {
      setAlertModal(true);
      setDescription("Please connect to the Harmony Mainnet Shard 0!");
      return;
    }

    setBetData(bet);

    let newOptions = bet.choices.split(",");

    setBetOptionModal(true);
    setBetOptions(newOptions);
  }

  function incrementCurrentBetters(data) {
    let selectedOption = data.selectedOption;

    delete data.selectedOption;

    data.currentBets = data.currentBets + 1;
    BetService.getInstance().editBet(data, data.id);

    data.selectedOption = selectedOption;

    BetService.getInstance().logBet(data);
  }

  function openBetResultsModal(bet) {
    if (!localStorage.getItem("username")) {
      setAlertModal(true);
      setDescription("Please login with Discord!");
      return;
    }

    setBetData(bet);

    let newOptions = bet.choices.split(",");

    setBetResultModal(true);
    setBetOptions(newOptions);
  }

  const breakpointColumnsObj = {
    default: 3,
    992: 2,
    576: 1,
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);
  const variants = {
    loaded: {
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: "backIn",
      },
    },
    notLoaded: { opacity: 0 },
  };
  return (
    <div className="w-100 betting-table__wrapper">
      <ModalDesc
        betDesc={description}
        descState={descriptionModal}
        descStateChanger={setDescriptionModal}
      />
      <ModalAlert
        alertDesc={description}
        alertState={alertModal}
        alertStateChanger={setAlertModal}
      />
      <ModalBetOption
        betOptions={betOptions}
        betOptState={betOptionModal}
        betOptStateChanger={setBetOptionModal}
        betData={betData}
        placeBetFunc={placeBet}
      />
      <ModalBetResult
        betData={betData}
        betOptions={betOptions}
        betResultState={betResultModal}
        betResultStateChanger={setBetResultModal}
      />
      <ModalDeleteBet
        deleteDesc={description}
        betId={betID}
        betDeleteStateChanger={closeBetDeleteModal}
        betDeleteState={betDeleteModal}
      />
      <ToastContainer>
        <Toast className="bet-toast" show={betToast}>
          <div className="bg-white text-black rounded">
            <div className="toast-header bg-closeBetDeleteModalsuccess text-white">
              <strong className="me-auto text-black">Alert</strong>
              <button
                type="button"
                className="btn-close btn-close-black"
                data-bs-dismiss="toast"
                aria-label="Close"
                onClick={closeBetToast}
              ></button>
            </div>
            <div className="toast-body">{betToastDescription}</div>
          </div>
        </Toast>
      </ToastContainer>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        id="betting-table"
        className="betting-table w-100"
      >
        {allBets.map((currentBet, index) => (
          <motion.div
            className="betting-table__bet"
            key={currentBet.id}
            index={index}
            animate={isLoaded ? "loaded" : "notLoaded"}
            variants={variants}
          >
            <div className="betting-table__bet__header">
              <h3 className="betting-table__bet__name">{currentBet.name}</h3>
              <Link
                className="betting-table__bet__header__link"
                to={{
                  pathname: "/bet/" + currentBet.id,
                  state: { currentBet: currentBet },
                }}
              >
                <BoxArrowUpRight />
              </Link>
            </div>
            <div className="betting-table__bet__body">
              <div className="betting-table__bet__body__desc">
                <p>
                  {currentBet.shortDescription}
                  <br />
                  <button
                    onClick={() => openDescriptionModal(currentBet.description)}
                  >
                    Read full description
                  </button>
                </p>
              </div>
              <div className="betting-table__bet__body__data">
                <h4>About the Bet</h4>
                <ul>
                  <li>
                    <span>Deadline:</span>{" "}
                    {moment
                      .utc(currentBet.deadline)
                      .local()
                      .format("YYYY/MM/DD h:mm A")}
                  </li>
                  <li>
                    <span>Results: </span>
                    {moment
                      .utc(currentBet.results)
                      .local()
                      .format("YYYY/MM/DD h:mm A")}
                  </li>
                  <li>
                    <span>Bet Size: </span>
                    {currentBet.size} ROY
                  </li>
                  <li>
                    <span>Players / Pot:</span>
                    {currentBet.currentBets}/{currentBet.maxBetters}
                  </li>
                  {currentBet.selectedChoice && (
                    <li className="betting-table__bet__body__data__result">
                      <span>Result:</span>
                      {currentBet.selectedChoice}
                    </li>
                  )}
                </ul>
              </div>
              <div className="betting-table__bet__body__placebet">
                {!betState.includes(currentBet.id) &&
                  moment.utc(currentBet.results).format("x") > +new Date() &&
                  moment.utc(currentBet.deadline).format("x") > +new Date() &&
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
                {moment.utc(currentBet.results).format("x") < +new Date() &&
                  !currentBet.selectedChoice &&
                  localStorage.getItem("username") !==
                    currentBet.betCreator && (
                    <button className="outline-none btn no-cursor">
                      Results coming soon
                    </button>
                  )}
                {localStorage.getItem("username") === "WarBaddy#8953" &&
                  moment.utc(currentBet.results).format("x") < +new Date() &&
                  !currentBet.selectedChoice && (
                    <button
                      className="outline-none btn mt-3 set-result"
                      onClick={() => openBetResultsModal(currentBet)}
                    >
                      Set Result
                    </button>
                  )}
                {moment.utc(currentBet.deadline).format("x") < +new Date() &&
                  moment.utc(currentBet.results).format("x") > +new Date() && (
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
                  <button
                    disabled
                    className="outline-none btn placed no-cursor"
                  >
                    Bet Placed
                  </button>
                )}
                {currentBet.currentBets === parseInt(currentBet.maxBetters) &&
                  moment.utc(currentBet.deadline).format("x") > +new Date() &&
                  moment.utc(currentBet.results).format("x") > +new Date() && (
                    <button className="outline-none btn placement-full">
                      Bet Placements Full
                    </button>
                  )}
              </div>
            </div>
            <div className="betting-table__bet__footer">
              <div className="betting-table__bet__footer__creator text-center d-flex justify-content-center align-items-center mt-1">
                {localStorage.getItem("username") === currentBet.betCreator && (
                  <div>
                    <Trash
                      className="trash"
                      onClick={() =>
                        openBetDeleteModal(currentBet.id, currentBet.name)
                      }
                    />
                  </div>
                )}
                Bet created by {currentBet.betCreator}
              </div>
            </div>
          </motion.div>
        ))}
      </Masonry>
    </div>
  );
};

export default BettingTable;
