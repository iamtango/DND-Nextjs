import { Button, IconButton } from "@mui/material";
import React, { useState } from "react";
import { toast } from "react-toastify";
import AddProductModal from "./AddProductModal";
import DeleteModel from "./DeleteModel";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const StateRow = ({
  index,
  filter,
  id,
  variants,
  onRemove,
  onAddVariant,
  rows,
  setRows,
  onVariantImageChange,
  onFilterChange,
  showFullWidth,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(
    Array(variants.length).fill(false)
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [variantToDelete, setVariantToDelete] = useState(null);
  const [newFilter, setNewFilter] = useState(filter);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(null);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const handleSaveFilter = () => {
    onFilterChange(index, newFilter);
    setIsEditing(false);
    toast.info("Filter updated!");
  };

  const openDeleteModal = (variantIndex) => {
    setVariantToDelete(variantIndex);
    setDeleteModalOpen(true);
  };

  const handleOpenVariantModal = (variantIndex) => {
    setSelectedVariantIndex(variantIndex);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setVariantToDelete(null);
  };

  const deleteVariant = () => {
    const newVariants = variants.filter((_, idx) => idx !== variantToDelete);
    const newRows = [...rows];
    newRows[index].variants = newVariants;
    setRows(newRows);
    closeDeleteModal();
    toast.error("Variant deleted successfully");
  };

  const handleAddVariant = () => {
    onAddVariant();
    toast.success("New variant added successfully");
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="flex items-center space-x-4 mb-4 bg-white shadow-lg p-6 rounded-xl">
        <span className="font-bold text-lg">{index + 1}</span>

        <div
          {...listeners}
          className="cursor-grab p-2 bg-gray-500 text-white rounded-lg origin-center rotate-90 hover:bg-gray-700   ">
          <MoreVertIcon />
        </div>
        <div className="w-[30%] bg-gray-100 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            {isEditing ? (
              <>
                <input
                  type="text"
                  className="w-full border rounded ml-2 p-2"
                  value={newFilter}
                  onChange={(e) => setNewFilter(e.target.value)}
                />
                <Button
                  variant="contained"
                  className="m-1"
                  onClick={handleSaveFilter}>
                  Save
                </Button>
              </>
            ) : (
              <>
                <span className="font-bold">{filter}</span>
              </>
            )}
            <div className="flex space-x-2">
              {!isEditing && (
                <>
                  <IconButton onClick={() => setIsEditing(true)}>
                    <EditIcon />
                  </IconButton>
                </>
              )}
              <IconButton>
                <DeleteIcon
                  onClick={onRemove}
                  className="text-red-500 hover:text-red-700 transition duration-300"
                />
              </IconButton>
            </div>
          </div>
        </div>
        <div className="flex-1 ">
          <div className="flex items-center">
            <div
              className={`flex space-x-4 ${
                showFullWidth ? "w-[calc(4.3*10rem+3*1rem)]" : "w-auto"
              } overflow-x-auto scrollbar-hide`}>
              {variants.map((variant, idx) => (
                <div
                  key={idx}
                  className="w-40 flex-shrink-0 bg-gray-100 rounded-lg p-3 relative group">
                  <div className="text-sm font-medium text-center mb-2">
                    {idx === 0 ? "Primary Variant" : `Variant ${idx + 1}`}
                  </div>
                  {variant.image ? (
                    <>
                      <img
                        src={variant.image.src || variant.image}
                        alt={variant.name}
                        className="w-full h-32 object-cover rounded-lg mb-2"
                      />
                      <p className="text-sm text-center">{variant.name}</p>
                    </>
                  ) : (
                    <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                      <span className="text-gray-500 text-sm">
                        {variant.name}
                      </span>
                    </div>
                  )}

                  <Button
                    onClick={() => handleOpenVariantModal(idx)}
                    className="w-full bg-blue-500 text-white py-1 px-2 rounded mt-2 opacity-0 group-hover:opacity-100 transition duration-300">
                    Upload
                  </Button>

                  {menuVisible[idx] && (
                    <div className="absolute top-0 right-0 mt-8 mr-2 bg-white border rounded-lg shadow-lg">
                      <button
                        onClick={() => openDeleteModal(idx)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {!showFullWidth && (
              <IconButton
                onClick={handleAddVariant}
                className="m-6 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300">
                <AddIcon />
              </IconButton>
            )}
            {showFullWidth && (
              <IconButton
                onClick={handleAddVariant}
                className="w-10 h-10 flex-shrink-0 bg-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-blue-600 transition duration-300 ml-4">
                <AddIcon />
              </IconButton>
            )}
          </div>
        </div>

        <AddProductModal
          open={selectedVariantIndex !== null}
          onClose={() => setSelectedVariantIndex(null)}
          onImageSelect={(item) =>
            onVariantImageChange(index, selectedVariantIndex, item)
          }
        />

        {deleteModalOpen && (
          <DeleteModel
            onConfirm={deleteVariant}
            onClose={closeDeleteModal}
            message="Are you sure you want to delete this variant?"
          />
        )}
      </div>
    </div>
  );
};

export default StateRow;
