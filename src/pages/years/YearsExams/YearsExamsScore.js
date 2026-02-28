import React, { useEffect, useState } from "react";
import CustomTable from "../../../components/table";
import { deleteIcon, editIcon } from "../../../assets/svgIcons";
import AddScore from "../../../components/groups/exams/scores/add";
import { baseUrl, secondUrl } from "../../../utils/baseUrl";
import { useParams } from "react-router-dom";
import Modal from "../../../components/modal";
import axios from "axios";
import toast from "react-hot-toast";

function YearsExamScore() {
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openResetModal, setOpenResetModal] = useState(false);
  const { gen_id, exam_id } = useParams();
  const [data, setData] = useState(null);
  const [rowData, setRowData] = useState([]);

  const [students, setStudents] = useState(null);

  const getData = async () => {
    try {
      const response = await axios.post(
        `${secondUrl}select_who_solved.php`,
        {
          exam_id: exam_id,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response?.status === 200) {
        const data = response.data?.students; // Axios automatically parses JSON
        setStudents(data?.filter((item) => item?.score === "0"));
        setData(data);
      } else {
        throw new Error("Unexpected response status: " + response.status);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setData([]);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  // useEffect(() => {
  //   console.log(rowData);
  // }, [rowData]);

  const resetExam = async () => {
    setLoading(true);
    const dataSend = {
      quiz_id: exam_id,
      student_id: rowData?.id,
    };

    try {
      const res = await axios.post(
        `${baseUrl}absence/reset_exam.php`,
        dataSend
      );

      console.log(res);

      if (res?.status == 200) {
        toast.success(res.data);
        getData();
        setOpenResetModal(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: "position",
      title: "Position",
      dataIndex: "position",
    },
    {
      key: "name",
      title: "Student Name",
      dataIndex: "student_name",
      search: true,
    },

    {
      key: "score",
      title: "Score",
      dataIndex: "score",
      render: (text, row) => {
        return (
          <>
            {row?.score == "-" ? (
              <div className="text-danger">Not Answered</div>
            ) : (
              row?.score
            )}
          </>
        );
      },
    },

    {
      key: "action",
      title: "Actions",
      dataIndex: "actions",
      render: (text, row) => {
        return (
          <>
            {row?.score == "0" ? (
              <div className="d-flex align-items-center">
                <button
                  style={{
                    pointerEvents: "none",
                  }}
                  className="btn btn-secondary "
                  onClick={() => {
                    console.log(row);
                    setOpenResetModal(true);
                    setRowData(row);
                  }}
                >
                  Reset Exam
                </button>
              </div>
            ) : (
              <div className="d-flex align-items-center">
                <button
                  className="btn btn-danger "
                  onClick={() => {
                    setOpenResetModal(true);
                    setRowData(row);
                  }}
                >
                  Reset Exam
                </button>
              </div>
            )}
          </>
        );
      },
    },
  ];

  return (
    <div className="exam-scores">
      <CustomTable dataSource={data} columns={columns} />

      <Modal
        close={setOpenResetModal}
        footer={false}
        title={"Reset Exam"}
        visible={openResetModal}
      >
        <div className="d-flex flex-column gap-3 ">
          <div className="fs-5 bold">Are You Sure To Reset This Student?</div>
          <div className="d-flex justify-content-end gap-3 align-items-center">
            <button className="btn btn-success" onClick={resetExam}>
              Confirm
            </button>

            <button
              className="btn btn-danger"
              onClick={() => setOpenResetModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default YearsExamScore;
