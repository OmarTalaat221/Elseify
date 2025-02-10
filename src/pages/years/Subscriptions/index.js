import React, { useEffect, useState } from "react";
import CustomTable from "../../../components/table";

import { useParams } from "react-router-dom";
import { baseUrl } from "../../../utils/baseUrl";
import {
  closedEye,
  deleteIcon,
  editIcon,
  openedEye,
  openPage,
} from "../../../assets/svgIcons";

function Subscriptions() {
  const [openModal, setOpenModal] = useState(false);
  const [students, setStudents] = useState(null);
  const { id, type } = useParams();
  useEffect(() => {
    if (id) getStudents();
  }, [id]);
  const getStudents = async () => {
    try {
      const response = await fetch(
        baseUrl + "subscriptions/select_subscriptions_by_generation.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(type == "years" ? { generation_id: id } : {}),
        }
      );

      const data = await response.json();
      setStudents(data);
    } catch (err) {
      setStudents([]);
    }
  };

  const columns = [
    {
      key: "name",
      title: "Name",
      dataIndex: "student_name",
      search: true,
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
      key: "package",
      title: "Package",
      dataIndex: "name",
    },
    {
      key: "start_date",
      title: "Start Date",
      dataIndex: "start_date",
    },
    {
      key: "school_name",
      title: "School Name",
      dataIndex: "school_name",
    },
    {
      key: "price",
      title: "Price",
      dataIndex: "price",
    },
  ];
  return (
    <div className="students">
      <div className="tablePageHeader">
        <h1 className="pageTitle">Subscriptions</h1>
      </div>
      <CustomTable dataSource={students} columns={columns} />
    </div>
  );
}

export default Subscriptions;
