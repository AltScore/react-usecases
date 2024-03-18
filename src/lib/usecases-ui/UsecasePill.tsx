import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import React from "react";

const DefaultUsecasePill = ({
  usecase,
  onUsecaseClicked,
}: DefaultUsecasePillProps) => {
  return (
    <Card
      sx={{
        width: 256,
        height: 256,
      }}
    >
      <CardActionArea onClick={() => onUsecaseClicked(usecase)}>
        <CardContent>
          <Typography variant={"h6"}>{usecase.name}</Typography>
          <Typography variant={"body2"}>{usecase.description}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
export { DefaultUsecasePill };

export interface UsecasePillProps {
  usecase: any;
  onUsecaseClicked: (usecase: any) => void;
}

interface DefaultUsecasePillProps extends UsecasePillProps {}
