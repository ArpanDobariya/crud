import axios from "axios";

import { useEffect, useRef, useState } from "react";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

import "./App.css";

function App() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [data, setdata] = useState([]);
  const title = useRef();
  const author = useRef();
  const [update, setupdate] = useState({});

  // get data
  const getdata = () => {
    axios.get("http://localhost:3004/posts").then((res) => {
      setdata(res.data);
    });
  };
  useEffect(() => {
    getdata();
  });

  // add data
  const adddata = () => {
    const showdata = {
      title: title.current.value,
      author: author.current.value,
    };
    axios.post("http://localhost:3004/posts", showdata).then((res) => {
      setdata([...data, res.data]);
    });
    title.current.value = [];
    author.current.value = [];
  };

  // delete data
  const deletedata = (id) => {
    console.log(id);
    axios.delete(`http://localhost:3004/posts/${id}`).then((res) => {
      console.log(res);
      setdata([...data, res.data]);
    });
  };

  // update data
  const updatedata = (val, i) => {
    const result = data[i];
    setupdate(result);
    handleShow();
  };
  const inputchange = (e) => {
    setupdate({ ...update, [e.target.name]: e.target.value });
  };
  const editdata = () => {
    axios
      .put(`http://localhost:3004/posts/${update.id}`, update)
      .then((res) => {
        setdata([...data, res.data]);
      });
    handleClose();
  };

  return (
    <div className="App">
      <div className="maindiv">
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" placeholder="Enter Title"  name="title" ref={title} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Author</Form.Label>
          <Form.Control type="text" placeholder="Enter Author"  name="author" ref={author} />
        </Form.Group>
        <Button variant="primary" onClick={adddata}>
          Add
        </Button>
      </Form>
      </div>
      <div>
        {data.map((val, i) => {
          return (
            <div>
              <h1>{val.id}</h1>
              <h2>{val.title}</h2>
              <h3>{val.author}</h3>
              <Button variant="danger" onClick={() => deletedata(val.id)}>Delete</Button>
              <Button variant="success" onClick={() => updatedata(val.id, i)}>
                Update Your Data
              </Button>
            </div>
          );
        })}
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Your Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={update.title}
                name="title"
                onChange={inputchange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Author</Form.Label>
              <Form.Control
                type="text"
                value={update.author}
                name="author"
                onChange={inputchange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={editdata}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;
