import React from 'react';

interface IProps {
  className?: string;
}

export const Row: React.FC<IProps> = ({ className, children }) => {
  return (
    <div className={ `row ${ className }` }>
      { children }
    </div>
  );
}
