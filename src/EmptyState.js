import React from "react";

import { Box, Typography } from "@mui/material";

import NoDataImg from "./no-data.png";

const EmptyState = ({ title, description, imageWidth, imageHeight }) => {
  return (
    <Box
      // width="100%"
      py={8}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Typography fontFamily="Montserrat" fontWeight={700} fontSize="30px">
        {title || "Uh oh!"}
      </Typography>
      <Typography fontFamily="Montserrat" fontWeight={500} maxWidth="550px" fontSize="15px" textAlign="center" color="#7D7D7D">
        {description || "Looks like there's no results found"}
      </Typography>
      <Box src={NoDataImg} component="img" width={imageWidth || "350px"} height={imageHeight || "340px"} draggable={false} />
    </Box>
  );
};

export default EmptyState;
