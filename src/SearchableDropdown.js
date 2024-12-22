import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Search } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
  Typography,
  Checkbox,
} from "@mui/material";
import debounce from "lodash.debounce";
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import PropTypes from "prop-types";
import { FixedSizeList } from "react-window";

import EmptyState from "./EmptyState";
import { getCamelCaseWord } from "./helper_functions";

const SearchableDropdown = ({
  data = [],
  onSelect,
  placeholder = "Search...",
  children,
  renderItem,
  renderSubChild,
  showCamelCase = false,
  hideSearch = false,
  getData,
  initialAPICall,
  searchLocal = true,
  totalData,
  multiSelect = false,
  renderEmptyState = null,
  emptyStateProps = {
    title: 'Un oh!',
    description: "Looks like there's no results found",
    imageWidth: '100px',
    imageHeight: '140px'
  },
  loadingIndicator,
  styles = {},
  debounceDelay = 400,
  ariaLabel = "Searchable Dropdown",
  pagination = false,
  dropdownWidth = 300,
  dropdownHeight = 300,
  labelKey = "label",
  itemHeight = 35, // Height of each list item
}) => {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refetchLoading, setRefetchLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    if (initialAPICall && getData) {
      _getData(1);
    }
  }, [initialAPICall]);

  const _toggleLoading = (page) =>
    page > 1
      ? setRefetchLoading((prev) => !prev)
      : setLoading((prev) => !prev);

  const displayedData = searchLocal ? filteredData : data;
  const flattenData = useMemo(
    () =>
      Array.isArray(displayedData)
        ? displayedData
        : typeof displayedData === "object"
          ? Object.values(displayedData).reduce(
            (acc, val) => acc.concat(val),
            []
          )
          : [],
    [displayedData]
  );

  const _getData = async (_page, searchQuery) => {
    _toggleLoading(_page);
    const payload = { page: _page, limit: 60 };
    if (searchQuery) payload.query = searchQuery;

    await getData(payload);
    _toggleLoading(_page);
  };

  const debounceFn = useCallback(
    debounce((value) => {
      if (!searchLocal) {
        _getData(1, value);
      } else {
        filterLocalData(value);
      }
    }, debounceDelay),
    [searchLocal, data]
  );

  const _handleSearchTextChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    debounceFn(value);
  };

  const filterLocalData = (searchQuery) => {
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = flattenData?.filter((item) =>
        (item[labelKey] || "").toLowerCase()?.includes(lowercasedQuery)
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  };

  useEffect(() => {
    if (searchLocal) {
      setFilteredData(data);
    }
  }, [data, searchLocal]);

  const handleItemSelect = (item) => {
    if (multiSelect) {
      setSelectedItems((prev) => {
        const isAlreadySelected = prev.some(
          (selected) => selected.id === item.id
        );
        return isAlreadySelected
          ? prev.filter((selected) => selected.id !== item.id)
          : [...prev, item];
      });
    } else {
      onSelect(item);
      setSearchText("");
    }
  };

  const renderMenuItem = (item) => (
    <MenuItem
      key={item?.id}
      onClick={() => handleItemSelect(item)}
      sx={{
        gap: 1,
        color: "#485359",
        fontSize: "14px",
        fontFamily: "Poppins",
      }}
    >
      {multiSelect && (
        <Checkbox checked={selectedItems.some((i) => i.id === item.id)} />
      )}
      {typeof renderItem === "function"
        ? renderItem(item)
        : showCamelCase
          ? getCamelCaseWord(item?.[labelKey])
          : item?.[labelKey]}
    </MenuItem>
  );

  return (
    <PopupState variant="popover" popupId="SearchableDropdown">
      {(popupState) => (
        <>
          <Box
            {...bindTrigger(popupState)}
            sx={{ cursor: "pointer", ...styles }}
            aria-label={ariaLabel}
          >
            {children}
          </Box>
          <Menu
            {...bindMenu(popupState)}
            sx={{ overflow: "hidden" }}
            slotProps={{
              paper: { sx: { overflow: "hidden", width: dropdownWidth } },
            }}
          >
            <Box maxWidth={dropdownWidth}>
              {!hideSearch && (
                <TextField
                  placeholder={placeholder}
                  variant="outlined"
                  sx={{
                    mb: 1,
                    m: 2,
                    width: dropdownWidth - 35,
                    borderRadius: "6px",
                  }}
                  InputProps={{
                    sx: { height: "45px" },
                    endAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                  value={searchText}
                  onChange={_handleSearchTextChange}
                />
              )}

              {typeof renderSubChild === "function" && renderSubChild()}

              {loading ? (
                <Box
                  my={2}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  {loadingIndicator ? loadingIndicator : <CircularProgress sx={{ width: "18px", height: "18px" }} />}
                </Box>
              ) : flattenData?.length > 0 ? (
                <FixedSizeList
                  height={dropdownHeight}
                  width={dropdownWidth}
                  itemSize={itemHeight}
                  itemCount={flattenData.length}
                  itemData={flattenData}
                >
                  {({ index, style }) => (
                    <Box style={style}>
                      {renderMenuItem(flattenData[index])}
                    </Box>
                  )}
                </FixedSizeList>
              ) : typeof renderEmptyState === "function" ? (
                renderEmptyState()
              ) : (
                <EmptyState {...emptyStateProps} />
              )}

              {pagination &&
                totalData !== flattenData?.length &&
                flattenData?.length !== 0 &&
                !loading && (
                  <Typography
                    textAlign="center"
                    sx={{
                      mt: 1,
                      fontSize: "14px",
                      color: "black",
                      fontFamily: "Poppins",
                      cursor: "pointer",
                      ":hover": {
                        color: "#333030",
                        textDecoration: "underline",
                      },
                    }}
                    onClick={() => {
                      const nextPage =
                        page === 1 && data?.length > 0 ? 2 : page + 1;
                      setPage(nextPage);
                      _getData(nextPage, searchText);
                    }}
                  >
                    {refetchLoading ? "Loading..." : "Load More"}
                  </Typography>
                )}
            </Box>
          </Menu>
        </>
      )}
    </PopupState>
  );
};

SearchableDropdown.propTypes = {
  data: PropTypes.array,
  onSelect: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  children: PropTypes.node,
  renderItem: PropTypes.func,
  hideSearch: PropTypes.bool,
  renderSubChild: PropTypes.func,
  showCamelCase: PropTypes.bool,
  emptyStateProps: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    imageWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    imageHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  getData: PropTypes.func,
  getFilteredData: PropTypes.func,
  searchLocal: PropTypes.bool,
  multiSelect: PropTypes.bool,
  emptyStateMessage: PropTypes.string,
  loadingIndicator: PropTypes.node,
  styles: PropTypes.object,
  debounceDelay: PropTypes.number,
  ariaLabel: PropTypes.string,
  pagination: PropTypes.bool,
  dropdownWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  dropdownHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  itemHeight: PropTypes.number,
  labelKey: PropTypes.string,
};

export default SearchableDropdown;
