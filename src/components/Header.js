import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Modal, Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { GetHash } from "../utils/Common";

import { HouseFill, NodePlusFill, Book } from "react-bootstrap-icons";

import BetService from "../api/Bet";

import logo from "../images/logo.svg";

const Header = () => {
  const location = useLocation();

  let profanityFilter = require("leo-profanity");

  const [modal, setModal] = useState(false);
  const [usernameModal, setUsernameModal] = useState(false);
  const [addressModal, setAddressModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [description, setDescription] = useState("");
  const [displayAddress, setDisplayAddress] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [username, setUsername] = useState("");

  const [expanded, setExpanded] = useState(false);

  const usernameInputRef = useRef();

  useEffect(() => {
    let encryptedAddress = GetHash(localStorage.getItem("address"));

    console.log(encryptedAddress);

    BetService.getInstance()
      .getUsername(encryptedAddress)
      .then((data) => {
        let userName = "";

        for (const key in data) {
          userName = data[key].username;
          break;
        }

        setUsername(userName);
      });
  }, []);

  window.ethereum.sendAsync(
    {
      method: "eth_accounts",
      params: [],
      jsonrpc: "2.0",
      id: new Date().getTime(),
    },
    function (error, info) {
      let startingAddress = info["result"][0].substring(0, 5);
      let endingAddress = info["result"][0].substr(
        info["result"][0].length - 3
      );

      localStorage.setItem("address", info["result"][0]);

      let shortenedAddress = `${startingAddress}...${endingAddress}`;

      localStorage.setItem("shortenedAddress", shortenedAddress);

      setDisplayAddress(shortenedAddress);
      setFullAddress(info["result"][0]);

      if (!username) {
        setUsername(shortenedAddress);
      }
    }
  );

  function connectToWallet() {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChangedHandler(result[0]);
          localStorage.setItem("address", result[0]);

          window.ethereum.request({ method: "eth_chainId" }).then((data) => {
            localStorage.setItem("chainID", data);
          });

          let encryptedAddress = GetHash(localStorage.getItem("address"));

          BetService.getInstance()
            .getUsername(encryptedAddress)
            .then((data) => {
              let userName = "";

              for (const key in data) {
                userName = data[key].username;
                break;
              }

              setUsername(userName);
            });

          window.ethereum.sendAsync(
            {
              method: "eth_accounts",
              params: [],
              jsonrpc: "2.0",
              id: new Date().getTime(),
            },
            function (error, info) {
              let startingAddress = info["result"][0].substring(0, 5);
              let endingAddress = info["result"][0].substr(
                info["result"][0].length - 3
              );

              localStorage.setItem("address", info["result"][0]);

              let shortenedAddress = `${startingAddress}...${endingAddress}`;

              localStorage.setItem("shortenedAddress", shortenedAddress);

              setDisplayAddress(shortenedAddress);
              setFullAddress(info["result"][0]);

              if (!username) {
                setUsername(shortenedAddress);
              }
            }
          );
        });
    } else {
      setModal(true);
      setDescription("Please install Metamask!");
    }
  }

  function accountChangedHandler(newAccount) {
    localStorage.setItem("address", newAccount);

    let encryptedAddress = GetHash(localStorage.getItem("address"));

    BetService.getInstance()
      .getUsername(encryptedAddress)
      .then((data) => {
        let userName = "";

        for (const key in data) {
          userName = data[key].username;
          break;
        }

        setUsername(userName);
      });

    window.ethereum.sendAsync(
      {
        method: "eth_accounts",
        params: [],
        jsonrpc: "2.0",
        id: new Date().getTime(),
      },
      function (error, info) {
        let startingAddress = info["result"][0].substring(0, 5);
        let endingAddress = info["result"][0].substr(
          info["result"][0].length - 3
        );

        localStorage.setItem("address", info["result"][0]);

        let shortenedAddress = `${startingAddress}...${endingAddress}`;

        localStorage.setItem("shortenedAddress", shortenedAddress);

        setDisplayAddress(shortenedAddress);
        setFullAddress(info["result"][0]);

        if (!username) {
          setUsername(shortenedAddress);
        }
      }
    );
  }

  function chainChangedHandler() {
    window.ethereum.request({ method: "eth_chainId" }).then((data) => {
      localStorage.setItem("chainID", data);
    });
  }

  if (window.ethereum) {
    window.ethereum.on("accountsChanged", accountChangedHandler);
    window.ethereum.on("chainChanged", chainChangedHandler);
  }

  function closeModal() {
    setModal(false);
  }

  function animHamMenu() {
    document.querySelector("#hamburger").classList.toggle("open");
  }

  function openUsernameModal() {
    setUsernameModal(true);
  }

  function closeUsernameModal() {
    setUsernameModal(false);

    setInputMessage("");

    setSuccessMessage(false);
  }

  function validateUsername() {
    let usernameInput = usernameInputRef.current.value;

    if (usernameInput === "") {
      setInputMessage("There is nothing here!");
      return;
    }

    for (let i = 0; i < profanityFilter.list().length; i++) {
      if (usernameInput.toLowerCase() === profanityFilter.list()[i]) {
        setInputMessage("One or more of the fields contain profanity!");
        return;
      }
    }

    if (usernameInput.length < 3 || usernameInput.length > 15) {
      setInputMessage("Your username doesn't meet the requirements below!");
      return;
    }

    setInputMessage("");

    let profile = {
      username: usernameInputRef.current.value,
    };

    BetService.getInstance().changeUsername(
      profile,
      localStorage.getItem("address")
    );

    setSuccessMessage(true);

    setUsername(usernameInputRef.current.value);
  }

  function showAddressModal() {
    setAddressModal(true);
  }

  function closeAddressModal() {
    setAddressModal(false);
  }

  return (
    <div className="header-wrapper w-100">
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
          <div className="modal-footer"></div>
        </div>
      </Modal>
      <Modal show={usernameModal}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Set Username</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={closeUsernameModal}
            ></button>
          </div>
          <div className="modal-body">
            <div className="w-100">
              <div>
                <span className="text-danger">{inputMessage}</span>
                <input
                  type="text"
                  className="form-control mt-2 w-100"
                  placeholder="New Username"
                  ref={usernameInputRef}
                  required
                />
              </div>
            </div>
            {successMessage && (
              <p className="text-success mt-2">Username set!</p>
            )}
            <button
              type="button w-100"
              onClick={validateUsername}
              className="btn btn-success mt-3"
            >
              Set Username
            </button>
            <p className="mt-4">New username must be 3 - 15 characters long.</p>
          </div>
        </div>
      </Modal>
      <Modal show={addressModal}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Wallet Address</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={closeAddressModal}
            ></button>
          </div>
          <div className="modal-body">
            <p>Wallet Address: {fullAddress}</p>
          </div>
          <div className="modal-footer"></div>
        </div>
      </Modal>
      <Navbar
        className="main-navbar"
        collapseOnSelect
        expand="lg"
        variant="dark"
        fixed="top"
        expanded={expanded}
      >
        <Container>
          <Navbar.Brand href="/" className="header-logo--wrapper">
            <img
              className="header-logo img-fluid w-100  "
              src={logo}
              alt="logo"
            />
          </Navbar.Brand>
          <Navbar.Toggle
            onClick={() => {
              setExpanded(expanded ? false : "expanded");
              animHamMenu();
            }}
          >
            <svg id="hamburger" viewBox="0 0 100 100">
              <path
                className="line line1"
                d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058"
              />
              <path className="line line2" d="M 20,50 H 80" />
              <path
                className="line line3"
                d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942"
              />
            </svg>
          </Navbar.Toggle>
          <Navbar.Collapse id="main-navbar-nav" className="main-nav">
            <Nav className="main-nav__block">
              <Link
                onClick={() => {
                  setExpanded(false);
                  animHamMenu();
                }}
                className={
                  location.pathname === "/"
                    ? "active text-decoration-none main-nav__item"
                    : "text-white text-decoration-none main-nav__item"
                }
                to="/"
              >
                <HouseFill className="main-nav__icon" />
                Home
              </Link>
              <Link
                onClick={() => {
                  setExpanded(false);
                  animHamMenu();
                }}
                className={
                  location.pathname === "/createBet"
                    ? "active text-decoration-none main-nav__item"
                    : "text-white text-decoration-none main-nav__item"
                }
                to="/createBet"
              >
                <NodePlusFill className="main-nav__icon" />
                Create Bet
              </Link>
              <NavDropdown
                title="Betting History"
                className="text-decoration-none main-nav__item main-nav__dropdown"
              >
                <Link
                  onClick={() => {
                    setExpanded(false);
                    animHamMenu();
                  }}
                  className={
                    location.pathname === "/bet-history"
                      ? "active text-decoration-none main-nav__item"
                      : "text-white text-decoration-none main-nav__item"
                  }
                  to="/bets-history"
                >
                  All Bets
                </Link>
                <Link
                  onClick={() => {
                    setExpanded(false);
                    animHamMenu();
                  }}
                  className={
                    location.pathname === "/bettingHistory"
                      ? "active text-decoration-none main-nav__item"
                      : "text-white text-decoration-none main-nav__item"
                  }
                  to="/my-bets-history"
                >
                  My Bets
                </Link>
              </NavDropdown>
              <Link
                onClick={() => {
                  setExpanded(false);
                  animHamMenu();
                }}
                className={
                  location.pathname === "/guide"
                    ? "active text-decoration-none main-nav__item"
                    : "text-white text-decoration-none main-nav__item"
                }
                to="/guide"
              >
                <Book className="main-nav__icon" />
                Guide
              </Link>
            </Nav>
            <Nav className="main-nav__connect">
              {displayAddress && !username && (
                <div className="ml-3 d-flex flex-column main-nav__item">
                  <button
                    className="btn btn-secondary"
                    onClick={showAddressModal}
                  >
                    {displayAddress}
                  </button>
                </div>
              )}
              {username && (
                <div className="ml-3 d-flex flex-column main-nav__item">
                  <button
                    className="btn btn-secondary"
                    onClick={showAddressModal}
                  >
                    {username}
                  </button>
                </div>
              )}
              {displayAddress !== "" && (
                <div className="main-nav__item">
                  <button
                    className="btn btn-success ml-3"
                    onClick={openUsernameModal}
                  >
                    Change Username
                  </button>
                </div>
              )}
              {displayAddress === "" && (
                <div className="main-nav__item">
                  <button
                    onClick={connectToWallet}
                    className="btn btn-success ml-3"
                  >
                    Connect to a Wallet
                  </button>
                </div>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;
