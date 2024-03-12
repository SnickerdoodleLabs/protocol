import { Theme, makeStyles } from "@material-ui/core/styles";
import { colors } from "@shared-components/v2/theme";

interface DialogStylesProps {
  maxWidth?: number;
}

export const useDialogStyles = makeStyles((theme: Theme) => ({
  dialog: {
    "& .MuiDialogTitle-root": {
      padding: theme.spacing(3),
      paddingBottom: theme.spacing(4),
      [theme.breakpoints.down("xs")]: {
        padding: theme.spacing(1.5),
        paddingBottom: theme.spacing(2),
      },
    },
    "& .MuiDialogContent-root": {
      backgroundColor: colors.GREY50,
      borderTop: `1px solid ${colors.GREY400}`,
      borderBottom: `1px solid ${colors.GREY400}`,
      padding: theme.spacing(4),
      [theme.breakpoints.down("xs")]: {
        padding: theme.spacing(2),
      },
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(3),
      paddingTop: theme.spacing(1.5),
      paddingBottom: theme.spacing(1.5),
    },
    "& .MuiDialog-paper": {
      borderRadius: 12,
      maxWidth: (props: DialogStylesProps) => props.maxWidth ?? 640,
      [theme.breakpoints.down("xs")]: {
        margin: 8,
      },
    },
    "& .MuiDialog-paperFullWidth": {
      [theme.breakpoints.down("xs")]: {
        width: "unset",
        minWidth: "90%",
      },
    },
  },
}));
