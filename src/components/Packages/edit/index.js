import React, { useState, useEffect } from "react";
import Modal from "../../modal";
import axios from "axios";
import Toast from "../../toast";
import Loader from "../../loader";
import { FaTrash } from "react-icons/fa";
import { secondUrl } from "../../../utils/baseUrl";

function EditPackage({ packageId, packageData, openModal, setOpenModal, getFunction }) {
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    description: "",
    price: "",
    order_number: "",
    end_date: "",
    loading: false,
  });

  const [toast, setToast] = useState(false);

  // Initialize the form when the modal opens
  useEffect(() => {
    if (openModal) {
      setFormData({
        name: openModal.name,
        image: openModal.image,
        description: openModal.description,
        price: openModal.price,
        order_number: openModal.order_number,
        end_date: openModal.end_date,
        loading: false,
      });
    }
  }, [openModal]);

  // Handle image file input
  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // Remove the image
  const removeImage = () => {
    setFormData({ ...formData, image: null });
  };

  // Save updated package details
  const saveUpdatedPackage = async (e) => {
    e.preventDefault();

    if (!formData?.loading) {
      setFormData({ ...formData, loading: true });
      const formDataObj = {
        name: formData.name,
        description: formData.description,
        package_id: openModal.package_id,
        price: formData.price,
        order_number: formData.order_number,
        end_date: formData.end_date,
        // If there's an image and you want to send it as a URL or a base64 string
        image: formData.image ? formData.image  : null, 
      };
      try {
        const response = await fetch(`${secondUrl}update_package.php`, {
          method: "POST",
          body: JSON.stringify(formDataObj),
        });

        const result = await response.text();

        if (result.trim() === '"success"') {
          setToast(true);
          setOpenModal(false); // Close modal
          getFunction(); // Refresh the package list
          alert("Package updated successfully!");
        } else {
          alert("An error occurred. Please try again.");
        }
      } catch (error) {
        console.error("Error updating package:", error);
        alert("An error occurred. Please try again.");
      } finally {
        setFormData({ ...formData, loading: false });
      }
    }
  };

  return (
    <Modal
      close={() => setOpenModal(false)}
      footer={false}
      title={"Edit Package"}
      visible={openModal}
    >
      <form onSubmit={saveUpdatedPackage} className="animated-form">
        <div className="form-group">
          <label htmlFor="packageName" className="form-label">
            Package Name
          </label>
          <input
            type="text"
            id="packageName"
            defaultValue={formData.name} // Pre-fill with current package data
            placeholder="Enter Package Name"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="packageDescription" className="form-label">
            Package Description
          </label>
          <textarea
            id="packageDescription"
            defaultValue={formData.description} // Pre-fill with current package data
            placeholder="Enter Package Description"
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="form-input"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="packagePrice" className="form-label">
            Package Price
          </label>
          <input
            type="text"
            id="packagePrice"
            defaultValue={formData.price} // Pre-fill with current package data
            placeholder="Enter Package Price"
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="packageNumber" className="form-label">
            Package Number
          </label>
          <input
            type="text"
            id="packageNumber"
            defaultValue={formData.order_number} // Pre-fill with current package data
            placeholder="Enter Package Number"
            onChange={(e) =>
              setFormData({ ...formData, order_number: e.target.value })
            }
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="packageEndDate" className="form-label">
            Package End Date
          </label>
          <input
            type="datetime-local"
            id="packageEndDate"
            defaultValue={formData.end_date} // Pre-fill with current package data
            placeholder="Enter Package End Date"
            onChange={(e) =>
              setFormData({ ...formData, end_date: e.target.value })
            }
            className="form-input"
          />
        </div>

      

        <div className="form-footer">
          {formData?.loading ? (
            <Loader />
          ) : (
            <button type="submit" className="form-submit-btn">
              Save
            </button>
          )}
        </div>
        {toast && (
          <Toast
            message={"Package updated successfully!"}
            type={"success"}
            onClose={() => setToast(false)}
          />
        )}
      </form>
    </Modal>
  );
}

export default EditPackage;
