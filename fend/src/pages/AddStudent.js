import React, { useEffect, useState } from "react";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory, useParams } from "react-router-dom";

const URL = "http://localhost:5000/";

const AddStudent = () => {
  const history = useHistory(); 
  const { id } = useParams();

  console.log(id)

  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [date_of_birth, setDate_of_birth] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get(`${URL}student/${id}`);
        const studentData = response.data;

        console.log(studentData)
        setFirstName(studentData.firstname);
        setLastName(studentData.lastname);
        setDate_of_birth(studentData.date_of_birth);
        setEmail(studentData.email);
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    if (id) {
      fetchStudentData();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    const data = {
      firstname,
      lastname,
      date_of_birth,
      email
    };
    

    try {
      if (id) {
        await axios.put(`${URL}student/${id}`, data);
        toast.success("Student updated successfully");
      } else {
        await axios.post(URL + "student", data);
        toast.success("Student added successfully");
      }

      history.push("/students");
    }
   catch (error) {
    toast.error("Error processing student data");
    console.error('Error submitting data:', error);
  }
  };

  return (
    <form onSubmit={handleSubmit}>
                <ToastContainer />

      <div className="submit-form">
        <div>
          <div className="form-group">
            <label htmlFor="Firstname">Firstname</label>
            <input
              type="text"
              className="form-control"
              id="Firstname"
              required
              value={firstname}
              onChange={(e) => setFirstName(e.target.value)}
              name="firstname"
            />
          </div>

          <div className="form-group">
            <label htmlFor="LastName">Lastname</label>
            <input
              type="text"
              className="form-control"
              id="LastName"
              required
              value={lastname}
              onChange={(e) => setLastName(e.target.value)}
              name="lastName"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              className="form-control"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="date_of_birth">Date of Birth</label>
            <input
              type="date"
              className="form-control"
              id="date_of_birth"
              required
              value={date_of_birth}
              onChange={(e) => setDate_of_birth(e.target.value)}
              name="date_of_birth"
            />
          </div>

          <button type="submit" className="btn btn-success">
          {id ? "Update" : "Submit"}

          </button>
        </div>
      </div>
    </form>
  );
};

export default AddStudent;
