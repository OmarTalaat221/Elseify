import React, { useEffect, useState } from "react";
import Modal from "../modal";
import Toast from "../toast";
import Loader from "../loader";
import SelectComponent from "../selectBox";
import { baseUrl } from "../../utils/baseUrl";

const centerTypeOptions = [
  { label: "سنتر", value: "سنتر" },
  { label: "اونلاين", value: "اونلاين" },
];

function ChangeGroup({ userData, getFunction, openModal, setOpenModal }) {
  const [changeGroupData, setChangeGroupData] = useState({
    centerType: "",
    gen_id: "",
    group_id: "",
    loading: false,
    updateMessage: "",
  });

  const [years, setYears] = useState([]);
  const [viewedYears, setViewedYears] = useState([]);
  const [groups, setGroups] = useState([]);
  const [toast, setToast] = useState({ visible: false, message: "", type: "" });

  const getYears = async () => {
    try {
      const yearsData = await fetch(
        baseUrl + "subscriptions/select_genrations.php"
      );
      const data = await yearsData.json();
      setYears(data);
    } catch (err) {
      setYears([]);
    }
  };

  useEffect(() => {
    getYears();
  }, []);

  useEffect(() => {
    if (changeGroupData.centerType) {
      const filteredYears = years.filter(
        (item) => item.type === changeGroupData.centerType
      );
      setViewedYears(filteredYears);
    }
  }, [changeGroupData.centerType, years]);

  useEffect(() => {
    if (changeGroupData.gen_id) {
      const selectedYear = years.find(
        (item) => item.gen_id === changeGroupData.gen_id
      );
      setGroups(selectedYear?.groups || []);
    }
  }, [changeGroupData.gen_id, years]);

  const updateGroup = async (e) => {
    e.preventDefault();
    if (!changeGroupData.loading) {
      setChangeGroupData((prevState) => ({
        ...prevState,
        loading: true,
      }));

      try {
        const response = await fetch(baseUrl + "update_student_gen_group.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            student_id: userData?.student_id, 
            generation_id: changeGroupData.gen_id,
            group_id: changeGroupData.group_id,
          }),
        });
        const updateMessage = await response.text();

        setChangeGroupData({
          centerType: "",
          gen_id: "",
          group_id: "",
          loading: false,
          updateMessage,
        });

        setToast({
          visible: true,
          message: updateMessage,
          type: updateMessage,
        });

        if (getFunction) {
          getFunction(); 
        }
      } catch (error) {
        setToast({
          visible: true,
          message: "Error in updating group",
          type: "error",
        });
      } finally {
        setChangeGroupData((prevState) => ({
          ...prevState,
          loading: false,
        }));
      }
    }
  };

  useEffect(() => {
    if (!openModal) {
      setChangeGroupData({
        centerType: "",
        gen_id: "",
        group_id: "",
        loading: false,
        updateMessage: "",
      });
    }
  }, [openModal]);

  return (
    <>
      <Modal
        close={setOpenModal}
        footer={false}
        title={"Change Student Group"}
        visible={openModal}
      >
        <form onSubmit={updateGroup} className="animated-form">
          <div className="selectBoxComponent">
            <div className="selectColumnBox">
              <label htmlFor="centerType" className="form-label">
                Center Type
              </label>
              <SelectComponent
                options={centerTypeOptions}
                value={{ value: changeGroupData.centerType }}
                onChange={(e) =>
                  setChangeGroupData({
                    ...changeGroupData,
                    centerType: e?.value,
                  })
                }
              />
            </div>
            <div className="selectColumnBox">
              <label htmlFor="yearSelect" className="form-label">
                Year
              </label>
              <SelectComponent
                options={viewedYears?.map((item) => ({
                  label: item.doctor_name,
                  value: item.gen_id,
                }))}
                value={{ value: changeGroupData.gen_id }}
                onChange={(e) =>
                  setChangeGroupData({
                    ...changeGroupData,
                    gen_id: e?.value,
                  })
                }
              />
            </div>
            <div className="selectColumnBox">
              <label htmlFor="groupSelect" className="form-label">
                Group
              </label>
              <SelectComponent
                options={groups?.map((item) => ({
                  label: item.group_name,
                  value: item.group_id,
                }))}
                value={{ value: changeGroupData.group_id }}
                onChange={(e) =>
                  setChangeGroupData({
                    ...changeGroupData,
                    group_id: e?.value,
                  })
                }
              />
            </div>
          </div>
          <div className="form-footer">
            {changeGroupData.loading ? (
              <Loader />
            ) : (
              <button type="submit" className="form-submit-btn">
                Update Group
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

export default ChangeGroup;
