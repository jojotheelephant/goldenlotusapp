import React from "react";
import { Modal, Button } from "react-bootstrap";

const ModalDelete = ({
    show,
    onHide,
    title,
    body,
    primaryClick,
    secondaryClick,
}) => {
    return (
        <div>
            <Modal show={show} onHide={onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>

                <Modal.Body>{body}</Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={secondaryClick}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={primaryClick}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

const ModalAlert = ({ show, onHide, title, body, click }) => {
    return (
        <div>
            <Modal show={show} onHide={onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>

                <Modal.Body>{body}</Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" onClick={click}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export { ModalDelete, ModalAlert };
