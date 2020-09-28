import React from 'react';
import withLeftDrawer from "../../hocs/withLeftDrawer";
import Drawer from '@material-ui/core/Drawer';

interface IProps {
  open: boolean;
}

export const LeftDrawer: React.FC<IProps> = ({open}) => {
  return (
    <div>
      <Drawer
        // className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          // paper: classes.drawerPaper,
        }}
      >
        salutare from drawer
      </Drawer>
    </div>
  );
}

// export default withLeftDrawer(LeftDrawer);
