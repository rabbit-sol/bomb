import {useCallback} from 'react';
import useBombFinance from '../../../hooks/useBombFinance';
import { Bank } from '../../../bomb-finance';
import useHandleTransactionReceipt from '../../../hooks/useHandleTransactionReceipt';

const useRedeem = (bank: Bank) => {
  const bombFinance = useBombFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleRedeem = useCallback(() => {
    handleTransactionReceipt(bombFinance.exit(bank.contract, bank.poolId), `Redeem ${bank.contract}`);
  }, [bank, bombFinance, handleTransactionReceipt]);

  return {onRedeem1: handleRedeem};
};

export default useRedeem;
