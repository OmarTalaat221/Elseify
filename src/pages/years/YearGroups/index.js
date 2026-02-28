import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {
  students,
  examIcon,
  GroupsIcon,
  closedEye,
  deleteIcon,
  editIcon,
  lectures,
  openedEye,
} from "../../../assets/svgIcons";
import AddGroupModal from "../../../components/groups/add";
import AssignToGroup from "../../../components/groups/assign";
import DeleteGroupModal from "../../../components/groups/delete";
import EditGroupModal from "../../../components/groups/edit";
import ShowHideGroupModal from "../../../components/groups/show-hide";
import CustomTable from "../../../components/table";
import DropMenu from "../../../components/dropmenu";
import {FaLock, FaLockOpen} from "react-icons/fa";

function Groups() {
  const [groups, setGroups] = useState([]);
  const [studentsData, setStudents] = useState([]);
  const {id} = useParams();
  const [openModal, setOpenModal] = useState(false);
  const [assignModal, setAssignModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [showHideModal, setShowHideModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const navigate = useNavigate();

  const getGroups = async () => {
    try {
      const response = await fetch(
        "https://camp-coding.online/Teacher_App_2024/Mohamed_Elseify_New/doctor/home/select_groups.php",
        {
          method: "POST",
          header: {"Content-Type": "Application/Json"},
          body: JSON.stringify({type: isOnline ? "online" : "offline"}),
        }
      );
      console.log(response);
      const data = await response.json();
      setGroups(data);
    } catch (err) {
      setGroups([]);
    }
  };

  useEffect(() => {
    getGroups();
  }, []);
  const handleToggle = () => {
    setIsOnline(!isOnline);
  };

  const [isOnline, setIsOnline] = useState(true);
  const [filteredGroups, setFilteredGroups] = useState([]);

  useEffect(() => {
    if (isOnline) {
      const filtered = groups.filter((e) => e.type === "online");
      setFilteredGroups(filtered);
    } else {
      const filtered = groups.filter((e) => e.type === "offline");
      setFilteredGroups(filtered);
    }
  }, [isOnline, groups]);

  const columns = [
    {
      key: "groupName",
      title: "Group Name",
      dataIndex: "group_name",
      search: true,
    },
    {
      key: "actions",
      title: "Actions",
      dataIndex: "actions",
      render: (text, row) => {
        return (
          <DropMenu child={"Actions"}>
            <div className="actions-btn">
              {/* <div
                onClick={() => navigate(`${row.group_id}/groupStudents`)}
                className="open-btn c-pointer btn btn-primary"
              >
               Students
              </div> */}
              {/* {row?.gen?.type == "سنتر" ? (
                <div
                  onClick={() => navigate(`${row.group_id}/exams`)}
                  className="open-btn c-pointer btn btn-primary"
                >
                  Exams
                </div>
              ) : null} */}

              <div
                className="open-btn c-pointer btn btn-outline-primary"
                onClick={() => navigate(`${row?.group_id}/Packages`)}
              >
                Packages
              </div>
              <div
                className="open-btn c-pointer btn btn-outline-primary"
                onClick={() =>
                  navigate(`${row?.group_id}/exams`, {state: isOnline})
                }
              >
                Exams
              </div>
            </div>
          </DropMenu>
        );
      },
    },
  ];

  return (
    <div className="groups">
      <div className="tablePageHeader">
        <h1 className="pageTitle">Groups</h1>
        {/* <button
          className="btn btn-success"
          onClick={() => {
            setAddModal(true);
          }}
        >
          Add Group
        </button> */}
      </div>
      <div className="d-flex gap-2 justify-content-center py-2 align-items-center">
        <button
          className={`btn ${isOnline ? "btn-primary" : "btn-outline-primary"}`}
          onClick={handleToggle}
        >
          Online
        </button>
        <button
          className={`btn ${!isOnline ? "btn-primary" : "btn-outline-primary"}`}
          onClick={handleToggle}
        >
          Offline
        </button>
      </div>
      <CustomTable dataSource={filteredGroups} columns={columns} />
      <AssignToGroup openModal={assignModal} setOpenModal={setAssignModal} />
      <AddGroupModal openModal={addModal} setOpenModal={setAddModal} />
      <DeleteGroupModal openModal={deleteModal} setOpenModal={setDeleteModal} />
      <ShowHideGroupModal
        openModal={showHideModal}
        setOpenModal={setShowHideModal}
      />
      <EditGroupModal openModal={editModal} setOpenModal={setEditModal} />
    </div>
  );
}

export default Groups;
