import React,{Component} from 'react';
import {
  Row,
  Col,
  Form,
  Button,
  ButtonToolbar,
  Modal
} from "react-bootstrap";

class AddUser extends Component
{
render()
{
  return (
    <Modal
    {...this.props}
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered
  >
    <Modal.Header closeButton>
      <Modal.Title id="contained-modal-title-vcenter">
        Add User
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
    <>
        <div className="add-user-heading">Basic Details</div>
        <Row>
          <Col md={4}>
            <Form.Control
              type="text"
              placeholder="Firstsdas Name"
              aria-describedby="inputGroupPrepend"
              name="txtFirstName"
              className="control-input LineInput"
            />
          </Col>
          <Col sm={4}>
            <Form.Control
              type="text"
              placeholder="Last Name"
              aria-describedby="inputGroupPrepend"
              name="txtLastName"
              className="control-input LineInput"
            />
          </Col>
          <Col sm={4}>
            <Form.Control
              type="text"
              placeholder="Email"
              aria-describedby="inputGroupPrepend"
              name="txtEmail"
              className="control-input LineInput"
            />
          </Col>
          <Col sm={4}>
            <Form.Control
              type="text"
              placeholder="Profile"
              aria-describedby="inputGroupPrepend"
              name="txtProfile"
              className="control-input LineInput"
            />
          </Col>
          <Col sm={4}>
            <Form.Control
              type="text"
              placeholder="Contact No."
              aria-describedby="inputGroupPrepend"
              name="txtContactNo"
              className="control-input LineInput"
            />
          </Col>
        </Row>
        <div className="add-user-heading">Allocation Details</div>
        <Row>
          <Col sm={4}>
            <Form.Control as="select" className="control-input LineInput">
              <option selected disabled>
                Region
              </option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </Form.Control>
          </Col>
          <Col sm={4}>
            <Form.Control as="select" className="control-input LineInput">
              <option selected disabled>
                Manager
              </option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </Form.Control>
          </Col>
        </Row>
        <div className="add-user-heading">Other Details</div>
        <Row>
          <Col sm={4}>
            <Form.Control as="select" className="control-input LineInput">
              <option selected disabled>
                Country
              </option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </Form.Control>
          </Col>
          <Col sm={4}>
            <Form.Control as="select" className="control-input LineInput">
              <option selected disabled>
                TimeZone
              </option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </Form.Control>
          </Col>
        </Row>
      </>
    </Modal.Body>
    <Modal.Footer>
      <Button>Save</Button>
      <Button variant="outline-secondary" name="btnCancel" onClick={this.props.onHide}>Cancel</Button>
    </Modal.Footer>
  </Modal>
  );
}
}

export default AddUser

