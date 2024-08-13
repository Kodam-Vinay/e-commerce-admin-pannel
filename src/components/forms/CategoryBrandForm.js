import { useEffect } from "react";
import CustomButton from "../../utils/CustomButton";
import CustomInput from "../../utils/CustomInput";
import { useSelector } from "react-redux";
import { MODAL_CONTENT_TYPES, ROUTING_PATHS } from "../../utils/constants";

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
}) => {
  const contentType = useSelector((store) => store?.modal?.contentType);
  const buttonName = contentType?.split("_")?.join(" ");
  const activePath = useSelector(
    (store) => store?.persistSliceReducer?.path?.activePath
  );
  const categoriesList = useSelector(
    (store) => store?.categoryBrand?.categoriesList
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
            isError && activePath === ROUTING_PATHS.categories && !category
              ? "Category is Required"
              : isError && activePath === ROUTING_PATHS.brands && !brand
              ? "Brand is Required"
              : isError &&
                activePath === ROUTING_PATHS.subcategories &&
                !subCategory
              ? "Sub Category Is Required"
              : ""
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
              error={isError && !category && "Category is Required"}
            />

            <datalist id="categories">
              {categoriesList?.map((eachCategory) => (
                <option key={eachCategory?._id} value={eachCategory?.name}>
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
              value={brand}
              error={
                isError &&
                selectedBrandsList?.length === 0 &&
                "Brands are Required"
              }
            />
            <datalist id="brands">
              {filterBrandsList?.map((eachBrand) => (
                <option key={eachBrand?._id} value={eachBrand?.name}>
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
                      key={index}
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
          loading={loading}
          label={buttonName}
          disabled={!buttonActiveStatus}
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
