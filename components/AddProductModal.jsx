import React from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Card,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import CloseIcon from "@mui/icons-material/Close";
import { SearchOutlined } from "@mui/icons-material";
import { imagesData } from "@/constant/constant";

function AddProductModal({ open, onClose, onImageSelect }) {
  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description">
        <Box className="fixed inset-0 flex items-center justify-center p-3">
          <Box className="bg-white w-1/2 h-1/2 shadow-lg p-6 overflow-auto relative">
            <Box className="flex justify-between items-center p-4 mb-2">
              <ImageIcon color="success" />
              <IconButton onClick={onClose}>
                <CloseIcon className="text-red-500" />
              </IconButton>
            </Box>
            <Box className="flex justify-between items-center p-4 mb-2">
              <Typography className="text-black">
                Select a design to link
              </Typography>
              <TextField
                id="input-with-icon-textfield"
                placeholder="Search"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchOutlined />
                    </InputAdornment>
                  ),
                }}
                variant="standard"
                className="mt-2"
              />
            </Box>
            <Card className="shadow-none">
              <Box className="flex justify-center items-center flex-wrap mt-4">
                {imagesData?.map((item) => (
                  <Box
                    key={item.id}
                    className="grid items-center p-4 m-2 h-full w-32 rounded-md cursor-pointer hover:bg-gray-100 transition-all"
                    onClick={() => {
                      onImageSelect(item);
                      onClose();
                    }}>
                    <img
                      src={item?.image?.src}
                      alt={item.name}
                      className="object-cover mb-2 rounded-lg"
                    />
                    <Typography className="text-sm">{item?.name}</Typography>
                  </Box>
                ))}
              </Box>
            </Card>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default AddProductModal;
