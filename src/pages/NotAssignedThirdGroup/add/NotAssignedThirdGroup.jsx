import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { students } from "../../../assets/svgIcons";
import AddGroupModal from "../../../components/groups/add";
import AssignToGroup from "../../../components/groups/assign";
import DeleteGroupModal from "../../../components/groups/delete";
import EditGroupModal from "../../../components/groups/edit";
import ShowHideGroupModal from "../../../components/groups/show-hide";
import CustomTable from "../../../components/table";
import { baseUrl } from "../../../utils/baseUrl";
import "./style.css";


function NotAssignedGroups() {
  const [groups, setGroups] = useState([]);
  const [studentsData, setStudents] = useState([]);
  
  const [openModal, setOpenModal] = useState(false);
  const [assignModal, setAssignModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [showHideModal, setShowHideModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const navigate = useNavigate();

  const getGroups = async () => {
    try {
      const response = await fetch(baseUrl + "3rd_offline_assign/select_not_assign_groups.php");
      const data = await response.json();
      setGroups(data);
    } catch (err) {
      setGroups([]);
    }
  };


  useEffect(() => {
    getGroups(); 
  }, []);

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
          <div className="actions-btns">
            <div
              onClick={() => navigate(`${row.group_id}/groupStudents`)}
              className="open-btn c-pointer text-success"
            >
              <div className="tooltip">Students</div>
              {students}
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="groups">
      <div className="tablePageHeader">
        <h1 className="pageTitle">Groups</h1>
        <button
          className="btn btn-success"
          onClick={() => {
            setAddModal(true);
          }}
        >
          Add Group
        </button>
      </div>
      <CustomTable dataSource={groups} columns={columns} />
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

export default NotAssignedGroups;
