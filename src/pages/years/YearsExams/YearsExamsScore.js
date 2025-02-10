import React, {useEffect, useState} from "react";
import CustomTable from "../../../components/table";
import {deleteIcon, editIcon} from "../../../assets/svgIcons";
import AddScore from "../../../components/groups/exams/scores/add";
import {baseUrl} from "../../../utils/baseUrl";
import {useParams} from "react-router-dom";
import Modal from "../../../components/modal";
import axios from "axios";

function YearsExamScore() {
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openResetModal, setOpenResetModal] = useState(false);
  const {gen_id, exam_id} = useParams();
  const [data, setData] = useState(null);
  const [rowData, setRowData] = useState([]);

  const [students, setStudents] = useState(null);

  const getData = async () => {
    try {
      const response = await fetch(
        baseUrl + "absence/select_quiz_students.php",
        {
          method: "POST",
          header: {"Content-Type": "Application/Json"},
          body: JSON.stringify({quiz_id: exam_id}),
        }
      );
      const data = await response.json();
      setStudents(data?.filter((item) => item?.score == "-"));
      setData(data);
    } catch (err) {
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
      student_id: rowData?.student_id,
    };
    try {
      const res = await axios.post(
        `${baseUrl}absence/reset_exam.php`,
        dataSend
      );

      console.log(res);

      if (res?.data == "success") {
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
      key: "name",
      title: "Student Name",
      dataIndex: "student_name",
      search: true,
    },
    {
      key: "phone",
      title: "Phone Number",
      dataIndex: "student_phone",
    },
    {
      key: "parent_phone",
      title: "parent Phone Number",
      dataIndex: "parent_phone",
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
            {row?.score == "-" ? (
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
      <div
        className="tablePageHeader scoretablePageHeader"
        style={{flexDirection: "column", justifyContent: "flex-start"}}
      >
        <b style={{marginRight: "auto", marginLeft: "20px"}}>Add Score</b>
        <AddScore
          getStudents={getData}
          id={exam_id}
          openModal={openModal}
          setOpenModal={setOpenModal}
          students={students}
        />
      </div>
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
