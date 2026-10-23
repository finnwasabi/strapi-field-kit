import { Box, Typography } from '@strapi/design-system';
import { memo } from 'react';

import { getDisplayLabel, type LabelSource } from '../utils/getDisplayLabel';

const Input = memo((props: LabelSource) => (
  // Span every column of the edit-view grid so the divider always sits on its own row.
  <Box width="100%" style={{ gridColumn: '1 / -1' }}>
    <Box marginBottom={0} padding={3} background="neutral100" hasRadius>
      <Typography variant="omega" textColor="neutral800" fontWeight="semiBold" tag="div">
        {getDisplayLabel(props)}
      </Typography>
    </Box>
  </Box>
));

Input.displayName = 'SectionDividerInput';

export default Input;
