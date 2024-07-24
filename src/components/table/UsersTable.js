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
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column?.id === "image" ? (
                            <Avatar
                              src={CLOUDINARY_IMAGE_ACCESS_URL + value}
                              alt={value}
                              key={row?.s_no}
                            />
                          ) : column?.id === "delete" ? (
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
                              className="w-14 max-w-14"
                              key={row?.s_no}
                            />
                          ) : (
                            value?.toString()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
