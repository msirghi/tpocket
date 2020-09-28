import React from 'react';

const withLeftDrawer = (WrappedComponent: any) => (props: any) => {
  return (
    <div>
      <div>Left</div>
      <WrappedComponent { ...props }/>
    </div>
  )
}

export default withLeftDrawer;
