import { Chip } from '@mui/material';
import { useMemo, useState } from 'react';
import ChopLines from 'chop-lines';
import PreloadImages from './PreloadImages';
import DOMPurify from 'dompurify';
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
          <Chip label="Collapse" onClick={() => setExpanded(false)} />
        </>
      ) : (
        <ChopLines
          maxHeight={200}
          ellipsis={<Chip label="Expand" onClick={() => setExpanded(true)} />}
        >
          <span dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
        </ChopLines>
      )}
    </>
  );
}
