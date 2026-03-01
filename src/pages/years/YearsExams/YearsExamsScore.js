import React, { useEffect, useState } from "react";
import CustomTable from "../../../components/table";
import { baseUrl, secondUrl } from "../../../utils/baseUrl";
import { useParams } from "react-router-dom";
import Modal from "../../../components/modal";
import axios from "axios";
import toast from "react-hot-toast";

function YearsExamScore() {
  const [loading, setLoading] = useState(false);
  const [openResetModal, setOpenResetModal] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const { exam_id } = useParams();
  const [data, setData] = useState([]);
  const [rowData, setRowData] = useState(null);

  // Parse score - handles both "0.95" and "2/2" formats
  const parseScore = (score) => {
    if (!score) return { percentage: 0, display: "0%" };

    // Check if it's a fraction like "2/2" or "1/2"
    if (score.includes("/")) {
      const [numerator, denominator] = score.split("/").map(Number);
      const percentage = (numerator / denominator) * 100;
      return {
        percentage: percentage,
        display: `${numerator}/${denominator}`,
        correct: numerator,
        total: denominator,
      };
    }

    // It's a decimal like "0.95" or "1"
    const decimal = parseFloat(score);
    const percentage = decimal * 100;
    const correctAnswers = Math.round(decimal * questionCount);

    return {
      percentage: percentage,
      display: `${percentage.toFixed(0)}%`,
      correct: correctAnswers,
      total: questionCount,
    };
  };

  const getData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${secondUrl}select_who_solved.php`,
        { exam_id: exam_id },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response?.status === 200 && response.data?.students) {
        setQuestionCount(response.data.question_count || 0);
        setData(response.data.students);
      } else {
        setData([]);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Failed to fetch data");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (exam_id) {
      getData();
    }
  }, [exam_id]);

  const resetExam = async () => {
    if (!rowData?.id) return;

    setLoading(true);
    try {
      const res = await axios.post(`${baseUrl}absence/reset_exam.php`, {
        quiz_id: exam_id,
        student_id: rowData.id,
      });

      if (res?.status === 200) {
        toast.success(res.data || "Exam reset successfully");
        getData();
        setOpenResetModal(false);
        setRowData(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to reset exam");
    } finally {
      setLoading(false);
    }
  };

  // Get score color based on percentage
  const getScoreColor = (percentage) => {
    if (percentage >= 85) return "success";
    if (percentage >= 70) return "primary";
    if (percentage >= 50) return "warning";
    return "danger";
  };

  // Calculate average percentage
  const calculateAverage = () => {
    if (!data || data.length === 0) return 0;
    const total = data.reduce((acc, curr) => {
      const parsed = parseScore(curr.score);
      return acc + parsed.percentage;
    }, 0);
    return (total / data.length).toFixed(1);
  };

  // Count passed students (>= 50%)
  const countPassed = () => {
    if (!data) return 0;
    return data.filter((student) => {
      const parsed = parseScore(student.score);
      return parsed.percentage >= 50;
    }).length;
  };

  const columns = [
    {
      key: "position",
      title: "#",
      dataIndex: "position",
      render: (text) => {
        const position = parseInt(text);
        let badgeClass = "bg-secondary";
        if (position === 1) badgeClass = "bg-warning text-dark";
        else if (position === 2) badgeClass = "bg-secondary";
        else if (position === 3) badgeClass = "bg-danger";

        return (
          <span className={`badge ${badgeClass}`} style={{ minWidth: "30px" }}>
            {position <= 3
              ? position === 1
                ? "1"
                : position === 2
                  ? "2"
                  : "3"
              : text}
          </span>
        );
      },
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
        const parsed = parseScore(row?.score);
        const colorClass = getScoreColor(parsed.percentage);

        return (
          <div className="d-flex flex-column">
            <span
              className={`badge bg-${colorClass}`}
              style={{ width: "fit-content" }}
            >
              {parsed.percentage.toFixed(0)}%
            </span>
            <small className="text-muted mt-1">
              {parsed.correct} / {parsed.total} correct
            </small>
          </div>
        );
      },
    },
    {
      key: "solved_date",
      title: "Date",
      dataIndex: "solved_date",
      render: (text) => <span>{text || "-"}</span>,
    },
    {
      key: "action",
      title: "Actions",
      dataIndex: "actions",
      render: (text, row) => {
        const parsed = parseScore(row?.score);

        return (
          <button
            className={`btn btn-sm btn-danger`}
            // disabled={parsed.percentage === 0}
            onClick={() => {
              setOpenResetModal(true);
              setRowData(row);
            }}
          >
            <i className="ri-refresh-line me-1"></i>
            Reset
          </button>
        );
      },
    },
  ];

  return (
    <div className="exam-scores">
      {/* Table */}
      <CustomTable dataSource={data} columns={columns} loading={loading} />

      {/* Reset Modal */}
      <Modal
        close={setOpenResetModal}
        footer={false}
        title="Reset Exam"
        visible={openResetModal}
      >
        <div className="d-flex flex-column gap-3">
          <div className="alert alert-warning mb-0">
            <i className="ri-alert-line me-2"></i>
            Are you sure you want to reset the exam for{" "}
            <strong>{rowData?.student_name}</strong>?
          </div>

          {rowData && (
            <div className="bg-light p-3 rounded">
              <div className="d-flex justify-content-between">
                <span>Current Score:</span>
                <strong
                  className={`text-${getScoreColor(parseScore(rowData?.score).percentage)}`}
                >
                  {parseScore(rowData?.score).percentage.toFixed(0)}%
                </strong>
              </div>
              <div className="d-flex justify-content-between mt-2">
                <span>Correct Answers:</span>
                <strong>
                  {parseScore(rowData?.score).correct} /{" "}
                  {parseScore(rowData?.score).total}
                </strong>
              </div>
            </div>
          )}

          <div className="d-flex justify-content-end gap-2 mt-2">
            <button
              className="btn btn-secondary"
              onClick={() => {
                setOpenResetModal(false);
                setRowData(null);
              }}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="btn btn-danger"
              onClick={resetExam}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Resetting...
                </>
              ) : (
                <>
                  <i className="ri-refresh-line me-1"></i>
                  Confirm Reset
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default YearsExamScore;
