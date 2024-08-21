import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CustomButton from "../../utils/CustomButton";
import { productColumns } from "../../utils/constants";
import Loader from "../Loader";
import ProductCarousel from "../ProductCarousel";

function createData(
  s_no,
  name,
  category,
  sub_category,
  brand,
  features,
  price,
  description,
  stock,
  specifications,
  images,
  is_premium,
  id,
  product_id
) {
  return {
    s_no,
    name,
    category,
    sub_category,
    brand,
    features,
    price,
    description,
    stock,
    specifications,
    images,
    is_premium,
    id,
    product_id,
  };
}

export default function ProductsTable({
  data,
  setPage,
  setRowsPerPage,
  page,
  rowsPerPage,
  handleDeleteProduct,
  handleUpdateProduct,
  loading,
  notFoundText,
}) {
  const rows = data?.map((each, index) =>
    createData(
      index + 1,
      each?.name,
      each?.category,
      each?.sub_category,
      each?.brand,
      each?.features,
      each?.price,
      each?.description,
      each?.stock,
      each?.specifications,
      each?.images,
      each?.is_premium,
      each?.product_id,
      each?.product_id
    )
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%", overflowX: "auto" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {productColumns.map((column) => (
                <TableCell
                  key={column.id}
                  style={{
                    minWidth: column.minWidth,
                    marginLeft: column.label === "image" ? "20px" : "",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={productColumns.length} align="center">
                  <Loader />
                </TableCell>
              </TableRow>
            ) : rows?.length > 0 ? (
              rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    {productColumns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell
                          key={column.id}
                          // align={column.align ? column.align : "center"}
                        >
                          {column.id === productColumns[10].id ? (
                            <ProductCarousel imagesList={value} />
                          ) : column.id ===
                            productColumns[productColumns.length - 1].id ? (
                            <CustomButton
                              onClick={() => handleDeleteProduct(row)}
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
                          ) : column?.id ===
                            productColumns[productColumns.length - 2].id ? (
                            <CustomButton
                              onClick={() => handleUpdateProduct(row)}
                              label={
                                <EditIcon
                                  sx={{
                                    height: 25,
                                    width: 25,
                                    marginLeft: 1,
                                  }}
                                />
                              }
                            />
                          ) : column?.id === productColumns[5].id ? (
                            // features
                            value?.map((each, index) => (
                              <li key={index} className="my-1">
                                {each}
                              </li>
                            ))
                          ) : column?.id === productColumns[6].id ? (
                            // features
                            <p className="font-semibold">{value + " /-"}</p>
                          ) : column?.id === productColumns[8].id ? (
                            // stock
                            <>
                              <li className="list-none text-left">
                                Available Count:{" "}
                                <span className="font-semibold">
                                  {value?.available}
                                </span>
                              </li>
                              <li className="list-none text-left">
                                Location:{" "}
                                <span className="font-semibold">
                                  {value?.warehouse_location}
                                </span>
                              </li>
                            </>
                          ) : column?.id === productColumns[9].id ? (
                            // specifications
                            <>
                              {value?.battery_life && (
                                <li className="list-none text-left">
                                  Battery Life:{" "}
                                  <span className="font-semibold">
                                    {value?.battery_life}
                                  </span>
                                </li>
                              )}
                              <li className="list-none text-left">
                                Color:{" "}
                                <span className="font-semibold">
                                  {value?.color}
                                </span>
                              </li>
                              <li className="list-none text-left">
                                Dimensions:{" "}
                                <span className="font-semibold">
                                  {value?.color?.split(",").join("x")}
                                </span>
                              </li>
                              <li className="list-none text-left">
                                Weight:{" "}
                                <span className="font-semibold">
                                  {Math.round(value?.weight) / 1000 + "kg"}
                                </span>
                              </li>
                            </>
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
                <TableCell colSpan={productColumns.length} align="center">
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
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
