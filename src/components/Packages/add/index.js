import React, { useState } from "react";
import Modal from "../../modal";
import axios from "axios";
import Toast from "../../toast";
import Loader from "../../loader";
import { FaPlus, FaTrash } from "react-icons/fa";
import "./style.css";
import { secondUrl } from "../../../utils/baseUrl";
import { useParams } from "react-router-dom";

function AddPackage({ getFunction, openModal, setOpenModal }) {
  const [packageData, setPackageData] = useState({
    name: "",
    image: null,
    description: "",
    loading: false,
  });

  const [toast, setToast] = useState(false);

  const handleImageChange =  async(e) => {
    setPackageData({ ...packageData, image: e.target.files[0] });
  };

  const removeImage = () => {
    setPackageData({ ...packageData, image: null });
  };
const {group} = useParams()
  const saveNewPackage = async(e) => {
  
      e.preventDefault();
  
  
      setPackageData({ ...packageData, loading: true });
  
      const formDataObj = new FormData();
      formDataObj.append("name", packageData?.name);
      formDataObj.append("description", packageData?.description);
      formDataObj.append("price", packageData?.price);
      formDataObj.append("group_id",group);
      formDataObj.append("end_date", packageData?.end_date);
      formDataObj.append("order_number", packageData?.number);

    
  
      try {
        const response = await fetch(secondUrl+"add_package.php", {
          method: "POST",
          body:  JSON.stringify({
            name: packageData?.name,
            description: packageData?.description,
            price: packageData?.price,
            group_id: group,
            end_date: packageData?.end_date,
            order_number: packageData?.number
          }),
        });
  
        const data = await response.text();
        setPackageData({ ...packageData, loading: false });
        if (data.trim() == '"success"') {
          setToast(true);
          setOpenModal(false);
          getFunction();
          alert("تمت إضافة الباقة بنجاح");
        } else {
          alert("حدث خطأ ما من فضلك حاول مره اخرى");
        }
      } catch (err) {
        console.error(err);
        alert("حدث خطأ ما من فضلك حاول مره اخرى");
      } finally {
        setPackageData({ ...packageData, loading: false });
      }
    
  };

  return (
    <Modal
      close={setOpenModal}
      footer={false}
      title={"Add Package"}
      visible={openModal}
    >
      <form onSubmit={(e) => saveNewPackage(e)} className="animated-form">
        <div className="form-group">
          <label htmlFor="packageName" className="form-label">
            Package Name
          </label>
          <input
            type="text"
            id="packageName"
            placeholder="Enter Package Name"
            onChange={(e) => setPackageData({ ...packageData, name: e.target.value })}
            className="form-input"
          />
        </div>
    
        <div className="form-group">
          <label htmlFor="packageDescription" className="form-label">
          Package  Description
          </label>
          <textarea
            id="packageDescription"
            placeholder="Enter Package description"
            onChange={(e) => setPackageData({ ...packageData, description: e.target.value })}
            className="form-input"
            rows="4"
          />
        </div>
        <div className="form-group">
          <label htmlFor="packageName" className="form-label">
            Package Price
          </label>
          <input
            type="text"
            id="packageName"
            placeholder="Enter Package price"
            onChange={(e) => setPackageData({ ...packageData, price: e.target.value })}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="packageName" className="form-label">
            Package Number
          </label>
          <input
            type="text"
            id="packageName"
            placeholder="Enter Package number"
            onChange={(e) => setPackageData({ ...packageData, number: e.target.value })}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="packageName" className="form-label">
            Package End Date
          </label>
          <input
            type="datetime-local"
            id="packageName"
            placeholder="Enter Package end date"
            onChange={(e) => setPackageData({ ...packageData, end_date: e.target.value })}
            className="form-input"
          />
        </div>
        <div className="form-footer">
          {packageData?.loading ? (
            <Loader />
          ) : (
            <button type="submit" className="form-submit-btn">
              Save
            </button>
          )}
        </div>
        {toast && (
          <Toast message={"Please fill out all required fields"} type={"error"} onClose={setToast} />
        )}
      </form>
    </Modal>
  );
}

export default AddPackage;
