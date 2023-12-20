# Usecases-ui

UI Framework for uncoupled sequentual tasks determined according to business needs.


## Why??
The general structure of a website is by routing. Each page is a route and does one thing,
generally related to a specific entity. Once the user completes a sub-task in a page, he
needs to figure out where to go next for the next step in his complex task. This is not
always obvious, and it is not always the same.

So we created `usecases-ui`, a react-based framework that provides the user with
end-to-end experiences, user-journeys, or as we call it, usecases. Each usecase is 
defined by the business needs, so the user does not need to figure out where to go next.

For this it is necessary that an external provider (backend for example) computes the
current business state, and the user context (possibly using AI) to generate the
configuration for the possible usecases, i.e., a JSON structure.

## Getting started

Install with 

```
npm install usecases-ui
```

The following is a recommendation for a project structure

```
/src
    ...your-other-folders
    /usecases
        /tasks
            index.tsx // Unify and export all tasks
            Task1.tsx
            Task2.tsx
            ...
        /hooks // or could be in some other part of the project
        other-usecases-folders // for example sub components
```

## tasks/index.tsx

```tsx
import { TaskLogic } from "usecases-ui";
import {AliasRecord} from "../../types/aliasRecord";
import {Task1 } from "./Task1";
import {TaskA} from "./TaskA";
import {TaskAB} from "./TaskAB";
import {TasksShowcaserTask} from "./TasksShowcaser";

export const UsecasesTasks: AliasRecord<TaskLogic> = {
    Task1: Task1,
    TaskA: TaskA,
    TaskAB: TaskAB,
    TasksShowcaser: TasksShowcaserTask,
}

```

## tasks/{some-task}.tsx

```tsx
import {Button, Card, CardActionArea, CardContent, Paper, Stack, TextField, Typography} from "@mui/material";
import React, {useCallback, useMemo} from "react";
import {TaskInstanceProps, TaskLogic} from "usecases-ui";

type TaskShowcaserGateways = {
    tasks: ShowcaseTask[],
    done: string,
}

type ShowcaseTask = {
    title: string,
    alias: string,
    input: any,
};

type TaskShowcaserInput = {
}

export const TasksShowcaserTask: TaskLogic<TaskShowcaserGateways, TaskShowcaserInput> = {
    taskDefinition: {
        input: {},
    },
    gatewaysBuilder: (slots: any) => {
        return {
            tasks: slots.tasks,
            done: slots.done,
        }
    },
    Component: (props: TaskInstanceProps) => {
        const onTaskClicked = useCallback((task: ShowcaseTask) => {
            props.goTo(task.alias, task.input)
        }, [props])
        const renderTask = useCallback((taskParams: ShowcaseTask, key: any) => {
            return (
                <Card
                sx={{
                    minWidth: 200,
                }}
                key={key}
            >
                <CardActionArea
                    onClick={() => onTaskClicked(taskParams)}
                >
                    <CardContent>
                        <Typography variant={"h6"}>
                            {taskParams.title}
                        </Typography>
                        <Typography variant={"body2"}>
                            {`<Click to see>`}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
            )
        }, [onTaskClicked])
        const renderTasks = useMemo(() => {
            return props.gateways.tasks.map((task: ShowcaseTask, index: number) => {
                return renderTask(task, index)
            })
        }, [
            renderTask, props.gateways.tasks
        ])
        return (
            <Paper>
                <Typography>Tasks showcase</Typography>
                <Stack>
                    {renderTasks}
                </Stack>
                <Button
                    onClick={() => {
                        props.goTo(props.gateways.done, {})
                    }}
                >
                    Done
                </Button>
            </Paper>
        )
    },
}
```

## TaskLogic

This is the object that contains:
- The task component (react function component)
- The task definition (specific configuration)
- The gateways builder (function that builds the gateways from the task definition)

### Gateways ans Slots
The gateways object contains task-specific arguments that come from the
usecase data provider. Each task speaks its own language (very uncoupled), 
so we provide a way to convert what the provider sends into the task-specific
arguments called the gateways.

The data provided by the usecases data provider is called slots. Each task
has a set of slots defined. Slots can be anything we want, and they are read
by the gateways builder to build the gateways.

It is called gateways because mainly it is used to refer to external tasks. For
example, we can set a slot `done -> "Task1"` and the gateways builder will
in this case just return `done: Task1`. This gateway can be used by the 
task to call the `goTo` function to go to the next task.

### Task definition
The task definition is a JSON object that contains the task-specific configuration.
Currently no configuration is necessary, but in the future we will be able to set
default values, required values, and other things.

### Task component
This is the core logic of the task. It defines how the task looks like and what it does
exactly. Depending on what you want to do, you can redirect to an external task using
the `goTo` function. This is completely free to implement, so you can add your own hooks,
import components from outside, etc. But it is recommended that each task does only
one thing, UNLESS it is the main task for a specific *kind* of usecase, which wouldn't
allow for much reuse in different scenarios.


## The entrypoint of the application
Somewhere in your app you can just do, for example in next-js:

```tsx
// you can use a mock for this to try it out
const usecasesLoaderMock = async (_: string): Promise<UsecaseData[]> => {
    return usecasesData;
}

// in theory this could come directly from an AI-powered backend
const usecasesData: UsecaseData = [
    {
        id: "2",
        rootTaskInstanceInput: {},
        name: "Showcase Tasks",
        rootTaskInstanceAlias: "tasksShowcaser",
        description: "Showcase of all reusable tasks",
        taskInstances: {
            tasksShowcaser: {
                type: "TasksShowcaser",
                slots: {
                    tasks: [
                        {
                            title: "Task1",
                            alias: "task1",
                            input: {
                                yourInput: "yourInput",
                            },
                        },
                        {
                            title: "TaskA",
                            alias: "taskA",
                            input: {
                                yourInput: "yourInput",
                            },
                        },
                    ],
                    done: SystemAlias.EndUsecase,
                },
            },
            taskA: {
                type: "TaskA",
                slots: {
                    goBack: SystemAlias.ParentTask,
                    submit: "tasksShowcaser",
                },
            },
            Task1: {
                type: "Task1",
                slots: {
                    goBack: SystemAlias.ParentTask,
                },
            },
        },
    }
]

const Page: PageType = () => {
    usePageView();

    return (
        <>
            <UsecasesApp
                usecasesLoader={usecasesLoaderMock}
                appName={"usecases_example_index"}
                tasksLogic={UsecasesTasks}
            />
        </>
    );
};

export default Page;
```

## Usecase Data

This is what you need to feed the `UsecasesApp` component. It is a JSON object that
contains the usecase data. It is recommended that you use a mock for this to try it out.

### Usecase Data Structure


- `id`: string
- `name`: string
- `description`: string
- `rootTaskInstanceAlias`: string. This is the entrypoint, or first task of the usecase
- `rootTaskInstanceInput`: any. This is the input for the first task
- `taskInstances`: object. This is a dictionary of task instances. Each task instance has:
    - `type`: string. This is the alias of the task logic that will be used to render the task
    - `slots`: object. This is the slots object that will be used by the task logic to build the gateways


### System Aliases
These are protected aliases that are used by the system. They are:
- `ParentTask`: string. This is the alias of the parent task. It is used to go back to the parent task.
- `EndUsecase`: string. This is the alias of the task that will be called when the usecase is finished.
