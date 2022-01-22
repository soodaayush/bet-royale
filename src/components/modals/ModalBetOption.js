import { useRef } from "react";
import Modal from "react-bootstrap/Modal";

const ModalBetOption = (props) => {
  const betOptions = props.betOptions;
  let betOptionSelectRef = useRef("");

  function betOnOption(bet) {
    if (betOptionSelectRef.current.value !== "") {
      bet.selectedOption = betOptionSelectRef.current.value;
      props.placeBetFunc(bet);
    } else {
      return;
    }
  }

  return (
    <Modal show={props.betOptState}>
      <div className="modal-header">
        <h5 className="modal-title">Options</h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
          onClick={() => props.betOptStateChanger(false)}
        ></button>
      </div>
      <div className="modal-body">
        <select className="form-select" ref={betOptionSelectRef}>
          {betOptions &&
            betOptions.map((option) => (
              <option key={option} value={option} defaultValue>
                {option}
              </option>
            ))}
        </select>
      </div>
      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-success"
          onClick={() => betOnOption(props.betData)}
        >
          Bet
        </button>
      </div>
    </Modal>
  );
};

export default ModalBetOption;
