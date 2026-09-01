import { Drawer, IconButton, Stack } from '@mui/material';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import { useState } from 'react';
import { LuMenu } from 'react-icons/lu';
import { useLocation, useNavigate } from 'react-router';
import { Logo } from '../../../shared/ui/Logo.tsx';

export type NavMobileProps = {
  navLinks: Array<{ label: string; to: string }>;
};

export function NavMobile({ navLinks }: NavMobileProps) {
  const [showMenu, setShowMenu] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleIconButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.currentTarget.blur();
    setShowMenu((prev) => !prev);
  };

  const handleTreeItemClick = (_: unknown, itemId: string | number) => {
    setShowMenu(false);
    navigate(navLinks[Number(itemId)].to);
  };

  return (
    <>
      <IconButton onClick={handleIconButtonClick}>
        <LuMenu />
      </IconButton>

      <Drawer open={showMenu} onClose={() => setShowMenu(false)}>
        <Stack spacing={2} sx={{ width: 'min(60dvw, 300px)', p: 2 }}>
          <Logo isLink={false} />
          <SimpleTreeView
            selectedItems={navLinks
              .findIndex((o) => o.to === location.pathname)
              .toString()}
            onItemClick={handleTreeItemClick}
          >
            {navLinks.map(({ label }, index) => (
              <TreeItem key={index} itemId={index.toString()} label={label} />
            ))}
          </SimpleTreeView>
        </Stack>
      </Drawer>
    </>
  );
}
