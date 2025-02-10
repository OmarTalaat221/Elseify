import React, { useEffect, useState } from "react";
import Modal from "../../modal";
import axios from "axios";
import Toast from "../../toast";
import Loader from "../../loader";
import { FaCopy, FaPlus, FaTrash } from "react-icons/fa";
import "./style.css";
import SelectComponent from "../../selectBox";
import { baseUrl } from "../../../utils/baseUrl";
import CopyToClipboard from "react-copy-to-clipboard";

const centerType = [
  { label: "سنتر", value: "سنتر" },
  { label: "اونلاين", value: "اونلاين" },
];

function AddSubscriptionCards({
  userData,
  getFunction,
  openModal,
  setOpenModal,
}) {
  const [subscriptionCardsData, setSubscriptionCardsData] = useState({
    name: "",
    image: null,
    description: "",
    gen_id: "",
    group_id: "",
    centerType: "",
    loading: false,
    package_id: "",
    addMessage: "",
  });

  const [years, setYears] = useState([]);
  const [viewedYears, setViewedYears] = useState([]);
  const [groups, setGroups] = useState([]);
  const [toast, setToast] = useState({ visible: false, message: "", type: "" });
  const [packages, setPackages] = useState([]);

  const getYears = async () => {
    try {
      const yearsData = await fetch(
        baseUrl + "subscriptions/select_genrations.php"
      );
      const data = await yearsData?.json();
      console.log(data);
      setYears(data);
    } catch (err) {
      setYears([]);
    }
  };

  useEffect(() => {
    getYears();
  }, []);

  useEffect(() => {
    if (subscriptionCardsData?.group_id) {
      const selectedGroup = groups?.find(
        (item) => item?.group_id == subscriptionCardsData?.group_id
      );
      setPackages(selectedGroup?.packages || []);
    }
  }, [subscriptionCardsData.group_id]);

  useEffect(() => {
    if (subscriptionCardsData?.centerType) {
      const filteredYears = years?.filter(
        (item) => item?.type == subscriptionCardsData?.centerType
      );
      setViewedYears(filteredYears);
    }
  }, [subscriptionCardsData.centerType]);

  useEffect(() => {
    if (subscriptionCardsData?.gen_id) {
      const selectedYear = years?.find(
        (item) => item?.gen_id == subscriptionCardsData?.gen_id
      );
      setGroups(selectedYear?.groups || []);
    }
  }, [subscriptionCardsData.gen_id]);

  const createCard = async (e) => {
    e.preventDefault();
    if (!subscriptionCardsData?.loading) {
      setSubscriptionCardsData((prevState) => ({
        ...prevState,
        loading: true,
      }));

      try {
        const response = await fetch(
          baseUrl + "subscriptions/create_sub_card.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...subscriptionCardsData,
              user_id: userData?.user_id,
            }),
          }
        );
        const addMessage = await response?.text();
        console.log(addMessage);

        setSubscriptionCardsData({
          name: "",
          image: null,
          description: "",
          gen_id: "",
          group_id: "",
          centerType: "",
          loading: false,
          package_id: "",
          addMessage,
        });

        setToast({
          visible: true,
          message: "Created Successfully",
          type: "success",
        });
      } catch (error) {
        setToast({
          visible: true,
          message: "Error in saving data",
          type: "error",
        });
      } finally {
        setSubscriptionCardsData((prevState) => ({
          ...prevState,
          loading: false,
        }));
      }
    }
  };

  useEffect(() => {
    if (!openModal) {
      setSubscriptionCardsData({
        name: "",
        image: null,
        description: "",
        gen_id: "",
        group_id: "",
        centerType: "",
        loading: false,
        package_id: "",
        addMessage: "",
      });
    }
  }, [openModal]);

  return (
    <>
      <Modal
        close={setOpenModal}
        footer={false}
        title={"Add Subscription Cards"}
        visible={openModal}
      >
        <form onSubmit={createCard} className="animated-form">
          <div className="selectBoxComponent">
            <div className="selectColumnBox">
              <label htmlFor="subscriptionCardsName" className="form-label">
                Type
              </label>
              <SelectComponent
                options={centerType}
                value={subscriptionCardsData?.centerType}
                onChange={(e) =>
                  setSubscriptionCardsData({
                    ...subscriptionCardsData,
                    centerType: e?.value,
                  })
                }
              />
            </div>
            <div className="selectColumnBox">
              <label htmlFor="subscriptionCardsName" className="form-label">
                Year
              </label>
              <SelectComponent
                options={viewedYears?.map((item) => ({
                  label: item?.doctor_name,
                  value: item?.gen_id,
                }))}
                value={subscriptionCardsData?.gen_id}
                onChange={(e) =>
                  setSubscriptionCardsData({
                    ...subscriptionCardsData,
                    gen_id: e?.value,
                  })
                }
              />
            </div>
            <div className="selectColumnBox">
              <label htmlFor="subscriptionCardsName" className="form-label">
                Group
              </label>
              <SelectComponent
                options={groups?.map((item) => ({
                  label: item?.group_name,
                  value: item?.group_id,
                }))}
                value={subscriptionCardsData?.group_id}
                onChange={(e) =>
                  setSubscriptionCardsData({
                    ...subscriptionCardsData,
                    group_id: e?.value,
                  })
                }
              />
            </div>
            <div className="selectColumnBox">
              <label htmlFor="subscriptionCardsName" className="form-label">
                Package
              </label>
              <SelectComponent
                options={packages?.map((item) => ({
                  label: item?.name,
                  value: item?.package_id,
                }))}
                value={subscriptionCardsData?.package_id}
                onChange={(e) =>
                  setSubscriptionCardsData({
                    ...subscriptionCardsData,
                    package_id: e?.value,
                  })
                }
              />
            </div>
          </div>
          {subscriptionCardsData?.package_id &&
          subscriptionCardsData?.package_id?.length ? (
            <div className="selectColumnBox">
              <label htmlFor="" className="form-label">
                Package Description:{" "}
                <b className="text-primary">
                  {
                    packages?.find(
                      (item) =>
                        item?.package_id == subscriptionCardsData?.package_id
                    )?.description
                  }
                </b>
              </label>
            </div>
          ) : null}
          {subscriptionCardsData?.addMessage &&
          subscriptionCardsData?.addMessage?.length ? (
            <CopyToClipboard
              text={subscriptionCardsData?.addMessage}
              onCopy={() => {
                setToast({
                  visible: true,
                  message: "Copied Successfully",
                  type: "success",
                });
              }}
            >
              <>
                {" "}
                Code:{" "}
                <b
                  style={{
                    cursor: "pointer",
                    border: ".1px solid grey",
                    width: "fit-content",
                    padding: "3px 12px",
                    borderRadius: "8px",
                  }}
                  className="text-success"
                >
                  {subscriptionCardsData?.addMessage} <FaCopy />
                </b>
              </>
            </CopyToClipboard>
          ) : null}
          <div className="form-footer">
            {subscriptionCardsData?.loading ? (
              <Loader />
            ) : (
              <button type="submit" className="form-submit-btn">
                Create Sub Card
              </button>
            )}
          </div>
        </form>
      </Modal>
      {toast.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ visible: false, message: "", type: "" })}
        />
      )}
    </>
  );
}

export default AddSubscriptionCards;
