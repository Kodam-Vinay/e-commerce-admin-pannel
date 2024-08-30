import { useEffect, useRef } from "react";
import CustomButton from "../../utils/CustomButton";
import CustomInput from "../../utils/CustomInput";
import { useSelector } from "react-redux";
import { v4 as uuidV4 } from "uuid";
import {
  CLOUDINARY_IMAGE_ACCESS_URL,
  MODAL_CONTENT_TYPES,
} from "../../utils/constants";
import useDeviceCheck from "../../hooks/useDeviceCheck";

const ProductForm = ({
  isError,
  name,
  setName,
  price,
  setPrice,
  brand,
  setBrand,
  isPremium,
  setIsPremium,
  loading,
  category,
  setCategory,
  description,
  setDescription,
  features,
  setFeatures,
  handleAddUpdateProduct,
  handleSaveImages,
  setIsError,
  subCategory,
  setSubCategory,
  setStock,
  stock,
  specifications,
  setSpecifications,
  checkAnyChangesMade,
  discount,
  setDiscount,
  imagesList,
  setImagesList,
  isSubmitClicked,
  isImageUploadClicked,
  handleClear,
  handleImageRemoveFromList,
}) => {
  useEffect(() => {
    setIsError(false);
  }, []);

  const contentType = useSelector((store) => store?.modal?.contentType);

  const categoriesList = useSelector(
    (store) => store?.categoryBrand?.categoriesList
  );

  const subCategoriesList = useSelector(
    (store) => store?.categoryBrand?.subCategoriesList
  );

  const brandsList = useSelector((store) => store?.categoryBrand?.brandsList);

  const handleImageUpload = (images) => {
    const imageArray = Object.values(images);

    imageArray.forEach((eachImage) => {
      if (eachImage?.type === "image/png" || eachImage?.type === "image/jpeg") {
        const reader = new FileReader();
        reader.onload = (e) => {
          const local_url = e.target.result;
          const image_id = uuidV4();
          const details = {
            image_id,
            image: eachImage,
            local_url,
          };
          setImagesList((prev) => [...prev, details]);
        };
        reader.readAsDataURL(eachImage);
      }
    });
  };

  const fileInputRef = useRef();

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSelectCategory = (e) => {
    const value = e.target.value;
    setCategory(value);
  };

  const handleSelectBrand = (e) => {
    const value = e.target.value;
    setBrand(value);
  };

  const handleSelectSubCategory = (e) => {
    const value = e.target.value;
    setSubCategory(value);
  };

  const isMobile = useDeviceCheck();

  return (
    <form
      onSubmit={handleAddUpdateProduct}
      className={`w-full self-center max-w-96 mx-auto space-y-3 ${
        isMobile ? "pb-4" : ""
      } `}
    >
      {/* name, price */}
      <div
        className={`flex flex-col items-center sm:items-start sm:flex-row my-2 space-y-2 sm:space-y-0 sm:space-x-2 sm:justify-center`}
      >
        <CustomInput
          label="Name"
          containerClassName={"w-full max-w-96"}
          className={`w-full`}
          type="text"
          error={isError && isSubmitClicked && !name && "Name is required"}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder={"Name"}
        />

        <CustomInput
          label="Price"
          containerClassName={"w-full max-w-96"}
          className={`w-full`}
          type="tel"
          pattern="[0-9]*"
          error={isError && isSubmitClicked && !price && "Price is required"}
          value={price}
          onChange={(event) => {
            setPrice((v) =>
              event.target.validity.valid ? event.target.value : ""
            );
          }}
          required
          placeholder={"Price"}
        />
      </div>

      {/* description, features */}
      <div
        className={`flex flex-col items-center sm:items-start sm:flex-row my-2 space-y-2 sm:space-y-0 sm:space-x-2 sm:justify-center`}
      >
        <CustomInput
          containerClassName={"w-full max-w-96"}
          label={"Description"}
          className="w-full"
          type="text"
          error={
            isError &&
            isSubmitClicked &&
            !description &&
            "Description is required"
          }
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder={"Description"}
        />
        <CustomInput
          containerClassName={"w-full max-w-96"}
          label={"Features"}
          className="w-full"
          type="text"
          error={
            isError && isSubmitClicked && !features && "Category is required"
          }
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
          required
          placeholder={"feature1, feature2"}
        />
      </div>

      {/* stock */}
      <div
        className={`flex flex-col items-center sm:items-start sm:flex-row my-2 space-y-2 sm:space-y-0 sm:space-x-2 sm:justify-center`}
      >
        <CustomInput
          label={"Stock Availability"}
          containerClassName={"w-full max-w-96"}
          className="w-full"
          error={
            isError &&
            isSubmitClicked &&
            Number(stock?.available) === 0 &&
            "Stock Availability is required"
          }
          value={stock?.available}
          type="tel"
          pattern="[0-9]*"
          onChange={(event) => {
            const { value, validity } = event.target;
            setStock((prevStock) => ({
              ...prevStock,
              available: validity.valid ? value : "",
            }));
          }}
          required
          placeholder={"Stock Count"}
        />
        <CustomInput
          label={"Stock Location"}
          containerClassName={"w-full max-w-96"}
          className="w-full"
          type="text"
          error={
            isError &&
            isSubmitClicked &&
            !stock?.warehouse_location &&
            "Stock Location is required"
          }
          value={stock?.warehouse_location}
          onChange={(e) =>
            setStock((prevStock) => ({
              ...prevStock,
              warehouse_location: e.target.value,
            }))
          }
          required
          placeholder={"WareHouse Location"}
        />
      </div>

      {/* category, sub_category */}
      <div
        className={`flex flex-col items-center sm:items-start sm:flex-row my-2 space-y-2 sm:space-y-0 sm:space-x-2 sm:justify-center`}
      >
        <div className={"w-full max-w-96"}>
          <CustomInput
            className={`w-full ${
              categoriesList?.length === 0 ? "bg-opacity-70" : ""
            }`}
            type="text"
            list="product_category"
            label="Category"
            value={category}
            onChange={(e) => handleSelectCategory(e)}
            error={
              isError && isSubmitClicked && !category && "Category is required"
            }
            disabled={categoriesList?.length === 0 || loading}
            placeholder="Category"
          />

          <datalist id="product_category">
            {categoriesList?.map((eachCategory) => (
              <option key={eachCategory?.id} value={eachCategory?.name}>
                {eachCategory?.name}
              </option>
            ))}
          </datalist>
        </div>

        <div className={"w-full max-w-96"}>
          <CustomInput
            className={`w-full ${
              subCategoriesList?.length === 0 ? "bg-opacity-50" : ""
            }`}
            type="text"
            list="product_sub_category"
            label="SubCategory"
            value={subCategory}
            onChange={(e) => handleSelectSubCategory(e)}
            error={
              isError &&
              isSubmitClicked &&
              !subCategory &&
              "Sub Category is required"
            }
            disabled={subCategoriesList?.length === 0 || loading}
            placeholder="Sub Category"
          />

          <datalist id="product_sub_category">
            {subCategoriesList?.map((eachSubCategory) => (
              <option key={eachSubCategory?.id} value={eachSubCategory?.name}>
                {eachSubCategory?.name}
              </option>
            ))}
          </datalist>
        </div>
      </div>

      {/* brand, is premium */}
      <div
        className={`flex flex-col items-center sm:items-start sm:flex-row my-2 space-y-2 sm:space-y-0 sm:space-x-2 sm:justify-center`}
      >
        <div className="w-full">
          <CustomInput
            className={`w-full sm:max-w-full ${
              brandsList?.length === 0 ? "bg-opacity-50" : ""
            }`}
            containerClassName={"w-full  sm:max-w-full"}
            type="text"
            list="product_brand"
            label="Brand"
            onChange={(e) => handleSelectBrand(e)}
            error={isError && isSubmitClicked && !brand && "Brand are required"}
            disabled={brandsList?.length === 0 || loading}
            placeholder="Brand"
            value={brand}
          />
          <datalist id="product_brand">
            {brandsList?.map((eachBrand) => (
              <option key={eachBrand?.id} value={eachBrand?.name}>
                {eachBrand?.name}
              </option>
            ))}
          </datalist>
        </div>
        <div className="w-full max-w-96 mx-auto">
          <label
            htmlFor="premium"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Is Premium
          </label>
          <select
            value={isPremium}
            id="premium"
            className={`w-full mt-2 px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline`}
            onChange={(e) =>
              setIsPremium(e.target.value === "true" ? true : false)
            }
          >
            <option value={false}>false</option>
            <option value={true}>true</option>
          </select>
        </div>
      </div>

      {/* specifications */}

      <div
        className={`flex flex-col items-center sm:items-start sm:flex-row my-2 space-y-2 sm:space-y-0 sm:space-x-2 sm:justify-center`}
      >
        <CustomInput
          label={"Weight"}
          containerClassName={"w-full max-w-96"}
          className="w-full"
          value={specifications?.weight}
          type="tel"
          pattern="[0-9]*"
          onChange={(event) => {
            const { value, validity } = event.target;
            setSpecifications((prevSpecs) => ({
              ...prevSpecs,
              weight: validity.valid ? value : "",
            }));
          }}
          required
          error={
            isError &&
            isSubmitClicked &&
            !specifications?.weight &&
            "Weight is required"
          }
          placeholder={"Weight"}
        />

        <CustomInput
          label={"Battery Life"}
          containerClassName={"w-full max-w-96"}
          className="w-full"
          value={specifications?.battery_life}
          type="tel"
          pattern="[0-9]*"
          onChange={(event) => {
            const { value, validity } = event.target;
            setSpecifications((prevSpecs) => ({
              ...prevSpecs,
              battery_life: validity.valid ? value : "",
            }));
          }}
          required
          error={
            isError &&
            isSubmitClicked &&
            subCategory === "mobiles" &&
            !specifications?.battery_life &&
            "Battery Life is required"
          }
          placeholder={"Battery Life"}
          disabled={subCategory !== "mobiles"}
        />
      </div>

      <div
        className={`flex flex-col items-center sm:items-start sm:flex-row my-2 space-y-2 sm:space-y-0 sm:space-x-2 sm:justify-center`}
      >
        <CustomInput
          type="text"
          containerClassName={"w-full max-w-96"}
          label={"Dimensions"}
          className="w-full"
          value={specifications?.dimensions}
          onChange={(event) => {
            setSpecifications((prevSpecs) => ({
              ...prevSpecs,
              dimensions: event.target.value,
            }));
          }}
          required
          placeholder={"Height, breadth, length"}
          error={
            isError &&
            isSubmitClicked &&
            !specifications?.dimensions &&
            "Dimensions are required"
          }
        />

        <CustomInput
          type="text"
          containerClassName={"w-full max-w-96"}
          label={"Color"}
          className="w-full"
          value={specifications?.color}
          onChange={(event) => {
            setSpecifications((prevSpecs) => ({
              ...prevSpecs,
              color: event.target.value,
            }));
          }}
          required
          placeholder={"Color"}
          error={
            isError &&
            isSubmitClicked &&
            !specifications?.color &&
            "Color are required"
          }
        />
      </div>

      <CustomInput
        label="Discount"
        containerClassName={"w-full max-w-96"}
        className={`w-full`}
        type="tel"
        pattern="[0-9]*"
        error={
          isError && isSubmitClicked && !discount && "Discount is required"
        }
        value={discount}
        onChange={(event) => {
          setDiscount((v) =>
            event.target.validity.valid ? event.target.value : ""
          );
        }}
        required
        placeholder={"Discount"}
      />

      {/* image */}
      <div className={"w-full max-w-96"}>
        <label
          htmlFor={"images"}
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          {"Upload Image"}
        </label>

        <div
          id="images"
          className={` flex flex-col self-center items-center justify-center my-2 space-y-2 h-20 w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline ${
            (isError && isSubmitClicked && imagesList?.length === 0) ||
            (isError && isImageUploadClicked && imagesList?.length === 0)
              ? "border-red-500"
              : "border-gray-300"
          } cursor-pointer`}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <p className="text-center">
            Drag&Drop or Click Here to Upload Images
          </p>
          <input
            disabled={loading}
            ref={fileInputRef}
            onChange={(e) => handleImageUpload(e.target.files)}
            type="file"
            accept="image/*"
            className={"w-full hidden"}
            multiple
          />
        </div>
        {isError && imagesList?.length === 0 && (
          <p className="text-[10px] xs:text-xs text-red-500">
            {"Please Select At Least One Image"}
          </p>
        )}
      </div>

      <div className="flex flex-col max-w-96">
        <div className="flex items-center self-end space-x-1">
          <CustomButton
            loading={isImageUploadClicked && loading}
            label={"Upload"}
            className={`w-20 mr-0 ${
              loading || (!isImageUploadClicked && imagesList?.length === 0)
                ? "cursor-not-allowed bg-opacity-70"
                : "cursor-pointer"
            }`}
            onClick={handleSaveImages}
            type={"button"}
            disabled={
              (!isImageUploadClicked && imagesList?.length === 0) || loading
            }
          />
          <CustomButton
            label={"Clear"}
            loading={loading}
            className={`w-20 mr-0 ${
              loading || imagesList?.length === 0
                ? "cursor-not-allowed  bg-opacity-70"
                : "cursor-pointer"
            }`}
            onClick={() => handleClear()}
            type={"button"}
            disabled={imagesList?.length === 0 || loading}
          />
        </div>
      </div>

      <div className={"w-full max-w-96 flex flex-wrap my-2"}>
        {imagesList?.length > 0 &&
          imagesList?.map((eachImage) => (
            <div
              key={eachImage?.image_id}
              className="h-14 w-14 border flex flex-col items-center justify-center mr-4 mb-2"
            >
              <CustomButton
                label={"x"}
                onClick={() => handleImageRemoveFromList(eachImage?.image_id)}
                className="h-4 w-4 pt-1 rounded-[100%] bg-red-700 hover:bg-red-400 -mr-3 -mt-4 text-center"
                type={"button"}
                removeButton={true}
                disabled={loading}
              />

              <img
                src={
                  eachImage?.local_url
                    ? eachImage?.local_url
                    : CLOUDINARY_IMAGE_ACCESS_URL.replace(
                        process.env.REACT_APP_CLOUDINARY_PRESET,
                        process.env.REACT_APP_CLOUDINARY_PRODUCTS_PRESET
                      ) + eachImage?.url
                }
                alt={eachImage?.image?.name}
              />
            </div>
          ))}
      </div>

      {/* button */}
      <div className={"w-full max-w-96"}>
        <CustomButton
          loading={isSubmitClicked && loading}
          label={
            contentType === MODAL_CONTENT_TYPES.updateProduct
              ? "Update Product"
              : "Add Product"
          }
          type={"submit"}
          className={
            !checkAnyChangesMade || loading
              ? "bg-opacity-70 hover:bg-opacity-70 cursor-not-allowed w-full max-w-96 h-10 capitalize"
              : "w-full max-w-96 h-10 cursor-pointer capitalize"
          }
          disabled={!checkAnyChangesMade || loading}
        />
      </div>
    </form>
  );
};

export default ProductForm;

{
  //   contentType === MODAL_CONTENT_TYPES.updateProduct ? (
  //   compareImagesLength && cloudinaryImagesList?.length > 0 ? (
  //     <div className={"w-full max-w-96 flex flex-wrap my-2"}>
  //       {cloudinaryImagesList?.map((eachImage) => (
  //         <div
  //           key={eachImage?.image_id}
  //           className="h-14 w-14 border flex flex-col items-center justify-center mr-4 mb-2"
  //         >
  //           <img
  //             src={
  //               CLOUDINARY_IMAGE_ACCESS_URL?.replace(
  //                 process.env.REACT_APP_CLOUDINARY_PRESET,
  //                 process.env.REACT_APP_CLOUDINARY_PRODUCTS_PRESET
  //               ) +
  //               "/" +
  //               eachImage?.url
  //             }
  //             alt={eachImage?.alt ? eachImage?.alt : "Product image"}
  //           />
  //         </div>
  //       ))}
  //     </div>
  //   ) : (
  //     <div className={"w-full max-w-96 flex flex-wrap my-2"}>
  //       {dbImages?.map((eachImage) => (
  //         <div
  //           key={eachImage?.image_id}
  //           className="h-14 w-14 border flex flex-col items-center justify-center mr-4 mb-2"
  //         >
  //           <img
  //             src={
  //               CLOUDINARY_IMAGE_ACCESS_URL?.replace(
  //                 process.env.REACT_APP_CLOUDINARY_PRESET,
  //                 process.env.REACT_APP_CLOUDINARY_PRODUCTS_PRESET
  //               ) +
  //               "/" +
  //               eachImage?.url
  //             }
  //             alt={eachImage?.alt}
  //           />
  //         </div>
  //       ))}
  //     </div>
  //   )
  // ) : (
  //   ""
  // )
}

{
  /* {cloudinaryImagesList?.length > 0 &&
  contentType === MODAL_CONTENT_TYPES.addProduct && (
    <div className={"w-full max-w-96 flex flex-wrap my-2"}>
      {cloudinaryImagesList?.map((eachImage) => (
        <div
          key={eachImage?.image_id}
          className="h-14 w-14 border flex flex-col items-center justify-center mr-4 mb-2"
        >
          <img
            src={
              CLOUDINARY_IMAGE_ACCESS_URL?.replace(
                process.env.REACT_APP_CLOUDINARY_PRESET,
                process.env.REACT_APP_CLOUDINARY_PRODUCTS_PRESET
              ) +
              "/" +
              eachImage?.url
            }
            alt={eachImage?.alt ? eachImage?.alt : "Product image"}
          />
        </div>
      ))}
    </div>
  )} */
}

{
  /* {imagesList?.length > 0 && (
  <div className={"w-full max-w-96 flex flex-wrap my-2"}>
    {imagesList?.map((eachImage) => (
      <div
        key={eachImage?.image_id}
        className="h-14 w-14 border flex flex-col items-center justify-center mr-4 mb-2"
      >
        <CustomButton
          disabled={isSaveClicked}
          label={"x"}
          onClick={() => dispatch(removeImageFromList(eachImage?.id))}
          className="h-4 w-4 pt-1 rounded-[100%] bg-red-700 hover:bg-red-400 -mr-3 -mt-5 text-center"
          type={"button"}
          removeButton={true}
        />

        <img src={eachImage?.url} alt={eachImage?.image?.name} />
      </div>
    ))}
  </div>
)} */
}
