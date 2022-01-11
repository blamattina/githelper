import React, { useCallback } from 'react';
import TextField from '@mui/material/TextField';

type Props = {
  author: string;
  setAuthor(author: string): void;
};

function AuthorInput({ author, setAuthor }: Props) {
  const onChange = useCallback(
    (event) => {
      setAuthor(event.target.value);
    },
    [setAuthor]
  );
  return <TextField value={author} onChange={onChange} />;
}

export default AuthorInput;
