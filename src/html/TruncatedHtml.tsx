import { Chip } from '@mui/material';
import { useState } from 'react';
import ChopLines from 'chop-lines';
import PreloadImages from './PreloadImages';
import { sanitizeHtml } from './sanitizeHtml';

type Props = {
  html: string;
};

export default function TruncatedHtml({ html }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [imagesPreloaded, setImagesPreloaded] = useState(false);
  const sanitizedHtml = sanitizeHtml(html);

  if (!imagesPreloaded) {
    return (
      <PreloadImages
        onLoad={() => setImagesPreloaded(true)}
        html={sanitizedHtml}
      />
    );
  }
  return (
    <>
      {expanded ? (
        <>
          <span dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
          <Chip
            label="Collapse"
            color="primary"
            onClick={() => setExpanded(false)}
          />
        </>
      ) : (
        <ChopLines
          maxHeight={150}
          ellipsis={
            <Chip
              label="Expand"
              color="primary"
              onClick={() => setExpanded(true)}
            />
          }
        >
          <span dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
        </ChopLines>
      )}
    </>
  );
}
