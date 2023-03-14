import Checkbox from "@extension-onboarding/components/Checkbox";
import { useStyles } from "@extension-onboarding/components/TagSelection/TagSelection.style";
import { tags } from "@extension-onboarding/constants/tags";
import { Grid, Typography, Box, FormControlLabel } from "@material-ui/core";
import { ETag } from "@snickerdoodlelabs/objects";
import React, { FC, useState } from "react";

interface ITagSelectionProps {
  onSaveClick?: () => void;
}

const TagSelection: FC<ITagSelectionProps> = ({ onSaveClick }) => {
  const [selectedTags, setSelectedTags] = useState<ETag[]>();
  const classes = useStyles();
  const onCahange = (tag: ETag) => {
    if (selectedTags?.includes(tag)) {
      setSelectedTags(selectedTags.filter((_tag) => tag != _tag));
    } else {
      setSelectedTags(Array.from(new Set([...(selectedTags ?? []), tag])));
    }
  };

  return (
    <>
      <Box mb={3}>
        <Typography className={classes.description}>
          Choose your interest here and see rewards according your interest!
        </Typography>
      </Box>
      <Grid container spacing={3}>
        {tags.map((tagItem, index) => {
          return (
            <Grid key={index} item xs={2}>
              <img
                className={classes.image}
                width="100%"
                src={tagItem.iconUrl}
              />
              <Box display="flex" ml={0.5}>
                <FormControlLabel
                  control={
                    <Checkbox
                      value={tagItem.tag}
                      checked={selectedTags?.includes(tagItem.tag)}
                      onChange={() => {
                        onCahange(tagItem.tag);
                      }}
                    />
                  }
                  label={
                    <Typography className={classes.checkBoxLabel}>
                      {tagItem.defaultDisplayName}
                    </Typography>
                  }
                />
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default TagSelection;
