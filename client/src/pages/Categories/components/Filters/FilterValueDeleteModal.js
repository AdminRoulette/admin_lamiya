import React from "react";
import { toast } from "react-toastify";
import { deleteCategory } from "@/http/Product/categoryAPI";
import { CustomModal } from "@/components/CustomElements/CustomModal";
import { deleteFilterValue } from "@/http/Product/filtersAPI";

const DeleteCategoriesModal = ({ onHide, setFilters, value_id }) => {
  const handleDelete = async () => {
    await deleteFilterValue({ id: value_id })
      .then(() => {
        setFilters((prev) => {
          return prev.map((filter) => {
            const filteredValues = filter.values?.filter(
              (v) => v.id !== value_id
            );
            return { ...filter, values: filteredValues };
          });
        });
      })
      .catch((error) => {
        toast(error.response.data.message);
      })
      .finally(() => {
        closeModal();
      });
  };

  const closeModal = () => {
    const modal = document.getElementById("modalId");
    if (modal) {
      modal.classList.add("closingModal");
      window.setTimeout(() => {
        onHide();
      }, 500);
    } else {
      onHide();
    }
    document.body.style.overflow = "";
  };

  return (
    <CustomModal
      onClose={closeModal}
      title={"Видалення значення фільтра"}
      onSubmit={handleDelete}
      buttonName={"Видалити"}
     
    >
      <div>Ви впевнені, що хочете видалити значення фільтра?</div>
    </CustomModal>
  );
};

export default DeleteCategoriesModal;
