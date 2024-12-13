import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useAuth} from './useAuth';
import {getMarket} from '../api/marketAPI';
import {isMarketTime} from '../helpers/utils';
import {updateMarketData} from '../redux/actions/portfolioActions';
import {useCommonErrorChecker} from './useCommonErrorChecker';

const useMarketData = () => {
    const dispatch = useDispatch();
    const {isAuthenticated} = useAuth();
    const checkCommonErrors = useCommonErrorChecker();

    const fetchMarketData = () => {
        if (!isAuthenticated) return;
        getMarket()
            .then((response) => {
                dispatch(updateMarketData(response));
            })
            .catch((error) => {
                checkCommonErrors(error);
            });
    };

    useEffect(() => {
        fetchMarketData();
        const intervalId = setInterval(() => {
            if (!isMarketTime()) return;
            fetchMarketData();
        }, 25000);
        return () => clearInterval(intervalId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);
};

export default useMarketData;
