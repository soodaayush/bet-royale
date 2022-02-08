import Modal from "react-bootstrap/Modal";
import BetService from "../../api/Bet";

import { useRef } from "react";

const ModalBetResult = (props) => {
  let betResultSelectRef = useRef();
  const betOptions = props.betOptions;

  function putBetResult(data) {
    data.selectedChoice = betResultSelectRef.current.value;
    data.betResult = betResultSelectRef.current.value;
    BetService.getInstance().logBetInBetsHistory(data);
    BetService.getInstance().deleteBet(data.id);
    props.betResultStateChanger(false);
  }

  return (
    <Modal show={props.betResultState}>
      <div className="modal-header">
        <h5 className="modal-title">Set Bet Result</h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
          onClick={() => props.betResultStateChanger(false)}
        ></button>
      </div>
      <div className="modal-body">
        <select className="form-select" ref={betResultSelectRef}>
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
          onClick={() => putBetResult(props.betData)}
        >
          Set Bet Result
        </button>
      </div>
    </Modal>
  );
};
export default ModalBetResult;
