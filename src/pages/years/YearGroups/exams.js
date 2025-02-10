import React, {useEffect, useState} from "react";
import {questions, score} from "../../../assets/svgIcons";
import CustomTable from "../../../components/table";

import {useNavigate, useParams} from "react-router-dom";
import AddExam from "../../../components/groups/exams/add";
import {baseUrl} from "../../../utils/baseUrl";

function GroupsQuizzes() {
  const [openModal, setOpenModal] = useState(false);

  const navigate = useNavigate();
  const {group_id} = useParams();
  const [data, setData] = useState(null);
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    try {
      setUserData(JSON.parse(localStorage.getItem("moreenglishlogin")));
    } catch (err) {}
  }, [localStorage]);
  const getData = async () => {
    try {
      const response = await fetch(
        baseUrl + "absence/select_group_offline_quizes.php",
        {
          method: "POST",
          header: {"Content-Type": "Application/Json"},
          body: JSON.stringify({group_id: group_id}),
        }
      );
      const data = await response.json();
      setData(data);
    } catch (err) {
      setData([]);
    }
  };

  // const getYears = async () => {
  //   try {
  //     const yearsData = await fetch(baseUrl + "select_genrations.php");
  //     const data = await yearsData?.json();
  //     console.log(data);
  //     setData(data);
  //   } catch (err) {
  //     setData([]);
  //   }
  // };

  useEffect(() => {
    getData();
    // getYears();
  }, []);
  const columns = [
    {
      key: "date",
      title: "date",
      dataIndex: "date",
      render: (text, row) => <span>{row?.date}</span>,
    },

    {
      key: "actions",
      title: "Actions",
      dataIndex: "actions",
      render: (text, row) => {
        return (
          <div className="actions-btns">
            {/* <div
              className="delete-btn c-pointer text-danger"
              onClick={() => setOpenDeleteModal(row)}
            >
              <div className="tooltip">Delete</div>
              {deleteIcon}
            </div>
            <div
              className="open-btn c-pointer text-primary"
              onClick={() => setOpenEditModal(row)}
            >
              <div className="tooltip">Edit</div>
              {editIcon}
            </div> */}
            {/* <div
              className={
                row?.hidden
                  ? "showhide-btn c-pointer text-success"
                  : "showhide-btn c-pointer text-danger"
              }
              onClick={() => setOpenShowHideModal(row)}
            >
              <div className="tooltip">{row?.hidden ? "Show" : "Hide"}</div>
              {row?.hidden ? closedEye : openedEye}
            </div> */}
            {/* <div
              className="open-btn c-pointer text-success"
              onClick={() => navigate(`${row?.key}`)}
            >
              <div className="tooltip">Questions</div>
              {questions}
            </div> */}
            <div
              className="open-btn c-pointer text-success"
              onClick={() => navigate(`${row?.quiz_id}/score`)}
            >
              <div className="tooltip">Scores</div>
              {score}
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="exams">
      <div className="tablePageHeader">
        <h1 className="pageTitle">Exams</h1>
        <button
          className="btn btn-success"
          onClick={() => {
            setOpenModal(true);
          }}
        >
          Add Exam
        </button>
      </div>
      <CustomTable dataSource={data} columns={columns} />
      <AddExam
        group_id={group_id}
        // getData={getData}
        openModal={openModal}
        setOpenModal={setOpenModal}
        user_id={userData?.user_id}
      />
      {/* <EditExams openModal={openEditModal} setOpenModal={setOpenEditModal} />
      <DeleteExams
        openModal={openDeleteModal}
        setOpenModal={setOpenDeleteModal}
      />
      <ShowHideExams
        openModal={openShowHideModal}
        setOpenModal={setOpenShowHideModal}
      /> */}
    </div>
  );
}

export default GroupsQuizzes;
