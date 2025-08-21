import { useEffect, useState } from "react";
import { Fab, Zoom } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const ScrollToTopButton = ({ scrollContainer }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainer?.current) {
        const show = scrollContainer.current.scrollTop > 100;
        setVisible(show);
      }
    };

    const container = scrollContainer?.current;
    container?.addEventListener("scroll", handleScroll);

    return () => {
      container?.removeEventListener("scroll", handleScroll);
    };
  }, [scrollContainer]);

  const handleClick = () => {
    if (scrollContainer?.current) {
      scrollContainer.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <Zoom in={visible}>
      <Fab
        color="primary"
        size="small"
        onClick={handleClick}
        sx={{
          position: "fixed",
          bottom: { xs: 60, sm: 24 }, 
          right: 16,
          zIndex: 1000,
        }}
        aria-label="Scroll to top"
      >
        <KeyboardArrowUpIcon />
      </Fab>
    </Zoom>
  );
};

export default ScrollToTopButton;
