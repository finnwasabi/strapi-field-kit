import { Flex } from '@strapi/design-system';
import { ListPlus } from '@strapi/icons';
import { styled } from 'styled-components';

const IconBox = styled(Flex)`
  background-color: #fffbeb;
  border: 1px solid #fbbf24;

  svg {
    width: 15px;
    height: 15px;
  }

  svg > path {
    fill: #f59e0b;
  }
`;

export const PluginIcon = () => (
  <IconBox justifyContent="center" alignItems="center" width={7} height={6} hasRadius aria-hidden>
    <ListPlus />
  </IconBox>
);
