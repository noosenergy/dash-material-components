/** @jsxImportSource @emotion/react */
import React from 'react';
import {DashComponentProps} from 'props';
import {css} from '@emotion/react';

const tabpanelLayoutStyle = css`
  height: 100%;
`;

const tabpanelContentLayoutStyle = css`
  height: 100%;
`;

const TabPanel = ({children, value, index}: TabPanelProps) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`card-tabpanel-${index}`}
      css={tabpanelLayoutStyle}
    >
      {value === index && <div css={tabpanelContentLayoutStyle}>{children}</div>}
    </div>
  );
};

type TabPanelProps = {
  // Current index of the TabPanel
  index: number;
  // Currently selected tab index
  value: number;
} & Partial<DashComponentProps>;

export default TabPanel;
