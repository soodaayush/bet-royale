import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Modal, Navbar, Nav, Container, NavDropdown } from "react-bootstrap";

import {
  HouseFill,
  NodePlusFill,
  Book,
} from "react-bootstrap-icons";

import logo from "../images/logo.webp";
import discord from "../images/discord.svg";

const Header = () => {
  const location = useLocation();

  const [modal, setModal] = useState(false);
  const [description, setDescription] = useState("");

  const [expanded, setExpanded] = useState(false);

  function connectToWallet() {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChangedHandler(result[0]);
          localStorage.setItem("address", result[0]);

          let startingAddress = localStorage.getItem("address").substring(0, 5);
          let endingAddress = localStorage
            .getItem("address")
            .substr(localStorage.getItem("address").length - 3);

          let shortenedAddress = `${startingAddress}...${endingAddress}`;

          window.ethereum.request({ method: "eth_chainId" }).then((data) => {
            console.log(data);
            localStorage.setItem("chainID", data);
          });

          localStorage.setItem("shortenedAddress", shortenedAddress);
        });
    } else {
      setModal(true);
      setDescription("Please install Metamask!");
    }
  }

  function accountChangedHandler(newAccount) {
    localStorage.setItem("address", newAccount);

    let startingAddress = localStorage.getItem("address").substring(0, 5);
    let endingAddress = localStorage
      .getItem("address")
      .substr(localStorage.getItem("address").length - 3);

    let shortenedAddress = `${startingAddress}...${endingAddress}`;

    localStorage.setItem("shortenedAddress", shortenedAddress);
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
            <img className="header-logo img-fluid" src={logo} alt="logo" />
            <span className="header-logo--text">BetRoyale</span>
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
                  to="/bets-history">
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
                  to="/my-bets-history">
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
              {localStorage.getItem("address") && (
                <div className="ml-3 d-flex flex-column main-nav__item">
                  <button className="btn btn-secondary">
                    {localStorage.getItem("shortenedAddress")}
                  </button>
                </div>
              )}
              {!localStorage.getItem("address") && (
                <div className="main-nav__item">
                  <button
                    onClick={connectToWallet}
                    className="btn btn-success ml-3"
                  >
                    Connect to a Wallet
                  </button>
                </div>
              )}
              {localStorage.getItem("username") && (
                <div className="main-nav__item">
                  <button className="btn btn-primary">
                    {localStorage.getItem("username")}
                  </button>
                </div>
              )}
              {!localStorage.getItem("username") && (
                <a
                  className="text-decoration-none btn btn-success main-nav__item"
                  target="_blank"
                  rel="noreferrer"
                  id="login"
                  href={
                    "https://discord.com/oauth2/authorize?client_id=903764073966096425&redirect_uri=https%3A%2F%2Fbet-royale.netlify.app%2F&response_type=token&scope=identify"
                  }
                >
                  Discord
                  <img
                    className="ml-3 d-inline img-fluid discord"
                    src={discord}
                    alt="discord"
                  />
                </a>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;
