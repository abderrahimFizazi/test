import React, { useState, useEffect, useMemo, useRef } from "react";
import Pagination from "@material-ui/lab/Pagination";
import { useTable } from "react-table";
import SearchBar from "../components/SearchBar";
import axios from 'axios'
import { useHistory, useParams } from "react-router";
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

const URL = "http://localhost:5000/"

const Students = (props) => {
  const history = useHistory();
  const { id } = useParams();
  const [students, setStudents] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const studentsRef = useRef();

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(3);

  const pageSizes = [5, 10, 15, 20, 25];

  studentsRef.current = students;

  const onChangeSearchTitle = (e) => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };

  const getRequestParams = (searchTitle, page, pageSize) => {
    let params = {};

    if (searchTitle) {
      params["title"] = searchTitle;
    }

    if (page) {
      params["page"] = page - 1;
    }

    if (pageSize) {
      params["size"] = pageSize;
    }

    return params;
  };

  const retrieveStudents = async () => {
    try {
      const response = await axios.get(URL + "student/pagination");
      console.log(response.data);

      const responseData = response.data.data;

      if (Array.isArray(responseData)) {
        setStudents(responseData);
        setCount(response.data.count);
      } else {
        console.error('Invalid API response format:', responseData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  useEffect(retrieveStudents, [searchTitle, page, pageSize]);

  const refreshList = () => {
    retrieveStudents();
  };

  const removeAllStudents = () => {

  };

  const findByTitle = () => {
    setPage(1);
    retrieveStudents();
  };

  const updateStudent = (rowIndex) => {
    const id = studentsRef.current[rowIndex].id;

    props.history.push("/tutorials/" + id);
  };

  const deleteStudent = async (rowIndex) => {
    const id = studentsRef.current[rowIndex].id;

    try {
      await axios.delete(`${URL}student/${id}`);
      toast.success("Student deleted successfully")
      retrieveStudents();
    } catch (error) {
      toast.error("Error deleting student");
      console.error('Error deleting student:', error);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(1);
  };

  const columns = useMemo(
    () => [
      {
        Header: "FullName",
        accessor: "fullname",
      },
      {
        Header: "Age",
        accessor: "age",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: (props) => {
          const rowIdx = props.row.id;
          return (
            <div>
              <span onClick={() => updateStudent(rowIdx)}>
                <i className="far fa-edit action mr-2"></i>
              </span>

              <span onClick={() => deleteStudent(rowIdx)}>
                <i className="fas fa-trash action"></i>
              </span>
            </div>
          );
        },
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data: students,
  });

  return (
    <div className="list row">
      <ToastContainer />

      <SearchBar />

      <div className="col-md-12 list">
        <div className="mt-3">
          {"Items per Page: "}
          <select onChange={handlePageSizeChange} value={pageSize}>
            {pageSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          <Pagination
            className="my-3"
            count={count}
            page={page}
            siblingCount={1}
            boundaryCount={1}
            variant="outlined"
            shape="rounded"
            onChange={handlePageChange}
          />
        </div>

        <table
          className="table table-striped table-bordered"
          {...getTableProps()}
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="col-md-8">
        <button className="btn btn-sm btn-danger" onClick={removeAllStudents}>
          Remove All
        </button>
      </div>
    </div>
  );
};

export default Students;
