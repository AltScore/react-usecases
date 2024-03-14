import { Provider as ReduxProvider } from "react-redux";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { DefaultUsecasesBar } from "./usecasesBar";
import { DefaultUsecaseContainer } from "./DefaultUsecaseContainer";
import { DefaultUsecasePill, UsecasePillProps } from "./UsecasePill";
import {
  AppDispatch,
  store,
  thunk_AppSetup,
  thunk_SelectUsecase,
  thunk_SetUsecasesData,
  useDispatch,
  useSelector,
} from "./state";
import { TaskLogic } from "@/lib/usecases-ui/task";
import { initUsecasesApp } from "@/lib/usecases-ui/usecasesApp";
import { AliasRecord } from "@/lib/utils";
import { UsecaseData } from "@/lib/usecases-ui/UsecaseClass";
import { TaskInstance } from "@/lib/usecases-ui/TaskInstance";

export interface UsecasesBarProps {
  setTextQuery: (textQuery: string) => void;
}

type UsecasesLoader = (textQuery: string) => Promise<UsecaseData[]>;

const useLoadUsecases = (
  usecasesLoader: UsecasesLoader,
  dispatch: AppDispatch
) => {
  const [loading, setLoading] = useState(false);
  const reloadUsecases = useCallback(
    async (textQuery: string) => {
      setLoading(true);
      const usecasesData = await usecasesLoader(textQuery);
      await dispatch(thunk_SetUsecasesData({ usecasesData }));
      console.log("loaded usecasesData", usecasesData);
      setLoading(false);
    },
    [dispatch, usecasesLoader, setLoading]
  );
  return {
    reloadUsecases,
    loading,
  };
};

const useTextQuery = () => {
  const [textQuery, setTextQuery] = useState("");

  const setTextQueryHandler = useCallback(
    (textQuery: string) => {
      setTextQuery(textQuery);
    },
    [setTextQuery]
  );
  return {
    textQuery,
    setTextQuery: setTextQueryHandler,
  };
};

type UsecasesProps = {
  usecasesLoader: (textQuery: string) => Promise<UsecaseData[]>;
  IntroTitle?: string;
  // UsecasePill is a function that will be used like <UsecasePill usecase={usecase}/>
  UsecasePill?: React.FC<UsecasePillProps>;
  UsecasesBar?: React.FC<UsecasesBarProps> | null;
  tasksLogic: AliasRecord<TaskLogic>;
  // usecase container has children
  UsecaseContainer?: React.FC<{
    children: ReactNode;
  }>;
  appName: string;
};
const Usecases = ({
  // strategy components
  usecasesLoader,
  UsecasePill = DefaultUsecasePill,
  IntroTitle = "",
  // app logic components
  tasksLogic,
  appName,
  UsecasesBar = DefaultUsecasesBar,
  UsecaseContainer = DefaultUsecaseContainer,
}: UsecasesProps) => {
  // UI controls

  const [showPills, setShowPills] = useState(true);
  const [showBar, setShowBar] = useState(true);
  const [showUseCase, setShowUsecase] = useState(false);

  // app state TODO change to a usecases slice?
  const tasksState = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

  // usecase loading
  const { textQuery, setTextQuery } = useTextQuery();
  const { reloadUsecases, loading } = useLoadUsecases(usecasesLoader, dispatch);

  useEffect(() => {
    reloadUsecases("").catch(console.error);
  }, [reloadUsecases]);

  useEffect(() => {
    reloadUsecases(textQuery).catch(console.error);
  }, [textQuery]);

  useEffect(() => {
    console.log("initiating app component");
    initUsecasesApp(appName, tasksLogic);
    dispatch(
      thunk_AppSetup({
        appName,
      })
    );
  }, [appName, tasksLogic, dispatch]);

  const onUsecaseClicked = useCallback(
    (usecase: UsecaseData) => {
      // setShowPills(false)
      // setShowBar(false)
      dispatch(thunk_SelectUsecase({ usecaseId: usecase.id }));
    },
    [dispatch]
  );

  const usecaseSelectedId = tasksState?.currentUsecaseState?.usecaseData.id;
  console.log(tasksState);

  useEffect(() => {
    console.log("usecaseSelectedId", usecaseSelectedId);
    if (usecaseSelectedId) {
      setShowPills(false);
      setShowBar(false);
      setShowUsecase(true);
    } else {
      setShowPills(true);
      setShowBar(true);
      setShowUsecase(false);
      // reload usecases
      if (textQuery !== "") {
        setTextQuery("");
      } else {
        reloadUsecases("").catch(console.error);
      }
    }
  }, [usecaseSelectedId]);

  const usecasesData = tasksState?.usecasesData;

  return (
    <Stack
      height={"100%"}
      width={"100%"}
      direction={"row"}
      alignItems={"start"}
      justifyContent={"center"}
    >
      <Stack
        height={"100%"}
        width={"100%"}
        direction={"column"}
        justifyContent={"start"}
        alignItems={"center"}
        spacing={2}
      >
        {showBar && !loading && UsecasesBar && (
          <UsecasesBar setTextQuery={setTextQuery} />
        )}
        {showPills && !loading && usecasesData && (
          <Box
            width={"100%"}
            height={"100%"}
            alignItems={"start"}
            marginBottom={"12px"}
          >
            {IntroTitle != "" && (
              <Typography
                alignItems={"start"}
                justifyContent={"start"}
                justifySelf={"start"}
                variant={"h4"}
              >
                {IntroTitle}
              </Typography>
            )}
          </Box>
        )}
        {showPills && !loading && (
          <Stack
            direction={"column"}
            spacing={"24px"}
            justifySelf={"start"}
            justifyContent={"start"}
            alignItems={"start"}
          >
            <Stack
              width={"100%"}
              direction={"row"}
              gap={"1rem"}
              flexWrap={"wrap"}
              justifyContent={"start"}
              alignItems={"start"}
            >
              {usecasesData &&
                usecasesData.map((usecaseData, index) => {
                  return (
                    <UsecasePill
                      key={index}
                      usecase={usecaseData}
                      onUsecaseClicked={onUsecaseClicked}
                    />
                  );
                })}
            </Stack>
          </Stack>
        )}
        {showUseCase && tasksState?.currentUsecaseState && (
          <UsecaseContainer>
            <TaskInstance />
          </UsecaseContainer>
        )}
      </Stack>
    </Stack>
  );
};

const UsecasesApp = (props: UsecasesProps) => {
  return (
    <ReduxProvider store={store}>
      <Usecases {...props} />
    </ReduxProvider>
  );
};

export { UsecasesApp };
