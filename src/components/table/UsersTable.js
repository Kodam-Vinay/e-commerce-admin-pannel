import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Avatar } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "../../utils/CustomButton";
import { CLOUDINARY_IMAGE_ACCESS_URL, columns } from "../../utils/constants";
import Loader from "../Loader";

function createData(
  s_no,
  name,
  email,
  role,
  image,
  address,
  is_premium_user,
  verified,
  user_id
) {
  return {
    s_no,
    name,
    email,
    role,
    image,
    address,
    is_premium_user,
    verified,
    user_id,
  };
}

export default function UsersTable({
  data,
  setPage,
  setRowsPerPage,
  page,
  rowsPerPage,
  handleDeleteUser,
  loading,
  notFoundText,
}) {
  const rows = data?.map((each, index) =>
    createData(
      index + 1,
      each?.name,
      each?.email,
      each?.role,
      each?.image,
      each?.address,
      each?.is_premium_user,
      each?.verified,
      each?.id
    )
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleOnClickDeleteUser = (details) => {
    handleDeleteUser(details);
  };

  return (
    <Paper sx={{ minWidth: 740, overflowX: "auto" }}>
      <TableContainer sx={{ maxHeight: 440, overflowX: "auto" }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || "center"}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns?.length} align="center">
                  <Loader />
                </TableCell>
              </TableRow>
            ) : rows?.length > 0 ? (
              rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align || "center"}
                        >
                          {column.id === columns[4].id ? (
                            <Avatar
                              src={CLOUDINARY_IMAGE_ACCESS_URL + value}
                              alt={value}
                              key={row?.s_no}
                            />
                          ) : column.id === columns[columns.length - 1].id ? (
                            <CustomButton
                              onClick={() => handleOnClickDeleteUser(row)}
                              label={
                                <DeleteIcon
                                  sx={{
                                    height: 25,
                                    width: 25,
                                    marginLeft: 1,
                                  }}
                                />
                              }
                              className="w-10 max-w-10 bg-red-500 hover:bg-red-400"
                              key={row?.s_no}
                            />
                          ) : (
                            value?.toString()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns?.length} align="center">
                  No {notFoundText} found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
