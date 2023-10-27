import React, { useState, useEffect, useRef } from 'react';
import MaterialTable from 'material-table';
import axios from 'axios';

const Table = () => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const isMounted = useRef(true)

  const fetchData = async () => {
    try {
      const response = await axios.get('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    isMounted.current = true;

    fetchData();

    return () => {
      isMounted.current = false; // Set to false when component is unmounted
    };
  }, []);

  const handleBulkDelete = () => {
    const updatedData = data.filter((row) => !selectedRows.includes(row));
    setData(updatedData);
  };

  const columns = [
    { title: 'Id', field: 'id' },
    { title: 'Name', field: 'name' },
    { title: 'E-Mail', field: 'email' },
    { title: 'Role', field: 'role' },
  ];

  return (
    <div>
      <MaterialTable
        columns={columns}
        data={data}
        onSelectionChange={(rows) => setSelectedRows(rows)}
        editable={{
          onRowAdd: (newRow) =>
            new Promise((resolve, reject) => {
              const updatedRows = [...data, newRow];
              setTimeout(() => {
                setData(updatedRows);
                resolve();
              }, 2000);
            }),
          onRowDelete: (selectedRow) =>
            new Promise((resolve, reject) => {
              const index = selectedRow.tableData.id;
              const updatedRows = [...data];
              updatedRows.splice(index, 1);
              setTimeout(() => {
                setData(updatedRows);
                resolve();
              }, 2000);
            }),
          onRowUpdate: (updatedRow, oldRow) =>
            new Promise((resolve, reject) => {
              const index = oldRow.tableData.id;
              const updatedRows = [...data];
              updatedRows[index] = updatedRow;
              setTimeout(() => {
                setData(updatedRows);
                resolve();
              }, 2000);
            }),
          onBulkUpdate: (selectedRows) =>
            new Promise((resolve) => {
              const updatedRows = [...data];
              Object.values(selectedRows).forEach((data) => {
                const index = data.oldData.tableData.id;
                updatedRows[index] = data.newData;
              });
              setTimeout(() => {
                setData(updatedRows);
                resolve();
              }, 2000);
            }),
        }}
        options={{
          actionsColumnIndex: -1,
          selection: true,
        }}
        actions={[
          {
            icon: 'delete',
            tooltip: 'Delete all selected rows',
            onClick: handleBulkDelete,
          },
        ]}
      />
    </div>
  );
};

export default Table;
