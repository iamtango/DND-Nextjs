"use client";
import React, { useState } from "react";
import StateRow from "../components/StateRow";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { toast, ToastContainer } from "react-toastify";
import DeleteModel from "@/components/DeleteModel";
import { imagesData } from "@/constant/constant";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";

import { v4 as uuidv4 } from "uuid";
const Home = () => {
  const [rows, setRows] = useState([
    {
      id: uuidv4(),
      filter: "Filter 1",
      variants: [
        {
          image: imagesData[0].image,
          name: imagesData[0].name,
        },
        {
          image: imagesData[1].image,
          name: imagesData[1].name,
        },
      ],
    },
    {
      id: uuidv4(),
      filter: "Filter 2",
      variants: [
        {
          image: imagesData[2].image,
          name: imagesData[2].name,
        },
        {
          image: imagesData[3].image,
          name: imagesData[3].name,
        },
      ],
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [variantMenuIndex, setVariantMenuIndex] = useState(null);

  const addRow = () => {
    const maxVariants = Math.max(...rows.map((row) => row.variants.length));
    const newVariants = Array.from({ length: maxVariants }, (_, idx) => ({
      image: null,
      name: `Variant ${idx + 1}`,
    }));
    setRows((prev) => [
      ...prev,
      {
        id: uuidv4(),
        // id: rows.length ? Math.max(rows.map((row) => row.id)) + 1 : 1,
        filter: `Filter ${rows.length + 1}`,
        variants: newVariants,
      },
    ]);
    toast.success("New row added!");
  };

  const confirmDeleteRow = (index) => {
    setRowToDelete(index);
    setModalOpen(true);
  };

  const removeRow = () => {
    setRows(rows.filter((_, idx) => idx !== rowToDelete));
    setRowToDelete(null);
    setModalOpen(false);
    toast.error("Row deleted!");
  };

  const addVariantForAll = () => {
    setRows(
      rows.map((row) => ({
        ...row,
        variants: [...row.variants, { image: null, name: `New Variant` }],
      }))
    );
  };

  const handleDragEnd = ({ active, over }) => {
    if (!over) return;
    if (active.id !== over?.id) {
      setRows((prevRows) => {
        const oldIndex = prevRows.findIndex((row) => row.id === active.id);
        const newIndex = prevRows.findIndex((row) => row.id === over?.id);
        return arrayMove(prevRows, oldIndex, newIndex);
      });
    }
  };

  const handleVariantImageChange = (rowIndex, variantIndex, item) => {
    console.log(`Updating row ${rowIndex}, variant ${variantIndex} with`, item);
    if (rowIndex >= 0 && rowIndex < rows.length) {
      const newRows = [...rows];
      if (
        variantIndex >= 0 &&
        variantIndex < newRows[rowIndex].variants.length
      ) {
        newRows[rowIndex].variants[variantIndex].image = item.image.src;
        newRows[rowIndex].variants[variantIndex].name = item.name;
        setRows(newRows);
        console.log("Updated rows:", newRows);
      }
    }
  };

  const handleFilterChange = (index, newFilter) => {
    const newRows = [...rows];
    newRows[index].filter = newFilter;
    setRows(newRows);
  };

  const handleOpenVariantMenu = (event, variantIndex) => {
    setAnchorEl(event.currentTarget);
    setVariantMenuIndex(variantIndex);
  };

  const handleCloseVariantMenu = () => {
    setAnchorEl(null);
    setVariantMenuIndex(null);
  };

  const handleDeleteVariant = () => {
    const newRows = rows.map((row) => ({
      ...row,
      variants: row.variants.filter((_, idx) => idx !== variantMenuIndex),
    }));
    setRows(newRows);
    handleCloseVariantMenu();
    toast.error("Variant deleted!");
  };

  const showFullWidth = rows[0].variants.length >= 4;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <header className="flex items-center justify-between pb-4 border-b">
        <h1 className="text-3xl font-bold text-gray-800">Rules Creation</h1>
        <button className="bg-green-500 text-white py-2 px-4 rounded-lg">
          Publish Feed
        </button>
      </header>
      <div className="mt-6">
        <div className="flex items-center space-x-4 mb-4 bg-white shadow-lg p-6 rounded-xl">
          <span className="opacity-0">1</span>
          <div className="p-2 opacity-0">
            <MoreVertIcon />
          </div>{" "}
          <div className="w-[30%] font-bold  border-l-2 pl-10 border-r-2 pr-10">
            Product Filter
          </div>
          <div className="flex-1 ">
            <div className="flex items-center">
              <div
                className={`flex space-x-4 ${
                  showFullWidth ? "w-[calc(4.3*10rem+3*1rem)]" : "w-auto"
                } overflow-x-auto scrollbar-hide`}>
                {rows[0].variants.map((_, i) => (
                  <div
                    key={i}
                    className="w-40 flex-shrink-0 bg-gray-100 rounded-lg p-3 relative group">
                    <div className="flex-1 text-start font-bold">
                      {i === 0 ? "Primary Variant" : `Variant ${i + 1}`}
                    </div>
                    <div className="absolute top-0 right-0 ml-2 text-gray-600 hover:text-gray-800">
                      <IconButton
                        onClick={(event) => handleOpenVariantMenu(event, i)}>
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleCloseVariantMenu}>
                        <MenuItem onClick={handleDeleteVariant}>
                          Delete
                        </MenuItem>
                      </Menu>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext
          items={rows.map((row) => row.id)}
          strategy={verticalListSortingStrategy}>
          {rows.map((row, index) => (
            <StateRow
              key={row.id}
              index={index}
              id={row.id}
              rows={rows}
              setRows={setRows}
              filter={row.filter}
              variants={row.variants}
              onRemove={() => confirmDeleteRow(index)}
              onAddVariant={addVariantForAll}
              onVariantImageChange={handleVariantImageChange}
              onFilterChange={handleFilterChange}
              showFullWidth={showFullWidth}
            />
          ))}
        </SortableContext>
      </DndContext>
      <IconButton
        onClick={addRow}
        className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300">
        <AddIcon />
      </IconButton>
      <ToastContainer />
      {modalOpen && (
        <DeleteModel
          onClose={() => setModalOpen(false)}
          onConfirm={removeRow}
          message="Are you sure you want to delete this row?"
        />
      )}
    </div>
  );
};

export default Home;
