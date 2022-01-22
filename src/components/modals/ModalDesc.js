import Modal from "react-bootstrap/Modal";
import ReactHtmlParser from "react-html-parser";

const ModalDesc = (props) => {
  return (
    <div className="modal-wrapper">
      <Modal show={props.descState}>
        <div className="modal-header">
          <h4 className="modal-title">Bet Description</h4>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            onClick={() => props.descStateChanger(false)}
          ></button>
        </div>
        <div className="modal-body">{ReactHtmlParser(props.betDesc)}</div>
        <div className="modal-footer"></div>
      </Modal>
    </div>
  );
};

export default ModalDesc;
