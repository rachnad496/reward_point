import React, { useEffect, useState, useMemo } from "react";
import { useTable } from "react-table";
import { TableData } from "./mockData/mockData";

const prepareData = (transactions) => {
  const calculatePoints = (purchase) => {
    let points = 0;

    if (purchase > 100) {
      const amountOver100 = purchase - 100;
      points += amountOver100 * 2 + 50;
    }

    if (purchase >= 50 && purchase <= 100) {
      points += purchase - 50;
    }

    return points;
  };

  const customers = {};
  const columns = [
    {
      Header: "Customer",
      accessor: "customer",
    },
  ];

  transactions.forEach((transaction) => {
    const { customer, month, purchase } = transaction;

    const points = calculatePoints(purchase);

    if (!customers[customer]) {
      customers[customer] = { customer, total: 0 };
    }

    if (!customers[customer][month]) {
      customers[customer][month] = points;
    } else {
      customers[customer][month] += points;
    }

    customers[customer].total += points;

    if (!columns.find((column) => column.accessor === month)) {
      columns.push({
        Header: month,
        accessor: month,
        aggregate: "sum",
        Aggregated: ({ value }) => value,
      });
    }
  });

  columns.push({
    Header: "Total",
    accessor: "total",
    aggregate: "sum",
    Aggregated: ({ value }) => value,
  });

  return { columns, data: Object.values(customers) };
};

const RewardsTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchMockData = async () => {
      setData(TableData);
    };

    fetchMockData();
  }, []);

  const { columns, data: tableData } = useMemo(() => prepareData(data), [data]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: tableData });

  return (
    <table {...getTableProps()} className="rewards-table">
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()} className="table-header">
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} className="table-data">
              {row.cells.map((cell) => (
                <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default RewardsTable;
