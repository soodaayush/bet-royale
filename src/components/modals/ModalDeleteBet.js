import Modal from "react-bootstrap/Modal";
import BetService from "../../api/Bet";

const ModalDeleteBet = (props) => {
  function closeBetDeleteModalAndDeleteBet() {
    BetService.getInstance().deleteBet(props.betId);
    props.betDeleteStateChanger(false);
  }

  return (
    <Modal show={props.betDeleteState}>
      <div className="modal-header">
        <h5 className="modal-title">Description</h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
          onClick={() => props.betDeleteStateChanger(false)}
        ></button>
      </div>
      <div className="modal-body">
        <p>{props.deleteDesc}</p>
      </div>
      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-success"
          onClick={() => props.betDeleteStateChanger(false)}
        >
          No
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={closeBetDeleteModalAndDeleteBet}
        >
          Yes
        </button>
      </div>
    </Modal>
  );
};

export default ModalDeleteBet;
