import { IconButton, type IconButtonProps } from '@mui/material';
import { MdStar, MdStarOutline } from 'react-icons/md';

export type FavoriteIconButtonProps = IconButtonProps & {
  isFavorite?: boolean;
};

export function FavoriteIconButton({
  isFavorite,
  ...props
}: FavoriteIconButtonProps) {
  return (
    <IconButton size='small' color='warning' {...props}>
      {isFavorite ? <MdStar /> : <MdStarOutline />}
    </IconButton>
  );
}
