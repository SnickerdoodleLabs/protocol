import { Box, Slide, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useMemo, useState } from "react";

interface Item {
  id: string; // extensionid
  name: string;
  address?: string;
  hasContent: boolean;
}

const PopupTabManager = () => {
  const [items, setItems] = useState<Record<string, Item>>({});
  const [selectedTabId, setSelectedTabId] = useState<string>();
  const classes = useStyles();

  const handleMessage = (event: MessageEvent) => {
    if (event.data.type === "popupContentUpdated") {
      const { id, name, address, hasContent } = event.data;
      setItems((prev) => ({
        ...prev,
        [event.data.id]: { id, name, address, hasContent },
      }));
    }
  };

  const tabs: Item[] = useMemo(() => {
    return Object.values(items).filter((item) => item.hasContent);
  }, [JSON.stringify(items)]);

  const tabsVisible = useMemo(() => {
    return tabs?.length > 1;
  }, [JSON.stringify(tabs)]);

  const onTabSelect = (id?: string) => {
    window.postMessage(
      {
        type: "selectedTabUpdated",
        id,
      },
      "*",
    );
  };

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    onTabSelect(selectedTabId);
  }, [selectedTabId]);

  useEffect(() => {
    if (!tabsVisible) {
      setSelectedTabId(undefined);
      return;
    }
    if (tabsVisible && !selectedTabId) {
      setSelectedTabId(tabs[0].id);
      return;
    }
    if (
      tabsVisible &&
      selectedTabId &&
      !tabs.find((tab) => tab.id === selectedTabId)
    ) {
      setSelectedTabId(tabs[0].id);
      return;
    }
  }, [tabs, tabsVisible, selectedTabId]);

  return (
    <>
      <Slide direction="right" in={tabsVisible} mountOnEnter unmountOnExit>
        <Box px={2} py={4} className={classes.container}>
          {tabs.map((tab) => {
            return (
              <Box
                className={classes.pointer}
                borderRadius={4}
                px={0.75}
                py={0.5}
                mb={0.5}
                key={tab.id}
                {...(tab.id === selectedTabId && {
                  bgcolor: "rgb(218, 216, 233)",
                })}
                onClick={() => setSelectedTabId(tab.id)}
              >
                <Typography className={classes.name}>{tab.name}</Typography>
              </Box>
            );
          })}
        </Box>
      </Slide>
    </>
  );
};

export default PopupTabManager;

const useStyles = makeStyles((theme) => ({
  container: {
    borderRadius: "0px 12px 12px 0px",
    backgroundColor: "#F3F2F8",
    position: "fixed",
    zIndex: 9999999999,
    top: "50%",
    transform: "translateY(-50%)",
    left: 0,
  },
  name: {
    all: "unset",
    fontSize: 12,
    fontFamily: "Roboto",
    color: "#000000",
  },
  pointer: {
    cursor: "pointer",
  },
}));
