import Modal from "react-bootstrap/Modal";

const ModalAlert = (props) => {
  return (
    <Modal show={props.alertState}>
      <div className="modal-header">
        <h5 className="modal-title">Alert</h5>
      </div>
      <div className="modal-body">
        <p>{props.alertDesc}</p>
      </div>
      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => props.alertStateChanger(false)}
        >
          Close
        </button>
      </div>
    </Modal>
  );
};
export default ModalAlert;
