import { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { Modal, FloatingLabel, Form, FormGroup } from "react-bootstrap";
import { motion } from "framer-motion";
import "leo-profanity";
import BetService from "../api/Bet";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import moment from "moment";

import "../styles/createbet.scss";

const CreateBet = () => {
  let profanityFilter = require("leo-profanity");

  const [modal, setModal] = useState(false);
  const [description, setDescription] = useState("");
  const [convertedText, setConvertedText] = useState("");

  const betChoicesInputRef = useRef();
  const deadlineInputRef = useRef();
  const resultsInputRef = useRef();
  const maxBettersInputRef = useRef();
  const betValueInputRef = useRef();
  const titleInputRef = useRef();
  const descriptionInputRef = useRef();
  const shortDescriptionInputRef = useRef();

  const history = useHistory();

  function createBet(e) {
    e.preventDefault();

    const currentChoices = betChoicesInputRef.current.value;
    const currentDeadline = deadlineInputRef.current.value;
    const currentResults = resultsInputRef.current.value;
    const currentMaxBetters = maxBettersInputRef.current.value;
    const currentBetValue = betValueInputRef.current.value;
    const currentTitle = titleInputRef.current.value;
    const currentDescription = convertedText;
    const currentShortDescription = shortDescriptionInputRef.current.value;

    if (!localStorage.getItem("address")) {
      setModal(true);
      setDescription("Please sign in to your Metamask wallet!");
      return;
    }

    let today = +new Date();

    let formattedDeadline = parseInt(moment.utc(currentDeadline).format("x"));
    let formattedResults = parseInt(moment.utc(currentResults).format("x"));

    if (
      currentChoices === "" ||
      currentDeadline === "" ||
      currentResults === "" ||
      currentMaxBetters === "" ||
      currentBetValue === "" ||
      currentShortDescription === "" ||
      currentTitle === ""
    ) {
      setModal(true);
      setDescription("One or more of the fields have not been filled!");
      return;
    }

    for (let i = 0; i < profanityFilter.list().length; i++) {
      if (
        currentTitle.toLowerCase() === profanityFilter.list()[i] ||
        currentDescription.toLowerCase() === profanityFilter.list()[i] ||
        currentShortDescription.toLowerCase() === profanityFilter.list()[i] ||
        currentChoices.toLowerCase() === profanityFilter.list()[i]
      ) {
        setModal(true);
        setDescription("One or more of the fields contain profanity!");
        return;
      }
    }

    if (formattedDeadline < today) {
      setModal(true);
      setDescription("The deadline is in the past!");
      return;
    }

    if (formattedResults < today) {
      setModal(true);
      setDescription("The results is in the past!");
      return;
    }

    if (formattedDeadline > formattedResults) {
      setModal(true);
      setDescription("The results is before the deadline!");
      return;
    }

    if (parseInt(currentBetValue) <= 0) {
      setModal(true);
      setDescription("The bet size can't be less than or equal to 0!");
      return;
    }

    if (parseInt(currentMaxBetters) <= 0) {
      setModal(true);
      setDescription("The maximum betters can't be less than or equal to 0!");
      return;
    }

    const data = {
      choices: currentChoices,
      deadline: currentDeadline,
      name: currentTitle,
      description: currentDescription,
      shortDescription: currentShortDescription,
      results: currentResults,
      size: currentBetValue,
      currentBets: 0,
      maxBetters: currentMaxBetters,
      participants: "none",
      betCreator: localStorage.getItem("shortenedAddress"),
      betCreatorAddress: localStorage.getItem("address"),
    };

    BetService.getInstance()
      .createBet(data)
      .then(() => {
        history.push("/");
      });
  }

  function closeModal() {
    setModal(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(2px)" }}
      transition={{ ease: "easeInOut" }}
      animate={{ opacity: 1, filter: "blur(0)" }}
      exit={{ opacity: 0, filter: "blur(2px)" }}
    >
      <div className="container d-flex align-items-center flex-column pt-4 create-bet-form pb-4">
        <Modal show={modal}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Alert</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={closeModal}
              ></button>
            </div>
            <div className="modal-body">
              <p>{description}</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
        <h1 className="text-4xl mb-4">Create your Bet</h1>
        <Form>
          <FormGroup className="create-bet-form__wrap">
            <h3>Basic Bet information</h3>
            <p>
              Fill in the below information to create a bet. Please be aware
              that once submitted, changes to the bet cannot be done anymore.
            </p>
            <FloatingLabel
              className="create-bet-form__field create-bet-form__title"
              controlid="cbf-title"
              label="Enter the bet title"
            >
              <Form.Control
                aria-label="Title"
                aria-describedby="Title"
                ref={titleInputRef}
                controlid="cbf-title"
                type="text"
                placeholder="Enter the bet title"
              />
            </FloatingLabel>
            <FloatingLabel
              className="create-bet-form__field create-bet-form__short-desc"
              controlid="cbf-short-desc"
              label="One sentence about the bet"
            >
              <Form.Control
                controlid="cbf-short-desc"
                type="text"
                placeholder="Describe your bet in one sentence"
                ref={shortDescriptionInputRef}
              />
            </FloatingLabel>

            <ReactQuill
              className="create-bet-form__field create-bet-form__desc"
              theme="snow"
              value={convertedText}
              onChange={setConvertedText}
              ref={descriptionInputRef}
              placeholder="Describe your Bet in detail.."
            />
          </FormGroup>
          <div className="create-bet-form__config">
            <h3 className="create-bet-form__config__heading text-center mb-4">
              Configure your Bet
            </h3>
            <FormGroup className="create-bet-form__config__field create-bet-form__config__deadline">
              <label htmlFor="deadline" className="d-block">
                Deadline of the Bet
              </label>
              <p>
                The deadline of the bet defines the deadline for entering the
                bet. Once this pre-defined time is reached, no bet submissions
                are possible anymore. Remember, the time you set will be in UTC
                time for everyone, including you.
              </p>
              <input
                type="datetime-local"
                className="form-control text-center"
                placeholder="RoyBet Deadline"
                aria-label="Deadline"
                id="deadline"
                aria-describedby="basic-addon1"
                ref={deadlineInputRef}
              />
            </FormGroup>
            <FormGroup className="create-bet-form__config__field create-bet-form__config__result">
              <label htmlFor="results" className="d-block">
                Disclosure of the results
              </label>
              <p>
                Set a specific time to when the results of the bet are
                disclosed. At this point of time, a bet is meant to be fully
                done. Remember, the time you set will be in UTC time for
                everyone, including you.
              </p>
              <input
                type="datetime-local"
                className="form-control"
                placeholder="RoyBet Results"
                aria-label="Results"
                id="results"
                aria-describedby="basic-addon1"
                ref={resultsInputRef}
              />
            </FormGroup>
            <FormGroup className="create-bet-form__config__field create-bet-form__config__betters">
              <label htmlFor="maxBetters" className="d-block">
                Maximum number of betters?
              </label>
              <p>
                Set the maximum number of possible betters. Currently, the only
                limits are the one's you set.
              </p>
              <input
                type="number"
                className="form-control"
                placeholder="Max RoyBetters"
                aria-label="Max Betters"
                id="maxBetters"
                aria-describedby="basic-addon1"
                ref={maxBettersInputRef}
              />
            </FormGroup>
            <FormGroup className="create-bet-form__config__field create-bet-form__config__value">
              <label htmlFor="maxBetters" className="d-block">
                What is the bet value?
              </label>
              <p>
                Set the value of each submission on the bet. This is the value
                that every entry has to pay in order to participate.
              </p>
              <input
                type="number"
                className="form-control"
                placeholder="Bet value"
                aria-label="Bet Value"
                id="betValue"
                aria-describedby="basic-addon1"
                ref={betValueInputRef}
              />
            </FormGroup>
            <FormGroup className="create-bet-form__config__field create-bet-form__config__options">
              <label htmlFor="maxBetters" className="d-block">
                What are the possible choices?
              </label>
              <p>
                Set different possible options to win the bet. The options are
                separated with a comma (",")
              </p>
              <input
                type="text"
                className="form-control"
                placeholder="Option 1, Option 2, ..."
                aria-label="Results"
                id="results"
                aria-describedby="basic-addon1"
                ref={betChoicesInputRef}
              />
            </FormGroup>
            <button className="create-bet-form__submit" onClick={createBet}>
              Create RoyBet
            </button>
          </div>
        </Form>
      </div>
    </motion.div>
  );
};

export default CreateBet;
