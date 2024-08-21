import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "../../utils/CustomButton";
import EditIcon from "@mui/icons-material/Edit";
import {
  categoriesBrandColumns,
  CLOUDINARY_IMAGE_ACCESS_URL,
  ROUTING_PATHS,
  subCategoriesColumns,
} from "../../utils/constants";
import { useSelector } from "react-redux";
import Loader from "../Loader";
import { Avatar } from "@mui/material";

function createData(s_no, name, status, image, id, category_brand_id) {
  return {
    s_no,
    name,
    status,
    image,
    id,
    category_brand_id,
  };
}

function createSubCategoriesData(
  s_no,
  name,
  status,
  category,
  brands,
  brands_list,
  categoryObj,
  id,
  category_brand_id
) {
  return {
    s_no,
    name,
    status,
    category,
    brands,
    brands_list,
    categoryObj,
    id,
    category_brand_id,
  };
}

export default function CatergoryBrandTable({
  data,
  setPage,
  setRowsPerPage,
  page,
  rowsPerPage,
  handleDeleteCategoryBrand,
  handleUpdateCategoryBrand,
  loading,
  notFoundText,
}) {
  const categoriesList = useSelector(
    (store) => store?.categoryBrand?.categoriesList
  );

  const brandsList = useSelector((store) => store?.categoryBrand?.brandsList);

  const activePath = useSelector(
    (store) => store?.persistSliceReducer?.path?.activePath
  );

  const rows = data?.map((each, index) =>
    createData(
      index + 1,
      each?.name,
      each?.status,
      each?.image,
      each?._id,
      each?._id
    )
  );

  const rows2 = data?.map((each, index) => {
    const category = categoriesList?.find(
      (eachCategory) => eachCategory?._id === each?.category
    );

    const categoryName = category?.name;
    const filterBrandsList = brandsList?.filter((eachBrand) => {
      return each?.brands?.includes(eachBrand?._id);
    });
    return createSubCategoriesData(
      index + 1,
      each?.name,
      each?.status,
      categoryName,
      filterBrandsList,
      filterBrandsList,
      category,
      each?._id,
      each?._id
    );
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleOnClickUpdateCategoryBrand = (details) => {
    handleUpdateCategoryBrand(details);
  };

  const handleOnClickDeleteCategoryBrand = (details) => {
    handleDeleteCategoryBrand(details);
  };

  return (
    <Paper sx={{ width: "100%", overflowX: "auto" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {activePath === ROUTING_PATHS.subcategories
                ? subCategoriesColumns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={
                        column.id === subCategoriesColumns[4].id
                          ? "left"
                          : "center"
                      }
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))
                : categoriesBrandColumns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={
                        column.id === categoriesBrandColumns[3].id
                          ? "left"
                          : column.align
                          ? column.align
                          : "center"
                      }
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
                <TableCell
                  colSpan={subCategoriesColumns?.length}
                  align="center"
                >
                  <Loader />
                </TableCell>
              </TableRow>
            ) : rows?.length > 0 || rows2?.length > 0 ? (
              activePath === ROUTING_PATHS.subcategories ? (
                rows2
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                        {subCategoriesColumns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell
                              key={column.id + index}
                              align={column.align ? column.align : "center"}
                            >
                              {column.id === subCategoriesColumns[5].id ? (
                                <>
                                  {value ? (
                                    <img
                                      src={
                                        CLOUDINARY_IMAGE_ACCESS_URL.replace(
                                          process.env
                                            .REACT_APP_CLOUDINARY_PRESET,
                                          process.env
                                            .REACT_APP_CLOUDINARY_CATEGORIES_BRANDS
                                        ) + value
                                      }
                                      alt={value}
                                      key={row?.s_no}
                                      className="w-16 h-10 border max-w-10"
                                    />
                                  ) : (
                                    <span className="text-xs">No Image</span>
                                  )}
                                </>
                              ) : column?.id ===
                                subCategoriesColumns[
                                  subCategoriesColumns.length - 1
                                ].id ? (
                                <CustomButton
                                  onClick={() =>
                                    handleOnClickDeleteCategoryBrand(row)
                                  }
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
                                subCategoriesColumns[
                                  subCategoriesColumns.length - 2
                                ].id ? (
                                <CustomButton
                                  onClick={() =>
                                    handleOnClickUpdateCategoryBrand(row)
                                  }
                                  label={
                                    <EditIcon
                                      sx={{
                                        height: 25,
                                        width: 25,
                                        marginLeft: 1,
                                      }}
                                    />
                                  }
                                  className="w-10 max-w-10"
                                  key={row?.s_no}
                                />
                              ) : column?.id === subCategoriesColumns[4].id ? (
                                value?.map((each) => (
                                  <li
                                    key={each?._id}
                                    className="my-1 text-left"
                                  >
                                    {each?.name}
                                  </li>
                                ))
                              ) : (
                                value?.toString()
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })
              ) : (
                rows
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                        {categoriesBrandColumns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell
                              key={column.id}
                              align={column.align ? column.align : "center"}
                            >
                              {column.id === categoriesBrandColumns[3].id ? (
                                <>
                                  {value ? (
                                    <img
                                      src={
                                        CLOUDINARY_IMAGE_ACCESS_URL.replace(
                                          process.env
                                            .REACT_APP_CLOUDINARY_PRESET,
                                          process.env
                                            .REACT_APP_CLOUDINARY_CATEGORIES_BRANDS
                                        ) + value
                                      }
                                      alt={value}
                                      key={row?.s_no}
                                      className="w-16 h-10 border max-w-10"
                                    />
                                  ) : (
                                    <span className="text-xs -ml-16">
                                      No Image
                                    </span>
                                  )}
                                </>
                              ) : column?.id ===
                                categoriesBrandColumns[
                                  categoriesBrandColumns.length - 1
                                ].id ? (
                                <CustomButton
                                  onClick={() =>
                                    handleOnClickDeleteCategoryBrand(row)
                                  }
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
                                categoriesBrandColumns[
                                  categoriesBrandColumns.length - 2
                                ].id ? (
                                <CustomButton
                                  onClick={() =>
                                    handleOnClickUpdateCategoryBrand(row)
                                  }
                                  label={
                                    <EditIcon
                                      sx={{
                                        height: 25,
                                        width: 25,
                                        marginLeft: 1,
                                      }}
                                    />
                                  }
                                  className="w-10 max-w-10"
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
                  })
              )
            ) : (
              <TableRow>
                <TableCell
                  colSpan={subCategoriesColumns?.length}
                  align="center"
                >
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
