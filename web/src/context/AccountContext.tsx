import React, { useState, createContext } from 'react';
import { IAccount } from '../interfaces/IAccount';

interface IContextProps {
  state?: IAccount;
  dispatch: (data: IAccount) => void;
}

export const AccountContext = createContext({} as IContextProps);

export const AccountProvider: React.FC = ({ children }) => {
  const [accountInfo, setAccountInfo] = useState<IAccount>();

  return (
    <AccountContext.Provider
      value={{ state: accountInfo, dispatch: (val: IAccount) => setAccountInfo(val) }}
    >
      {children}
    </AccountContext.Provider>
  );
};
