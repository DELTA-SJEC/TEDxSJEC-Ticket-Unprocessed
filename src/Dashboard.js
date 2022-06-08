import "./Dashboard.css";

import { AUTH } from "./auth/Auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const axios = require("axios").default;
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function Dashboard() {
  const [statusArr, setStatusArr] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [freeForm, setFreeForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "Other",
  });
  const [reflectForm, setReflectForm] = useState({});
  const [freeImage, setFreeImage] = useState("");
  const [reflectImage, setReflectImage] = useState("");

  const OnChangeValue = (e) => {
    const { value, name } = e.target;
    setFreeForm((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const onChangeReflectFormValue = (e) => {
    const { value, name } = e.target;
    setReflectForm((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const saveFreeImage = (e) => {
    setTimeout(() => {
      setFreeImage(e.target.files[0]);
    }, 100);
  };

  const saveReflectImage = (e) => {
    setTimeout(() => {
      setReflectImage(e.target.files[0]);
    }, 100);
  };

  const navigate = useNavigate();
  useEffect(() => {
    if (!AUTH()) {
      navigate("/login");
    }
  });
  useEffect(() => {
    axios
      .get(`${SERVER_URL}/api/status`)
      .then(function (response) {
        setStatusArr(response.data);
        setLoading(false);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  }, []);
  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("Authorization");
    navigate("/login");
  };
  if (isLoading) {
    return <div className="App">Loading...</div>;
  }

  const freeTicketSubmit = async (e) => {
    e.preventDefault();
    let formdata = new FormData();
    formdata.append("name", freeForm.name);
    formdata.append("email", freeForm.email);
    formdata.append("phone", `+91${freeForm.phone}`);
    formdata.append("company", freeForm.company);
    formdata.append("avatar", freeImage);
    toast.promise(
      axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/free-ticket`,
        formdata,
        {
          headers: {
            Authorization: localStorage.getItem("Authorization"),
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      ),
      {
        loading: "Submitting...",
        success: "Successfuly submitted",
        error: "Something went wrong",
      }
    );
  };

  const reflectTicketSubmit = async (e) => {
    e.preventDefault();
    let formdata = new FormData();
    formdata.append("email", reflectForm.email);
    formdata.append("phone", `+91${reflectForm.phone}`);
    formdata.append("razorpay_payment_id", reflectForm.paymentId);
    formdata.append("avatar", reflectImage);
    toast.promise(
      axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/payment-success-v2-for-not-reflected`,
        formdata,
        {
          headers: {
            Authorization: localStorage.getItem("Authorization"),
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      ),
      {
        loading: "Submitting...",
        success: "Successfuly submitted",
        error: "Something went wrong",
      }
    );
  };

  return (
    <div className="container-fluid">
      <header className="container-fluid">
        <nav className="navbar navbar-light bg-light container-fluid" id="nav">
          <div className="container-fluid">
            <a href="#!">
              <h3>TEDxSJEC</h3>
            </a>
            <button
              className="btn btn-outline-dark"
              type="submit"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </nav>
      </header>
      <div className="container form-container">
        <div className="free-form-container">
          <form onSubmit={freeTicketSubmit}>
            <div class="title">Free Ticket Form</div>
            <div className="mb-3">
              {JSON.stringify(freeForm)}
              <label htmlFor="free-name" className="form-label">
                Name
              </label>
              <input
                value={freeForm.name}
                onChange={OnChangeValue}
                name="name"
                required={true}
                type="text"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="nameHelp"
                placeholder="Enter your name"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="free-email" className="form-label">
                Email address
              </label>
              <input
                value={freeForm.email}
                onChange={OnChangeValue}
                name="email"
                required={true}
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Enter your email address"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="free-phone" className="form-label">
                Phone Number
              </label>
              <input
                value={freeForm.phone}
                onChange={OnChangeValue}
                name="phone"
                required={true}
                type="number"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Enter your phone number"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="free-company" className="form-label">
                Company
              </label>
              <select
                value={freeForm.company}
                onChange={OnChangeValue}
                name="company"
                className="form-control"
              >
                <option>SJEC</option>
                <option>UniCourt</option>
                <option>Emdees Computers and Networking</option>
                <option>Marian Projects Pvt Ltd</option>
                <option selected>Other</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="free-company-logo" className="form-label">
                Company Logo
              </label>
              <input
                onChange={saveFreeImage}
                required={true}
                accept="image/png, image/jpeg, image/jpg"
                className="form-control"
                type="file"
                id="freeFile"
              />
            </div>
            <button type="submit" className="btn btn-tedx">
              Get your free ticket
            </button>
          </form>
        </div>
        {/* .. */}
        <div className="reflect-form-container">
          <form onSubmit={reflectTicketSubmit}>
            <div class="title">Payment Confirmation Form</div>
            <div className="mb-3">
              <label htmlFor="reflect-email" className="form-label">
                Email address
              </label>
              <input
                value={reflectForm.email}
                onChange={onChangeReflectFormValue}
                name="reflect-email"
                required={true}
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Enter your email address"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="reflect-phone" className="form-label">
                Phone Number
              </label>
              <input
                value={reflectForm.phone}
                onChange={onChangeReflectFormValue}
                name="reflect-phone"
                required={true}
                type="number"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Enter your phone number"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Payment ID
              </label>
              <input
                value={reflectForm.paymentId}
                onChange={onChangeReflectFormValue}
                name="reflect-paymentid"
                required={true}
                type="text"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="nameHelp"
                placeholder="Enter your name"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="reflect-avatar" className="form-label">
                Avatar
              </label>
              <input
                onChange={saveReflectImage}
                required={true}
                accept="image/png, image/jpeg, image/jpg"
                className="form-control"
                type="file"
                id="reflectFile"
              />
            </div>
            <button className="btn btn-tedx" type="submit">
              Confirm Payment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
