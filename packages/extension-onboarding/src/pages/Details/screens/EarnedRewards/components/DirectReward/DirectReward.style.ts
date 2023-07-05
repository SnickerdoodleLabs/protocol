import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
    badge: {
        "& .MuiBadge-badge": {
            height: 40,
            minWidth: 40,
            borderRadius: 20,
            fontSize: "1.1rem",
            top: -10,
            right: -10
        }
    }
}));
