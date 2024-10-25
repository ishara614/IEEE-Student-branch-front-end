import React from "react";
import Modal from "react-bootstrap/Modal";
import CommonButton from "../../common/commonButton/commonButton";

const ViewEventModal = ({ onHide, show, eventData, formattedDate }) => {
  if (!eventData) return null;

  return (
    <Modal
      show={show}
      onHide={onHide}
      animation={true}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title
          className="text-cl-primary"
          id="contained-modal-title-vcenter"
        >
          Event Details
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="d-flex flex-column align-items-center">
          <div className="w-100">
            <div className="mb-3">
              <label className="form-label text-dark">
                <b>Project Name:</b>
              </label>{" "}
              {eventData.projectName}
            </div>
            <div className="mb-3">
              <label className="form-label text-dark">
                <b>Date:</b>
              </label>{" "}
              {formattedDate(eventData.date)}
            </div>
            <div className="mb-3">
              <label className="form-label text-dark">
                <b>Venue:</b>
              </label>{" "}
              {eventData.venue}
            </div>
            <div className="mb-3">
              <label className="form-label text-dark">
                <b>Description:</b>
              </label>{" "}
              {eventData.description}
            </div>
            <div className="mb-3">
              <label className="form-label text-dark">
                <b>Link:</b>
              </label>{" "}
              {eventData.eventLink}
            </div>
            <div className="mb-3">
              <label className="form-label text-dark">
                <b>Event Name:</b>
              </label>{" "}
              {eventData.eventName}
            </div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-end mt-3">
        <div>
          <CommonButton onClick={onHide} close={true} text={" cancel"} />
        </div>
      </Modal.Footer>
    </Modal>
  );
};
export default ViewEventModal;
