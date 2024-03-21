import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { AppDispatch, thunk_SetUsecasesData } from './state';
import { UsecaseData } from '@/lib/usecases-ui/UsecaseClass';

type UsecasesLoader = (textQuery: string) => Promise<UsecaseData[]>;

export const useLoadUsecases = (usecasesLoader: UsecasesLoader, dispatch: AppDispatch) => {
    const [loading, setLoading] = useState(false);
    const reloadUsecases = useCallback(
        async (textQuery: string) => {
            setLoading(true);
            const usecasesData = await usecasesLoader(textQuery);
            await dispatch(thunk_SetUsecasesData({ usecasesData }));
            console.log('loaded usecasesData', usecasesData);
            setLoading(false);
        },
        [dispatch, usecasesLoader, setLoading],
    );
    return {
        reloadUsecases,
        loading,
    };
};

export const useTextQuery = () => {
    const [textQuery, setTextQuery] = useState('');

    const setTextQueryHandler = useCallback(
        (textQuery: string) => {
            setTextQuery(textQuery);
        },
        [setTextQuery],
    );
    return {
        textQuery,
        setTextQuery: setTextQueryHandler,
    };
};
