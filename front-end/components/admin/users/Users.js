import { ADMIN_LIST_USER_PAGE_SIZE } from "@/configs/user.config";
import useGetCountAllUser from "@/hooks/admin/useGetCountAllUser";
import useGetListUsers from "@/hooks/admin/useGetListUsers";
import { convertJSXMoney } from "@/utils/convertMoney";
import { convertDateTime } from "@/utils/convertTime";
import { convertJSXTinhTrangUser, convertTinhTrangUser } from "@/utils/convertTinhTrang";
import InfoIcon from "@mui/icons-material/Info";
import { Box, CircularProgress, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useRouter } from "next/router";
import { useState } from "react";
import BreadcrumbBar from "../BreadcrumbBar";
import BoxSearch from "./BoxSearch";

const BreadcrumbData = [
  {
    title: "Admin",
    href: "/admin",
  },
  {
    title: "Quản lý người dùng",
    href: "/admin/users",
  },
];
const Users = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(ADMIN_LIST_USER_PAGE_SIZE);
  const { data: dataQuery, isLoading } = useGetListUsers({ page: page + 1, pageSize, searchValue });
  const { data: rowCountState } = useGetCountAllUser();
  const GridRowsProp = dataQuery?.map((item, i) => ({
    id: item._id,
    action: item._id,
    stt: i + 1,
    taiKhoan: item.taiKhoan,
    money: item.money,
    role: item.role,

    status: item.status,

    createdAt: convertDateTime(item.createdAt),
  }));

  const GridColDef = [
    { field: "stt", headerName: "STT", width: 100 },
    { field: "taiKhoan", headerName: "Tài khoản", width: 100 },
    {
      field: "money",
      headerName: "Tổng tiền",
      width: 250,
      renderCell: (params) => {
        return convertJSXMoney(params.value);
      },
    },
    {
      field: "status",
      headerName: "Tình trạng",
      width: 250,

      renderCell: (params) => {
        return convertJSXTinhTrangUser(params.row.status);
      },

      valueGetter: (params) => {
        return convertTinhTrangUser(params.row.status);
      },
    },
    { field: "createdAt", headerName: "Thời gian tạo", width: 250 },
    { field: "role", headerName: "Role", width: 150 },

    {
      field: "action",
      headerName: "Thao tác",
      type: "actions",
      width: 150,
      getActions: (params) => [
        <IconButton onClick={() => router.push(`/admin/users/${params.id}`)}>
          <InfoIcon />
        </IconButton>,
      ],
    },
  ];

  return (
    <>
      <BreadcrumbBar data={BreadcrumbData} />
      <h1
        className="title"
        style={{
          fontSize: "2.5rem",
        }}
      >
        Danh sách người dùng
      </h1>
      <BoxSearch searchValue={searchValue} setSearchValue={setSearchValue} />

      <Box
        sx={{
          textAlign: "center",
          color: "text.secondary",
          height: 500,
          width: "100%",
          "& .trangthai_hoantat": {
            color: "#1fc67c",
          },
          "& .trangthai_dangcho": {
            color: "#1a3e72",
          },

          "& .MuiPaper-root ": {
            color: "#000000",
          },
        }}
      >
        {isLoading && <CircularProgress color="inherit" />}

        {!isLoading && (
          <DataGrid
            rowsPerPageOptions={[10, 50, 100]}
            pagination
            rowCount={rowCountState ?? 0}
            page={page}
            pageSize={pageSize}
            paginationMode="server"
            loading={isLoading}
            onPageChange={(newPage) => setPage(newPage)}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rows={GridRowsProp}
            columns={GridColDef}
            componentsProps={{
              panel: {
                sx: {
                  "& .MuiTypography-root": {
                    color: "dodgerblue",
                    fontSize: 20,
                  },
                  "& .MuiDataGrid-filterForm": {
                    bgcolor: "lightblue",
                  },
                },
              },
            }}
            sx={{
              color: "#000000",
              "& .MuiDataGrid-paper": {
                color: "#000000",
              },
              "& .MuiToolbar-root": {
                color: "#000000",
              },
              "& .MuiMenuItem-root": {
                color: "#000000",
              },
            }}
          />
        )}
      </Box>
    </>
  );
};
export default Users;
