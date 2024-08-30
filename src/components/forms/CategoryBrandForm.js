import { useEffect, useRef } from "react";
import CustomButton from "../../utils/CustomButton";
import CustomInput from "../../utils/CustomInput";
import { useDispatch, useSelector } from "react-redux";
import {
  CLOUDINARY_IMAGE_ACCESS_URL,
  MODAL_CONTENT_TYPES,
  ROUTING_PATHS,
} from "../../utils/constants";
import { ThreeCircles } from "react-loader-spinner";
import { Avatar } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { v4 as uniqueId } from "uuid";
import { storeImageId } from "../../redux/slices/imageSlice";
import { storeCategoryBrandInfo } from "../../redux/slices/categoryBrandSlice";

const CategoryBrandForm = ({
  isError,
  brand,
  setBrand,
  loading,
  category,
  setCategory,
  setIsError,
  subCategory,
  setSubCategory,
  isActive,
  setIsActive,
  handleAddCategoryOrBrand,
  handleUpdateCategoryOrBrand,
  buttonActiveStatus,
  setSelectedBrandsList,
  selectedBrandsList,
  setCategoryObject,
  handleImageUpload,
  imageUrl,
  isSubmitClicked,
  isImageUploadClicked,
}) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef();
  const handleClick = () => {
    fileInputRef.current.click();
  };
  const contentType = useSelector((store) => store?.modal?.contentType);
  const buttonName = contentType?.split("_")?.join(" ");
  const activePath = useSelector(
    (store) => store?.persistSliceReducer?.path?.activePath
  );
  const categoriesList = useSelector(
    (store) => store?.categoryBrand?.categoriesList
  );

  const uploadedImageDetails = useSelector(
    (store) => store?.persistSliceReducer?.image?.imageDetails
  );

  const brandsList = useSelector((store) => store?.categoryBrand?.brandsList);

  useEffect(() => {
    setIsError(false);
  }, []);

  const handleSelectBrand = (e) => {
    const value = e.target.value;
    setBrand(value);

    const brand = brandsList?.find((eachCat) => eachCat?.name === value);
    if (brandsList?.some((brand) => brand.name === value)) {
      setSelectedBrandsList([...selectedBrandsList, brand]);
      setBrand("");
    }
  };

  const handleSelectCategory = (e) => {
    const value = e.target.value;
    const category = categoriesList?.find((eachCat) => eachCat?.name === value);
    setCategory(value);
    setCategoryObject(category);
  };

  const handleOnClickBrand = (name) => {
    setBrand(name);
    const filterBrandsList = selectedBrandsList?.filter(
      (eachBrand) => eachBrand?.name !== name
    );
    setSelectedBrandsList(filterBrandsList);
  };

  useEffect(() => {
    const types = [
      MODAL_CONTENT_TYPES.updateBrand,
      MODAL_CONTENT_TYPES.updateCategory,
      MODAL_CONTENT_TYPES.updateSubCategory,
    ];
    if (!types.includes(contentType)) {
      dispatch(storeImageId({}));
      dispatch(storeCategoryBrandInfo({}));
    }
  }, [contentType]);

  const filterBrandsList = brandsList
    ?.filter(
      (eachBrand) =>
        !selectedBrandsList?.some(
          (selectedBrand) => selectedBrand?.name === eachBrand?.name
        )
    )
    .map((eachBrand) => ({
      ...eachBrand,
    }));

  return (
    <form
      onSubmit={
        contentType === MODAL_CONTENT_TYPES.updateCategory ||
        contentType === MODAL_CONTENT_TYPES.updateSubCategory ||
        contentType === MODAL_CONTENT_TYPES.updateBrand
          ? handleUpdateCategoryOrBrand
          : handleAddCategoryOrBrand
      }
      className={`w-full self-center max-w-96 mx-auto`}
    >
      <div className="flex flex-col items-center my-2 mt-4 relative">
        <div className="relative">
          {loading && isImageUploadClicked ? (
            <div className="flex flex-col items-center justify-center h-full w-full">
              <ThreeCircles
                visible={true}
                height="80"
                width="80"
                ariaLabel="three-circles-loading"
                color="#5046e5"
              />
            </div>
          ) : (
            <>
              {!uploadedImageDetails?.imageId && !imageUrl ? (
                <div className="h-[80px] w-[80px] border bg-gray-200"></div>
              ) : (
                <Avatar
                  alt="profile_logo"
                  src={
                    uploadedImageDetails?.imageId
                      ? CLOUDINARY_IMAGE_ACCESS_URL.replace(
                          process.env.REACT_APP_CLOUDINARY_PRESET,
                          process.env.REACT_APP_CLOUDINARY_CATEGORIES_BRANDS
                        ) + uploadedImageDetails?.imageId
                      : CLOUDINARY_IMAGE_ACCESS_URL.replace(
                          process.env.REACT_APP_CLOUDINARY_PRESET,
                          process.env.REACT_APP_CLOUDINARY_CATEGORIES_BRANDS
                        ) + imageUrl
                  }
                  sx={{
                    height: "80px",
                    width: "80px",
                    borderRadius: 0,
                  }}
                />
              )}
            </>
          )}

          <input
            ref={fileInputRef}
            onChange={(e) => handleImageUpload(e.target.files[0])}
            type="file"
            accept="image/*"
            className={"w-full hidden"}
          />
          <CustomButton
            label={
              <AddIcon
                sx={{
                  height: 25,
                  width: 25,
                  marginLeft: 1,
                }}
              />
            }
            className="h-7 w-7 max-w-6 max-h-6 rounded-[100%] absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 z-20"
            onClick={handleClick}
          />
        </div>
      </div>

      {/* name, status */}
      <div
        className={
          activePath === ROUTING_PATHS.subcategories
            ? `flex flex-col items-center sm:items-start sm:space-x-2 sm:flex-row sm:justify-center`
            : `flex flex-col`
        }
      >
        <CustomInput
          containerClassName={"w-full"}
          label="Name"
          className={`w-full`}
          type="text"
          error={
            isError &&
            isSubmitClicked &&
            activePath === ROUTING_PATHS.categories &&
            !category
              ? "Category is Required"
              : isError &&
                isSubmitClicked &&
                activePath === ROUTING_PATHS.brands &&
                !brand
              ? "Brand is Required"
              : isError &&
                isSubmitClicked &&
                activePath === ROUTING_PATHS.subcategories &&
                !subCategory
              ? "Sub Category Is Required"
              : null
          }
          value={
            activePath === ROUTING_PATHS.brands
              ? brand
              : activePath === ROUTING_PATHS.categories
              ? category
              : subCategory
          }
          onChange={(e) =>
            activePath === ROUTING_PATHS.brands
              ? setBrand(e.target.value)
              : activePath === ROUTING_PATHS.categories
              ? setCategory(e.target.value)
              : setSubCategory(e.target.value)
          }
          required
        />

        <div className="w-full max-w-96 mx-auto">
          <label
            htmlFor="active"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Is Active
          </label>
          <select
            value={isActive}
            id="active"
            className={`w-full mt-2 px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline`}
            onChange={(e) =>
              setIsActive(e.target.value === "true" ? true : false)
            }
          >
            <option value={false}>false</option>
            <option value={true}>true</option>
          </select>
        </div>
      </div>

      {activePath === ROUTING_PATHS.subcategories && (
        <>
          <div className="w-full max-w-96 mx-auto">
            <CustomInput
              className={`w-full`}
              type="text"
              list="categories"
              label="Category"
              value={category}
              onChange={(e) => handleSelectCategory(e)}
              error={
                isError &&
                isSubmitClicked &&
                !category &&
                "Category is Required"
              }
            />

            <datalist id="categories">
              {categoriesList?.map((eachCategory) => (
                <option key={eachCategory?.id} value={eachCategory?.name}>
                  {eachCategory?.name}
                </option>
              ))}
            </datalist>
          </div>

          <div className="w-full max-w-96 mx-auto">
            <CustomInput
              className={`w-full`}
              type="text"
              list="brands"
              label="Brands"
              onChange={(e) => handleSelectBrand(e)}
              value={brand ? brand : ""}
              error={
                isError &&
                isSubmitClicked &&
                selectedBrandsList?.length === 0 &&
                "Brands are Required"
              }
            />
            <datalist id="brands">
              {filterBrandsList?.map((eachBrand) => (
                <option key={eachBrand?.id} value={eachBrand?.name}>
                  {eachBrand?.name}
                </option>
              ))}
            </datalist>
            {selectedBrandsList?.length > 0 && (
              <div>
                <h3 className="mt-1">Selected Brands:</h3>
                <ul className="flex flex-wrap">
                  {selectedBrandsList.map((brand, index) => (
                    <li
                      key={uniqueId()}
                      onClick={() => handleOnClickBrand(brand?.name)}
                      className="cursor-pointer"
                    >
                      {index !== selectedBrandsList?.length - 1
                        ? brand?.name + ", "
                        : brand?.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      )}

      <div className="mt-5">
        <CustomButton
          loading={loading && isSubmitClicked}
          label={buttonName}
          disabled={!buttonActiveStatus || loading}
          type={"submit"}
          className={
            !buttonActiveStatus
              ? "bg-opacity-70 hover:bg-opacity-70 cursor-not-allowed w-full max-w-96 h-10 capitalize"
              : "w-full max-w-96 h-10 cursor-pointer capitalize"
          }
        />
      </div>
    </form>
  );
};

export default CategoryBrandForm;
