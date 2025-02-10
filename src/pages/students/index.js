import React, { useEffect, useState } from "react";
import CustomTable from "../../components/table";
import "./style.css";
import { baseUrl, secondUrl } from "../../utils/baseUrl";
import Toast from "../../components/toast";
import ChangeGroup from "../../components/students/changegroup";
import SelectComponent from "../../components/selectBox";
import Modal from "../../components/modal";

// ConfirmModal Component
function ConfirmModal({ visible, onClose, onConfirm, message }) {
  if (!visible) return null;

  return (
    <Modal close={onClose} footer={false} title={"Confirm Action"} visible={visible}>
      <div className="confirm-modal">
        <p>{message}</p>
        <div className="confirm-modal-buttons">
          <button className="btn btn-danger" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-success" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
}

function Students() {
  const [toast, setToast] = useState(false);
  const [openChangeGroup, setOpenChangeGroup] = useState(false);
  const [students, setStudents] = useState(null);
  const [openAddSubCard, setOpenAddSubCard] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [years, setYears] = useState([]);
  const [groups, setGroups] = useState([]);
  const [packages, setPackages] = useState([]);
  const [subscriptionData, setSubscriptionData] = useState({
    centerType: "",
    gen_id: "",
    group_id: "",
    package_id: "",
  });
  const [confirmAction, setConfirmAction] = useState({
    visible: false,
    message: "",
    onConfirm: null,
  }); // State for confirmation modal

  useEffect(() => {
    getStudents();
    getYears();
  }, []);

  const getStudents = async () => {
    try {
      const response = await fetch(baseUrl + "select_all_students.php");
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      setStudents([]);
    }
  };

  const getYears = async () => {
    try {
      const yearsData = await fetch(baseUrl + "subscriptions/select_genrations.php");
      const data = await yearsData.json();
      setYears(data);
    } catch (err) {
      setYears([]);
    }
  };

  useEffect(() => {
    if (subscriptionData.gen_id) {
      const selectedYear = years.find((year) => year.gen_id === subscriptionData.gen_id);
      setGroups(selectedYear?.groups || []);
    }
  }, [subscriptionData.gen_id]);

  useEffect(() => {
    if (subscriptionData.group_id) {
      const selectedGroup = groups.find((group) => group.group_id === subscriptionData.group_id);
      setPackages(selectedGroup?.packages || []);
    }
  }, [subscriptionData.group_id]);

  const handleCreateSubscription = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(secondUrl + "add_student_sub.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...subscriptionData,
          student_id: selectedStudent?.student_id,
        }),
      });
      const result = await response.text();
      setToast({ message: result, type: "success" });
      setOpenAddSubCard(null);
      setSelectedStudent(null); // Reset the selected student after creation
    } catch (error) {
      setToast({ message: "Error creating subscription", type: "error" });
    }
  };

  // Function to change subscription status (0 or 1)
  const changeSubscriptionStatus = async (student_id, package_id, status) => {
    try {
      const response = await fetch(secondUrl + "status_student_sub.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ student_id, package_id, status }),
      });
      const result = await response.text();
      setToast({ message: result, type: "success" });
    } catch (error) {
      setToast({ message: "Error changing subscription status", type: "error" });
    }
  };

  // Trigger the confirm modal for the activation/deactivation
  const triggerConfirmModal = (message, onConfirm) => {
    setConfirmAction({
      visible: true,
      message,
      onConfirm,
    });
  };

  const columns = [
    {
      key: "name",
      title: "Name",
      dataIndex: "student_name",
      search: true,
    },
    {
      key: "doctor_name",
      title: "Year",
      dataIndex: "doctor_name",
      render: (e, row) => {
        return <span>{row?.doctor_name}</span>;
      },
    },
    {
      key: "age",
      title: "Group",
      dataIndex: "group_name",
      render: (e, row) => {
        return <span>{row?.group_name}</span>;
      },
    },
    {
      key: "",
      title: "",
      dataIndex: "student_",
      render: (e, row) => {
        return <span>{row?.student_}</span>;
      },
    },
    {
      key: "phone",
      title: "Phone",
      dataIndex: "student_phone",
      render: (e, row) => {
        return <span>{row?.student_phone}</span>;
      },
    },
    {
      key: "Actions",
      title: "Actions",
      dataIndex: "reset_count",
      render: (e, row) => {
        return (
          <div className="rowDiv">
            <button
              className="btn btn-danger"
              onClick={async () => {
                try {
                  const response = await fetch(
                    baseUrl + "reset_student_device.php",
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ student_id: row?.student_id }),
                    }
                  );
                  const x = await response?.text();
                  setToast({ type: "dark", message: x });
                } catch (err) {}
              }}
            >
              Reset
            </button>
            <button
              style={{ margin: "0 10px", background: "blue", color: "white" }}
              className="btn btn-primary"
              onClick={() => {
                setSelectedStudent(row);
                setOpenAddSubCard(true); // Open Add Subscription form
              }}
            >
              Add Subscription
            </button>
            
          </div>
        );
      },
    },
  ];

  return (
    <div className="students">
      <div className="tablePageHeader">
        <h1 className="pageTitle">Students</h1>
      </div>
      <CustomTable dataSource={students} columns={columns} />
      <ChangeGroup
        userData={openChangeGroup}
        openModal={openChangeGroup}
        setOpenModal={setOpenChangeGroup}
      />

      {/* Render Add Subscription Form if a student is selected */}
      <Modal
        close={setOpenAddSubCard}
        footer={false}
        title={"Add Subscription"}
        visible={openAddSubCard}
      >
        <div className="subscription-form-section">
          <h2>Add Subscription for {selectedStudent?.student_name}</h2>
          <form onSubmit={handleCreateSubscription}>
            <div className="form-group">
              <label htmlFor="centerType">Type</label>
              <SelectComponent
                options={[
                  { label: "سنتر", value: "سنتر" },
                  { label: "اونلاين", value: "اونلاين" },
                ]}
                value={{ value: subscriptionData.centerType }}
                onChange={(e) =>
                  setSubscriptionData({
                    ...subscriptionData,
                    centerType: e.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="gen_id">Year</label>
              <SelectComponent
                options={years.map((year) => ({
                  label: year.doctor_name,
                  value: year.gen_id,
                }))}
                value={{ value: subscriptionData.gen_id }}
                onChange={(e) =>
                  setSubscriptionData({ ...subscriptionData, gen_id: e.value })
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="group_id">Group</label>
              <SelectComponent
                options={groups.map((group) => ({
                  label: group.group_name,
                  value: group.group_id,
                }))}
                value={{ value: subscriptionData.group_id }}
                onChange={(e) =>
                  setSubscriptionData({
                    ...subscriptionData,
                    group_id: e.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="package_id">Package</label>
              <SelectComponent
                options={packages.map((pkg) => ({
                  label: pkg.name,
                  value: pkg.package_id,
                }))}
                value={{ value: subscriptionData.package_id }}
                onChange={(e) =>
                  setSubscriptionData({
                    ...subscriptionData,
                    package_id: e.value,
                  })
                }
              />
            </div>

            <button type="submit" className="btn btn-success">
              Create Subscription
            </button>
          </form>
        </div>
      </Modal>

      {/* Confirm Modal */}
      <ConfirmModal
        visible={confirmAction.visible}
        message={confirmAction.message}
        onClose={() => setConfirmAction({ ...confirmAction, visible: false })}
        onConfirm={() => {
          confirmAction.onConfirm();
          setConfirmAction({ ...confirmAction, visible: false });
        }}
      />

      {toast && (
        <Toast
          message={toast?.message}
          type={toast?.type}
          onClose={() => setToast(false)}
        />
      )}
    </div>
  );
}

export default Students;
