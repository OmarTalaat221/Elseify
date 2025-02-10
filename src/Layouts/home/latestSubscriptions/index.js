import React from "react";
import CustomTable from "../../../components/table";
import "./style.css";

import {
  closedEye,
  deleteIcon,
  editIcon,
  openedEye,
  openPage,
} from "../../../assets/svgIcons";
import {
  expiredSubscriptions,
  latestSubscriptions,
} from "../../../data/home/tables";

const subscriptionColumns = [
  {
    key: "name",
    title: "Subscription Name",
    dataIndex: "name",
    search: true,
  },
  {
    key: "startDate",
    title: "Start Date",
    dataIndex: "startDate",
    render: (e, row) => {
      return <span>{row?.startDate}</span>;
    },
  },
  {
    key: "endDate",
    title: "End Date",
    dataIndex: "endDate",
    render: (e, row) => {
      return <span>{row?.endDate}</span>;
    },
  },
];

function Subscriptions() {
  return (
    <div className="subscriptions">
      <div className="subscriptions-grid">
        <div className="">
          <h4>Latest Subscriptions</h4>
          <CustomTable
            dataSource={latestSubscriptions}
            columns={subscriptionColumns}
          />
        </div>
        <div className="">
          <h4>Expired Subscriptions</h4>
          <CustomTable
            dataSource={expiredSubscriptions}
            columns={subscriptionColumns}
          />
        </div>
      </div>
    </div>
  );
}

export default Subscriptions;
