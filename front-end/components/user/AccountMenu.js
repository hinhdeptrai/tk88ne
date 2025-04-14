import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import LocalAtmOutlinedIcon from "@mui/icons-material/LocalAtmOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

const MUSIC_STATE_KEY = 'background_music_state';

const AccountMenuItem = styled(Box)(({ theme }) => ({
  cursor: "pointer",
  display: "flex",
  gap: "1rem",
  padding: "1rem",
  borderBottom: "1px solid #ccc",
  color: theme.palette.text.secondary,
  "& svg": {
    color: theme.palette.color.primary,
  },
  "& .title-menu": {
    fontSize: "1.7rem",
  },
}));

const listMenu = [
  {
    icon: <LocalAtmOutlinedIcon />,
    title: "Biến động số dư",
    url: "/balance-fluctuations",
  },
  {
    icon: <AccountBalanceOutlinedIcon />,
    title: "Liên kết ngân hàng",
    url: "/list-bank",
  },
  {
    icon: <MusicNoteIcon />,
    title: "Nhạc nền",
    type: "music"
  },
  {
    icon: <LogoutOutlinedIcon />,
    title: "Đăng xuất",
    url: "/sign-out",
  },
];

const AccountMenu = () => {
  const { data: session, status } = useSession();
  const [isPlaying, setIsPlaying] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem(MUSIC_STATE_KEY);
      return savedState ? JSON.parse(savedState) : true;
    }
    return true;
  });

  const handleMusicToggle = () => {
    if (window.toggleBackgroundMusic) {
      window.toggleBackgroundMusic();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <>
      <Box
        sx={{
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          marginTop: "4rem",
        }}
      >
        {session && session.user && session.user.role === "admin" && (
          <Link href={"/admin"}>
            <AccountMenuItem>
              <ManageAccountsIcon />
              <Typography className="title-menu">Quản lý</Typography>
            </AccountMenuItem>
          </Link>
        )}
        {listMenu.map((item, i) => {
          if (item.type === "music") {
            return (
              <AccountMenuItem 
                key={i} 
                onClick={handleMusicToggle}
                sx={{
                  '& svg': {
                    color: isPlaying ? 'primary.main' : 'inherit'
                  }
                }}
              >
                {item.icon}
                <Typography 
                  className="title-menu"
                  sx={{
                    color: isPlaying ? 'primary.main' : 'inherit'
                  }}
                >
                  {item.title} {isPlaying ? '(Đang phát)' : '(Đã tắt)'}
                </Typography>
              </AccountMenuItem>
            );
          }
          return (
            <Link key={i} href={item.url}>
              <AccountMenuItem>
                {item.icon}
                <Typography className="title-menu">{item.title}</Typography>
              </AccountMenuItem>
            </Link>
          );
        })}
      </Box>
    </>
  );
};

export default AccountMenu;
