import React, { useEffect, useState } from "react";
import "./update.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const UpdateUser = () => {
  const users = {
    serviceName: "",
    name: "",
    email: "",
    contactNumber: "",
    date: "",
  };
  const [user, setUser] = useState(users);
  const navigate = useNavigate();
  const { id } = useParams();

  const inputHandler = (e) => {
    const { name, value } = e.target;
    console.log(name, value);

    setUser({ ...user, [name]: value });
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/user/${id}`)
      .then((response) => {
        // Format the date for the input field (YYYY-MM-DD format)
        const userData = response.data;
        if (userData.date) {
          const date = new Date(userData.date);
          const formattedDate = date.toISOString().split('T')[0];
          userData.date = formattedDate;
        }
        setUser(userData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  const submitForm = async (e) => {
    e.preventDefault();
    await axios
      .put(`http://localhost:5000/api/update/user/${id}`, user)
      .then((response) => {
        toast.success(response.data.message, { position: "top-right" });
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="addUser">
      <Link to="/" type="button" className="btn btn-secondary">
        <i className="fa-solid fa-backward"></i> Back
      </Link>

      <h3>Update User</h3>
      <form className="addUserForm" onSubmit={submitForm}>
        <div className="inputGroup">
          <label htmlFor="serviceName">Service Name:</label>
          <input
            type="text"
            id="serviceName"
            value={user.serviceName || ""}
            onChange={inputHandler}
            name="serviceName"
            autoComplete="off"
            placeholder="Enter Service Name"
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={user.name || ""}
            onChange={inputHandler}
            name="name"
            autoComplete="off"
            placeholder="Enter your Name"
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="email">E-mail:</label>
          <input
            type="email"
            id="email"
            value={user.email || ""}
            onChange={inputHandler}
            name="email"
            autoComplete="off"
            placeholder="Enter your Email"
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="contactNumber">Contact Number:</label>
          <input
            type="text"
            id="contactNumber"
            value={user.contactNumber || ""}
            onChange={inputHandler}
            name="contactNumber"
            autoComplete="off"
            placeholder="Enter your Contact Number"
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            value={user.date || ""}
            onChange={inputHandler}
            name="date"
            autoComplete="off"
          />
        </div>
        <div className="inputGroup">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateUser;
