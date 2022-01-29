import React, { useEffect, useState, useRef } from "react";
import firebase from "../util/firebase";
import UploadImage from "./UploadImage";
import { v4 as uuid } from "uuid";
import { ToastContainer, toast } from 'react-toastify';

import styles from "./Form.module.css";
import axios from "axios";
import Member from "../Cards/LastMember/LastMember";
import Spinner from "../UI/Spinner";
import Modal from "../UI/Modal";
import { AiOutlineClose } from "react-icons/ai";
import { Redirect } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import NumberEasing from "react-number-easing";
const db = firebase.firestore();
var storageRef = firebase.storage().ref();

export default function Form() {
  
  let a = [];
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [file, setFile] = useState({});
  const [orderUploaded, setOrderUploaded] = useState(false);
  const [visibility, setVisibility] = useState([]);
  const [addons, setAddons] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [keywordList, setkeywordList] = useState("");
  const [addonError, setAddonError] = useState("");
  const [members, setMembers] = useState([]);
  const [familyName, setFamilyName] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoding] = useState(false);
  const [newFamily, setNewFamily] = useState(false);
  const [date, setDate] = useState("");
  const [family, setfamily] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(false);
  const [int, setint] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [addFiled, setAddField] = useState("");
  const [coustom , setcoustom] = useState(false);
  
  const [coustommails , setcoustommails] = useState([]); 
  let keywordsHandler2 = (e) => {
    e.preventDefault();
    let input = document.getElementById("keywordsInput2");
    let newKeywords = [...coustommails, input.value];
    if (!coustommails.includes(input.value) && input!="") {
      setcoustommails(newKeywords);
    }
    input.value = "";
  };

  const removeAddonmails = (e) => {
    let p = coustommails;
    let index = p.indexOf(e.target.id);
    p.splice(index, 1);
    setAddonError("");
    setcoustommails([...p]);
  };

  let optionsmails = coustommails.map((addon) => (
    <li className={styles.addons} className={styles.tagsselli}>
      {addon}
      <span id={addon} className={styles.cross} onClick={removeAddonmails}>
        <AiOutlineClose />
      </span>
    </li>
  ));

  const coustomhtml = <div className={styles.coustom}> <h3 className={styles.h3}>Add Coustom Mails</h3>
  <div className={styles.hundred1}>
    <input
      type="text"
      id="keywordsInput2"
      placeholder="Add Coustom Mails"
      className={styles.namei}
    />

    <button onClick={keywordsHandler2} className={styles.btn}>
      Manually Add
    </button>
  </div>

  

  <div className={styles.tagsel}>
            {optionsmails ? optionsmails : <p>Keywords will be added</p>}
            <p className={styles.err}>{addonError}</p>
          </div> </div>; 
  
  
  
  



  const coustomhandler = () => {
    setcoustom(!coustom);
  }
  let newDate = new Date();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();
  if (month < 6) {
    year = year - 1;
  }

  let year2 = "" + year + "-" + ((year + 1) % 100);
  const tkn = useSelector((state) => state.token);
  let [ordernumber, setordernumber] = useState(0);
  let config = {
    headers: {
      token: tkn,
    },
  };

  useEffect(async () => {
    let a = await axios.get(
      "https://office-order-backend.herokuapp.com/office/getcount"
    );
    console.log(a.data.size);
    setordernumber(a.data.size + 1);
  }, []);
  const hideHandler = () => {
    setShowModal(false);
  };
  const internal = () => {
    setint(false);
  };
  const external = () => {
    setint(true);
  };
  useEffect(() => {
    setLoding(true);

    axios
      .post(
        "https://office-order-backend.herokuapp.com/office/keywords",
        {},
        config
      )
      .then(async (res) => {
        setkeywordList(res.data.keywords.map((k) => <option>{k}</option>));

        setLoding(false);
      })
      .catch((err) => {
        setLoding(false);
      });

    setLoding(true);

    axios
      .post(
        "https://office-order-backend.herokuapp.com/office/getLastMember",
        {},
        config
      )
      .then(async (res) => {
        console.log(res.data.keywords);
        setMembers(res.data.keywords);

        setLoding(false);
      })
      .catch((err) => {
        setLoding(false);
      });
  }, []);

  const setNew = (n) => {
    setmessage("");
    setFamilyName(n);
    setNewFamily(true);
  };
  const [message, setmessage] = useState("");
  const setFamilyHandler = (familyName, familyId) => {
    setFamilyName(familyName);

    setName(familyId);
    setNewFamily(false);

    setmessage(`Family Selected : ${familyName}`);
  };

  console.log(members);

  let memberArray = (
    <div className={styles.hundredw}>
      {members.map((m) => (
        <Member
          name={m.lastOrder.familyName}
          id={m.lastOrder.familyId}
          setFamily={setFamilyHandler}
        />
      ))}
    </div>
  );

  const uploadForm = async (e) => {
    try {
      e.preventDefault();

      var today = new Date();
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = today.getFullYear();

      today = mm + "/" + dd + "/" + yyyy;
      if (title.length === 0) {
        alert("Please Enter Title!");
        return;
      }
      if (visibility.length === 0) {
        alert("Please Enter Visibility!");
        return;
      }
      if (keywords.length === 0) {
        alert("Please Enter keywords!");
        return;
      }
    
      console.log(file);
      const formData = new FormData();
      formData.append("title", title);
      
      formData.append("addons", addons);
      formData.append("type", type);
      formData.append("keywords", keywords);
      formData.append("file", file);
      formData.append("date", today);
      formData.append("newFamily", newFamily);
      formData.append("inex", int);
      formData.append("familyName", familyName);

      if(coustom){
        formData.append("visibilityIds", coustommails);
        formData.append("visibility","registrar");
      }
      else{
        formData.append("visibilityIds", []);
        formData.append("visibility", visibility + ",registrar");
      }
      
      if (!newFamily) formData.append("familyId", name);

      setLoding(true);

      axios
        .post(
          "https://office-order-backend.herokuapp.com/office/upload",
          formData,
          config
        )
        .then(async (res) => {
          console.log(res);

          setLoding(false);
          setShowModal(true);
          setRedirect(true);
        })
        .catch((err) => {
          setLoding(false);
          setError(true);
          setShowModal(true);
        });

      setOrderUploaded(true);
      setTitle("");
      setFile({});
      setKeywords([]);
      console.log("order added to ORDER collection");
    } catch (error) {
      console.log(error);
    }
  };

  const checkboxHandler = (e) => {
    if (e.target.checked) {
      setVisibility([...visibility, e.target.value]);
      a.push(e.target.value);
    } else {
      let d = [...visibility];
      let index = d.indexOf(e.target.value);
      d.splice(index, 1);
      setVisibility([...d]);
      //a.pop(e.target.value);
    }
  };

  const radioHandler = (e) => {
    setType(e.target.value);
  };

  const removeAddon = (e) => {
    let p = keywords;
    let index = p.indexOf(e.target.id);
    p.splice(index, 1);
    setAddonError("");
    setKeywords([...p]);
  };

  let options = keywords.map((addon) => (
    <li className={styles.addons} className={styles.tagsselli}>
      {addon}
      <span id={addon} className={styles.cross} onClick={removeAddon}>
        <AiOutlineClose />
      </span>
    </li>
  ));

  let addonHandler = (e) => {
    let p = addons;
    if (addons.includes(e.target.value)) {
      setAddonError("**This option is already Added!");
      return;
    }
    setAddonError("");
    setAddons([...p, e.target.value]);
    var dropDown = document.getElementById("dropdown");
    dropDown.selectedIndex = 0;
  };

  let keywordsHandler = (e) => {
    e.preventDefault();
    let input = document.getElementById("keywordsInput");
    let newKeywords = [...keywords, input.value];
    if (!keywords.includes(input.value)) {
      setKeywords(newKeywords);
    }
    input.value = "";
  };

  const addKeyWords = (event) => {
    let t = keywords;
    if (!t.includes(event.target.value)) {
      setKeywords([...t, event.target.value]);
    }
  };

  const onAddHandler = () => {
    setVisibility([...visibility, addFiled]);
    setAddField("");
  };

  return (
    <div>
      {redirect ? <Redirect to="prevorder" /> : null}
      <Modal show={showModal} switch={hideHandler}>
        {error ? "Error in uploading" : "Successfully uploaded"}
      </Modal>
      {loading ? <Spinner /> : null}
      <form onSubmit={uploadForm} className={styles.form}>
        <h1 className={styles.h1}>Upload New Order</h1>

        <div className={styles.line}></div>
        <div className={styles.one}>
          <h1 className={styles.h2}>Order Number</h1>
          <div className={styles.name}>
            <div className={styles.iiit}>
              OO:IIITV/{year2}/{int ? "E" : "I"}/<NumberEasing
  value={ordernumber}
  speed={1000}
  decimals={0}
  ease='linear' />
  
            </div>
            <input
              type="text"
              placeholder="Regarding Issue"
              onChange={(e) => setTitle(e.target.value)}
              className={styles.namei}
            />
          </div>
          <br />
        </div>

        <div className={styles.line}></div>

        <div className={styles.one}>
          <h1 className={styles.h2}>Internal/External</h1>

          <span>
            <input
              checked={!int && "checked"}
              type="radio"
              id="internal"
              name="ie"
              value="internal"
              onChange={radioHandler}
              className={styles.radio}
              onClick={internal}
            />
            <label for="internal">Internal</label>
          </span>
          <span>
            <input
              type="radio"
              id="external"
              name="ie"
              value="external"
              className={styles.radio}
              onChange={radioHandler}
              onClick={external}
            />
            <label for="external">External</label>
          </span>
          <br></br>
        </div>

        <div className={styles.line}></div>

        <div className={styles.one}>
          <h1 className={styles.h2}>Visibility</h1>

         
          <span>
            <input
              type="checkbox"
              id="registrar"
              name="registrar"
              value="registrar"
              className={styles.radio}
              onChange={checkboxHandler}
              checked
              disabled
            />
            <label for="registrar"> Registrar</label>
          </span>
{!coustom &&  <span>
            <input
              type="checkbox"
              id="faculty"
              name="faculty"
              value="faculty"
              className={styles.radio}
              onChange={checkboxHandler}
            />
            <label for="faculty"> Faculty</label>
          </span>}
         
         {!coustom &&  <span>
            <input
              type="checkbox"
              id="staff"
              name="staff"
              value="staff"
              className={styles.radio}
              onChange={checkboxHandler}
            />
            <label for="staff"> Staff</label>
          </span>} 
         {!coustom && <span>
            <input
              type="checkbox"
              id="student"
              name="student"
              value="student"
              className={styles.radio}
              onChange={checkboxHandler}
            />
            <label for="student"> Student</label>
          </span>}
          


          <span >
            <input
              type="checkbox"
              id="coustom"
              name="coustom"
              value="coustom"
              className={styles.radio}
              onChange={coustomhandler}
            />
            <label for="coustom"> Add Coustom Visibility</label>
          </span>
 {coustom ? coustomhtml : ""}

          <br></br>
        </div>
        <div className={styles.line}></div>

        <div className={styles.one}>
          <h2 className={styles.h2}>Add keywords</h2>
          <div className={styles.hundred1}>
            <input
              type="text"
              id="keywordsInput"
              placeholder="Add Keywords"
              className={styles.namei}
            />

            <button onClick={keywordsHandler} className={styles.btn}>
              Manually Add
            </button>
          </div>

          <select className={styles.sel} onChange={addKeyWords}>
            <option selected value disabled>
              --Select Keywords--
            </option>
            {keywordList}
          </select>

          <div className={styles.tagsel}>
            {options ? options : <p>Keywords will be added</p>}
            <p className={styles.err}>{addonError}</p>
          </div>
        </div>
        <div className={styles.line}></div>

        <div className={styles.one}>
          <h1 className={styles.h2}>Family</h1>
          <div className={styles.array}>{memberArray}</div>
          <div style={{ color: "green", display: "block", flex: "100%" }}>
            {message}
          </div>
          <div style={{ margin: "0 auto 0", display: "block" }}>Or</div>
          <input
            placeholder="Add a New Family"
            onChange={(e) => setNew(e.target.value)}
            className={styles.inp}
          />
        </div>
        <div className={styles.line}></div>

        <div className={styles.one}>
          <h1 className={styles.h2}>Upload image</h1>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className={styles.drag}
            placeholder="Drop files here"
          />
          <br />
        </div>
        <div className={styles.line}></div>

        <button className={styles.button} onClick={() => toast.info("This feature will be implemented soon")}>Upload Order </button>
      </form>
    </div>
  );
}
