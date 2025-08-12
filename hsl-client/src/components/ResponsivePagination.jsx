import {
  Box,
  Pagination,
  PaginationItem,
  TablePagination,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const ResponsivePagination = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [10, 25, 50, 100],
  placeTopOnMobile = false,
  sx,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // number of pages (Pagination is 1-based)
  const totalPages = Math.max(1, Math.ceil(count / Math.max(1, rowsPerPage)));

  // mobile placement: top vs bottom
  const justify =
    isMobile && placeTopOnMobile ? "flex-start" : "center";

  if (isMobile) {
    // Compact mobile pager (no rows-per-page selector)
    return (
      <Box sx={{ display: "flex", justifyContent: justify, ...sx }}>
        <Pagination
          page={page + 1}
          count={totalPages}
          onChange={(_, p1) => onPageChange?.(_, p1 - 1)}
          renderItem={(item) => <PaginationItem {...item} />}
          siblingCount={0}
          boundaryCount={1}
          shape="rounded"
        />
      </Box>
    );
  }

  // Desktop/tablet: full TablePagination
  return (
    <Box sx={{ display: "flex", justifyContent: "center", ...sx }}>
      <TablePagination
        component="div"
        count={count}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={rowsPerPageOptions}
      />
    </Box>
  );
}

export default ResponsivePagination;
