import React, { useEffect, useState } from "react";
import { questions, score } from "../../../assets/svgIcons";
import CustomTable from "../../../components/table";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import AddExam from "../../../components/groups/exams/add";
import { baseUrl, secondUrl } from "../../../utils/baseUrl";
import axios from "axios";
import { FaLock, FaLockOpen } from "react-icons/fa";

import toast from "react-hot-toast";
import Modal from "../../../components/modal";

function GroupsQuizzes() {
  const [openModal, setOpenModal] = useState(false);

  const navigate = useNavigate();
  const { group_id } = useParams();
  const [modal, setModal] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [data, setData] = useState(null);
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    try {
      setUserData(JSON.parse(localStorage.getItem("moreenglishlogin")));
    } catch (err) {}
  }, [localStorage]);
  const getData = async () => {
    try {
      const response = await axios.post(
        secondUrl + "select_exam_group.php",
        { group_id: group_id }, // Request body
        {
          headers: { "Content-Type": "application/json" }, // Corrected header key
        }
      );
      console.log(response.data); // Axios stores the response data in `response.data`
      setData(response.data?.message); // Set the data directly from the response
    } catch (err) {
      console.error("Error fetching data:", err); // Log the error for debugging
      setData([]); // Set data to an empty array in case of an error
    }
  };

  const location = useLocation();

  const isOnline = location?.state;

  useEffect(() => {
    console.log(isOnline);
  }, [isOnline]);

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

  const toggleLock = async () => {
    const dataSend = {
      exam_id: rowData?.exam_id,
      group_id: group_id,
    };

    console.log(dataSend);
    try {
      const res = await axios.post(
        `${secondUrl}show_hide_exam_group.php`,
        dataSend
      );
      if (res.data?.status == "success") {
        getData();
        toast.success(res.data.message);
        setModal(null);
      }
    } catch (error) {
      console.log(error);
    } finally {
      // setLoading(false);
    }
  };

  const columns = [
    {
      key: "exam_id",
      title: "exam id",
      dataIndex: "exam_id",
      render: (text, row) => <span>{row?.exam_id}</span>,
    },
    {
      key: "exam_name",
      title: "exam Name",
      dataIndex: "exam_name",
      render: (text, row) => <span>{row?.exam_name}</span>,
    },
    // {
    //   key: "exam_time",
    //   title: "exam Time",
    //   dataIndex: "exam_time",
    //   render: (text, row) => <span>{row?.exam_time}</span>,
    // },

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
              onClick={() => navigate(`${row?.exam_id}/score`)}
            >
              <div className="tooltip">Scores</div>
              {score}
            </div>
          </div>
        );
      },
    },
    {
      key: "lock",
      title: "Show Exam",
      dataIndex: "lock",
      render: (text, row) => (
        <>
          {row?.show_value == 0 ? (
            <div
              onClick={() => {
                setModal("show");
                console.log(row);
                setRowData(row);
              }}
              className="c-pointer d-flex justify-content-center alitn-items-center fs-5 text-danger"
            >
              <FaLock />
            </div>
          ) : (
            <div
              onClick={() => {
                setModal("show");

                setRowData(row);
              }}
              className="c-pointer d-flex justify-content-center alitn-items-center fs-5 text-success"
            >
              <FaLockOpen />
            </div>
          )}
        </>
      ),
    },
  ];

  return (
    <div className="exams">
      <div className="tablePageHeader">
        <h1 className="pageTitle">Exams</h1>
        {/* <button
          className="btn btn-success"
          onClick={() => {
            setOpenModal(true);
          }}
        >
          Add Exam
        </button> */}
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

      <Modal
        close={() => setModal(null)}
        footer={false}
        title={"Show Exam"}
        visible={modal == "show"}
      >
        <div className="d-flex flex-column gap-3 ">
          <div className="fs-5 bold">Are You Sure?</div>
          <div className="d-flex justify-content-end gap-3 align-items-center">
            <button className="btn btn-success" onClick={toggleLock}>
              Confirm
            </button>

            <button className="btn btn-danger" onClick={() => setModal(null)}>
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default GroupsQuizzes;
